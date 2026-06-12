export type Point = { x: number; y: number };

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function distance(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function sampleSvgPath(path: string, sampleCount = 128): Point[] {
  const segments = parseSvgPath(path);
  const polyline: Point[] = [];
  for (const segment of segments) {
    if (segment.type === 'M') {
      polyline.push({ x: segment.to.x, y: segment.to.y });
      continue;
    }
    const from = segment.from;
    const to = segment.to;
    const steps = segment.type === 'L' ? 1 : Math.max(8, Math.ceil(segment.approxLength / 8));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      polyline.push(sampleSegmentPoint(segment, t));
    }
    // Preserve continuity
    if (!polyline.length || distance(polyline[polyline.length - 1]!, to) > 0.01) {
      polyline.push({ x: to.x, y: to.y });
    }
    void from;
  }
  if (polyline.length < 2) return polyline;
  const total = polylineLength(polyline);
  if (total <= 0) return polyline;
  const resampled: Point[] = [];
  const step = total / Math.max(2, sampleCount - 1);
  let target = 0;
  let traversed = 0;
  resampled.push(polyline[0]!);
  for (let i = 1; i < polyline.length; i++) {
    const prev = polyline[i - 1]!;
    const curr = polyline[i]!;
    const segLen = distance(prev, curr);
    if (segLen <= 0) continue;
    while (target + step <= traversed + segLen) {
      const local = (target + step - traversed) / segLen;
      resampled.push({
        x: prev.x + (curr.x - prev.x) * local,
        y: prev.y + (curr.y - prev.y) * local,
      });
      target += step;
    }
    traversed += segLen;
  }
  const last = polyline[polyline.length - 1]!;
  if (distance(resampled[resampled.length - 1]!, last) > 0.01) resampled.push(last);
  return resampled;
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
