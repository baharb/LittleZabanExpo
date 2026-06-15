export type Point = { x: number; y: number };
export type SampledPoint = {
  x: number;
  y: number;
  index: number;
  distanceAlongPath: number;
  progress: number;
};

export type StrokeProgressState = {
  strokeId: string;
  progress: number;
  completed: boolean;
};

export type ValidationResult = {
  accepted: boolean;
  progress: number;
  reason?: 'too_far' | 'wrong_start' | 'jumped_too_far' | 'backward' | 'accepted';
};

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function distance(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function sampleSvgPath(path: string, sampleCount = 128): SampledPoint[] {
  const segments = parseSvgPath(path);
  const total = segments.reduce((sum, segment) => sum + (segment.type === 'M' ? 0 : segment.approxLength), 0);
  if (!Number.isFinite(total) || total <= 0) return [];
  const count = Math.max(2, sampleCount);
  const out: SampledPoint[] = [];
  for (let i = 0; i < count; i++) {
    const distanceAlongPath = total * (i / (count - 1));
    const point = pointAtLengthOnParsedPath(segments, distanceAlongPath, total);
    out.push({
      x: point.x,
      y: point.y,
      index: i,
      distanceAlongPath,
      progress: distanceAlongPath / total,
    });
  }
  return out;
}

export function sampleSvgPathPoints(path: string, sampleCount = 128): Point[] {
  return sampleSvgPath(path, sampleCount).map(p => ({ x: p.x, y: p.y }));
}

export function polylineLength(points: Point[]) {
  let sum = 0;
  for (let i = 1; i < points.length; i++) sum += distance(points[i - 1]!, points[i]!);
  return sum;
}

export function pointAtProgress(points: Point[], progress: number) {
  if (!points.length) return { x: 0, y: 0 };
  if (points.length === 1) return points[0]!;
  const target = clamp(progress, 0, 1) * polylineLength(points);
  let traversed = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const segLen = distance(prev, curr);
    if (segLen <= 0) continue;
    if (traversed + segLen >= target) {
      const local = (target - traversed) / segLen;
      return {
        x: prev.x + (curr.x - prev.x) * local,
        y: prev.y + (curr.y - prev.y) * local,
      };
    }
    traversed += segLen;
  }
  return points[points.length - 1]!;
}

export function pathSegmentPath(points: Point[], progress: number) {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;
  const target = clamp(progress, 0, 1) * polylineLength(points);
  let traversed = 0;
  const used: Point[] = [points[0]!];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const segLen = distance(prev, curr);
    if (segLen <= 0) continue;
    if (traversed + segLen < target) {
      used.push(curr);
      traversed += segLen;
      continue;
    }
    const local = segLen === 0 ? 1 : (target - traversed) / segLen;
    used.push({
      x: prev.x + (curr.x - prev.x) * clamp(local, 0, 1),
      y: prev.y + (curr.y - prev.y) * clamp(local, 0, 1),
    });
    break;
  }
  return used.map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

export function angleBetween(a: Point, b: Point) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

export function nearestIndex(points: Point[], point: Point, startIndex = 0, lookAhead = 12) {
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  const limit = Math.min(points.length - 1, startIndex + lookAhead);
  for (let i = Math.max(0, startIndex); i <= limit; i++) {
    const d = distance(points[i]!, point);
    if (d < bestDistance) {
      bestDistance = d;
      bestIndex = i;
    }
  }
  return { index: bestIndex, distance: bestDistance };
}

export function getNearestPointOnSamples(x: number, y: number, samples: SampledPoint[]) {
  let point = samples[0];
  let index = 0;
  let distanceToPoint = Number.POSITIVE_INFINITY;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i]!;
    const d = Math.hypot(sample.x - x, sample.y - y);
    if (d < distanceToPoint) {
      point = sample;
      index = i;
      distanceToPoint = d;
    }
  }
  return {
    point: point ?? { x, y, index: 0, distanceAlongPath: 0, progress: 0 },
    index,
    distance: distanceToPoint,
    progress: point?.progress ?? 0,
  };
}

export function screenToSvgCoordinates(
  point: Point,
  layout: { x: number; y: number; width: number; height: number },
  viewBox: { width: number; height: number },
) {
  return {
    x: ((point.x - layout.x) / Math.max(1, layout.width)) * viewBox.width,
    y: ((point.y - layout.y) / Math.max(1, layout.height)) * viewBox.height,
  };
}

export function validateStrokeMove(params: {
  point: Point;
  samples: SampledPoint[];
  currentProgress: number;
  tolerance: number;
  startTolerance?: number;
}): ValidationResult {
  const { point, samples, currentProgress, tolerance, startTolerance = tolerance * 0.8 } = params;
  if (!samples.length) return { accepted: false, progress: currentProgress, reason: 'too_far' };
  const currentIndex = Math.max(0, Math.floor(currentProgress * (samples.length - 1)));
  const nearest = getNearestPointOnSamples(point.x, point.y, samples);
  const start = samples[0]!;
  const startDistance = distance(point, start);
  if (currentProgress <= 0.001 && startDistance > startTolerance) {
    return { accepted: false, progress: 0, reason: 'wrong_start' };
  }
  if (nearest.distance > tolerance) {
    return { accepted: false, progress: currentProgress, reason: 'too_far' };
  }
  if (nearest.index + 4 < currentIndex) {
    return { accepted: false, progress: currentProgress, reason: 'backward' };
  }
  const nextProgress = Math.max(currentProgress, nearest.progress);
  if (nextProgress - currentProgress > 0.18) {
    return { accepted: false, progress: currentProgress, reason: 'jumped_too_far' };
  }
  return { accepted: true, progress: nextProgress, reason: 'accepted' };
}

export function calculateDashOffset(pathLength: number, progress: number) {
  return pathLength - clamp(progress, 0, 1) * pathLength;
}

export function mirrorSvgPathX(path: string, width: number) {
  const segments = parseSvgPath(path);
  const mirrored = segments.map(segment => {
    if (segment.type === 'M') {
      return { type: 'M' as const, to: { x: width - segment.to.x, y: segment.to.y } };
    }
    if (segment.type === 'L') {
      return {
        type: 'L' as const,
        from: { x: width - segment.from.x, y: segment.from.y },
        to: { x: width - segment.to.x, y: segment.to.y },
        approxLength: segment.approxLength,
      };
    }
    if (segment.type === 'Q') {
      return {
        type: 'Q' as const,
        from: { x: width - segment.from.x, y: segment.from.y },
        cp1: { x: width - segment.cp1.x, y: segment.cp1.y },
        to: { x: width - segment.to.x, y: segment.to.y },
        approxLength: segment.approxLength,
      };
    }
    if (segment.type === 'C') {
      return {
        type: 'C' as const,
        from: { x: width - segment.from.x, y: segment.from.y },
        cp1: { x: width - segment.cp1.x, y: segment.cp1.y },
        cp2: { x: width - segment.cp2.x, y: segment.cp2.y },
        to: { x: width - segment.to.x, y: segment.to.y },
        approxLength: segment.approxLength,
      };
    }
    return segment;
  });
  return serializeParsedSegments(mirrored);
}

function sampleSegmentPoint(segment: ParsedSegment, t: number): Point {
  if (segment.type === 'M') return { x: segment.to.x, y: segment.to.y };
  if (segment.type === 'L') {
    return {
      x: segment.from.x + (segment.to.x - segment.from.x) * t,
      y: segment.from.y + (segment.to.y - segment.from.y) * t,
    };
  }
  if (segment.type === 'Q') {
    const u = 1 - t;
    return {
      x: u * u * segment.from.x + 2 * u * t * segment.cp1.x + t * t * segment.to.x,
      y: u * u * segment.from.y + 2 * u * t * segment.cp1.y + t * t * segment.to.y,
    };
  }
  const u = 1 - t;
  return {
    x:
      u * u * u * segment.from.x +
      3 * u * u * t * segment.cp1.x +
      3 * u * t * t * segment.cp2.x +
      t * t * t * segment.to.x,
    y:
      u * u * u * segment.from.y +
      3 * u * u * t * segment.cp1.y +
      3 * u * t * t * segment.cp2.y +
      t * t * t * segment.to.y,
  };
}

function pointAtLengthOnParsedPath(segments: ParsedSegment[], distanceAlongPath: number, totalLength: number): Point {
  if (!segments.length) return { x: 0, y: 0 };
  if (segments.length === 1) {
    const only = segments[0]!;
    return only.type === 'M' ? only.to : sampleSegmentPoint(only, 1);
  }
  const target = clamp(distanceAlongPath, 0, totalLength);
  let traversed = 0;
  let lastPoint: Point = segments[0]!.type === 'M' ? segments[0]!.to : { x: 0, y: 0 };

  for (const segment of segments) {
    if (segment.type === 'M') {
      lastPoint = segment.to;
      if (target <= 0) return lastPoint;
      continue;
    }

    const segLen = Math.max(0.0001, segment.approxLength);
    if (traversed + segLen >= target) {
      const local = (target - traversed) / segLen;
      return sampleSegmentPoint(segment, clamp(local, 0, 1));
    }
    traversed += segLen;
    lastPoint = segment.to;
  }

  return lastPoint;
}

type ParsedSegment =
  | { type: 'M'; to: Point }
  | { type: 'L'; from: Point; to: Point; approxLength: number }
  | { type: 'Q'; from: Point; cp1: Point; to: Point; approxLength: number }
  | { type: 'C'; from: Point; cp1: Point; cp2: Point; to: Point; approxLength: number };

function parseSvgPath(path: string): ParsedSegment[] {
  const tokens = path.match(/[MLQCZmlqcz]|-?\d*\.?\d+/g) ?? [];
  let index = 0;
  let cursor: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };
  const out: ParsedSegment[] = [];

  const nextNumber = () => Number(tokens[index++] ?? 0);

  while (index < tokens.length) {
    const token = tokens[index++];
    if (!token) break;
    const cmd = token.toUpperCase();
    if (cmd === 'M') {
      const x = nextNumber();
      const y = nextNumber();
      cursor = { x, y };
      start = { x, y };
      out.push({ type: 'M', to: cursor });
      continue;
    }
    if (cmd === 'L') {
      const x = nextNumber();
      const y = nextNumber();
      const next = { x, y };
      out.push({ type: 'L', from: cursor, to: next, approxLength: distance(cursor, next) });
      cursor = next;
      continue;
    }
    if (cmd === 'Q') {
      const cp1 = { x: nextNumber(), y: nextNumber() };
      const next = { x: nextNumber(), y: nextNumber() };
      out.push({ type: 'Q', from: cursor, cp1, to: next, approxLength: distance(cursor, cp1) + distance(cp1, next) });
      cursor = next;
      continue;
    }
    if (cmd === 'C') {
      const cp1 = { x: nextNumber(), y: nextNumber() };
      const cp2 = { x: nextNumber(), y: nextNumber() };
      const next = { x: nextNumber(), y: nextNumber() };
      out.push({
        type: 'C',
        from: cursor,
        cp1,
        cp2,
        to: next,
        approxLength: distance(cursor, cp1) + distance(cp1, cp2) + distance(cp2, next),
      });
      cursor = next;
      continue;
    }
    if (cmd === 'Z') {
      const next = { x: start.x, y: start.y };
      out.push({ type: 'L', from: cursor, to: next, approxLength: distance(cursor, next) });
      cursor = next;
    }
  }

  return out;
}

function serializeParsedSegments(segments: ParsedSegment[]) {
  return segments.map(segment => {
    if (segment.type === 'M') return `M ${segment.to.x} ${segment.to.y}`;
    if (segment.type === 'L') return `L ${segment.to.x} ${segment.to.y}`;
    if (segment.type === 'Q') return `Q ${segment.cp1.x} ${segment.cp1.y} ${segment.to.x} ${segment.to.y}`;
    if (segment.type === 'C') return `C ${segment.cp1.x} ${segment.cp1.y} ${segment.cp2.x} ${segment.cp2.y} ${segment.to.x} ${segment.to.y}`;
    return 'Z';
  }).join(' ');
}
