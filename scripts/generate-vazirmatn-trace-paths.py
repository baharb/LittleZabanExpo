from __future__ import annotations

from collections import deque
from pathlib import Path
import math

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
TRACE_DIR = ROOT / 'assets' / 'neli-world' / 'trace-letters'
OUT_FILE = ROOT / 'src' / 'data' / 'vazirmatnTracePaths.generated.ts'
VIEWBOX = 200.0

# Manual overrides for letters where the skeletonized path needs a clearer
# teaching order than the automatically extracted centerline.
MANUAL_PATHS = {
    'be': 'M 159.4 58.6 C 159.4 84.0 148.0 101.0 130.0 105.5 C 112.0 109.0 88.0 109.0 70.0 105.5 C 52.0 101.0 40.6 84.0 40.6 58.6',
    'pe': 'M 159.4 53.3 C 159.4 78.4 148.0 95.4 130.0 99.9 C 112.0 103.4 88.0 103.4 70.0 99.9 C 52.0 95.4 40.6 78.4 40.6 53.3',
    'te': 'M 159.4 85.8 C 159.4 110.9 148.0 127.9 130.0 132.4 C 112.0 135.9 88.0 135.9 70.0 132.4 C 52.0 127.9 40.6 110.9 40.6 85.8',
    'se': 'M 159.4 95.8 C 159.4 120.9 148.0 137.9 130.0 142.4 C 112.0 145.9 88.0 145.9 70.0 142.4 C 52.0 137.9 40.6 120.9 40.6 95.8',
    'dal': 'M 83.6 60.7 L 116.4 81.6 L 129.4 94.5 L 134.3 103.5 L 137.3 118.4 L 135.3 129.4 L 124.4 138.3 L 92.5 144.3 L 65.7 144.3 L 56.0 144.6',
    'sin': 'M 172.9 67.8 L 171.8 87.0 L 164.9 98.7 L 151.1 101.9 L 133.0 95.5 L 114.9 102.4 L 94.7 98.7 L 86.7 116.8 L 81.4 122.1 L 73.9 126.3 L 60.1 129.0 L 44.1 126.3 L 30.3 115.2 L 27.1 91.8 L 27.7 84.3 L 31.4 81.1',
    'zhe': 'M 117.1 87.0 L 123.0 112.3 L 120.1 130.9 L 113.4 140.5 L 104.5 147.2 L 89.6 153.0 L 81.5 154.4 L 74.1 155.5',
    'he-jimi': 'M 65.7 41.7 L 113.8 50.4 L 119.3 53.5 L 124.8 65.4 L 118.5 71.7 L 86.2 78.7 L 65.7 93.7 L 58.7 113.4 L 59.4 127.6 L 64.2 137.8 L 82.3 151.2 L 109.1 155.9 L 136.6 151.2 L 148.4 133.1',
    'khe': 'M 69.8 60.4 L 82.1 62.1 L 96.0 64.5 L 110.6 67.8 L 120.0 72.0 L 123.9 78.6 L 122.8 84.6 L 117.0 88.8 L 105.8 91.6 L 90.6 94.1 L 75.5 101.2 L 65.4 113.1 L 63.5 123.6 L 64.2 136.1 L 68.4 145.1 L 83.7 156.9 L 108.7 161.1 L 133.0 156.2 L 142.7 141.0',
}


def largest_component(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    best: list[tuple[int, int]] = []

    for y in range(h):
        for x in range(w):
            if not mask[y, x] or visited[y, x]:
                continue
            q = deque([(y, x)])
            visited[y, x] = True
            comp: list[tuple[int, int]] = []
            while q:
                cy, cx = q.popleft()
                comp.append((cy, cx))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        if dy == 0 and dx == 0:
                            continue
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not visited[ny, nx]:
                            visited[ny, nx] = True
                            q.append((ny, nx))
            if len(comp) > len(best):
                best = comp

    out = np.zeros_like(mask, dtype=bool)
    for y, x in best:
        out[y, x] = True
    return out


def thin_zhang_suen(mask: np.ndarray) -> np.ndarray:
    img = mask.astype(np.uint8).copy()
    h, w = img.shape
    changed = True
    while changed:
        changed = False
        for step in (0, 1):
            remove: list[tuple[int, int]] = []
            ys, xs = np.where(img == 1)
            for y, x in zip(ys.tolist(), xs.tolist()):
                p2 = img[y - 1, x] if y - 1 >= 0 else 0
                p3 = img[y - 1, x + 1] if y - 1 >= 0 and x + 1 < w else 0
                p4 = img[y, x + 1] if x + 1 < w else 0
                p5 = img[y + 1, x + 1] if y + 1 < h and x + 1 < w else 0
                p6 = img[y + 1, x] if y + 1 < h else 0
                p7 = img[y + 1, x - 1] if y + 1 < h and x - 1 >= 0 else 0
                p8 = img[y, x - 1] if x - 1 >= 0 else 0
                p9 = img[y - 1, x - 1] if y - 1 >= 0 and x - 1 >= 0 else 0

                neighbors = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9
                if neighbors < 2 or neighbors > 6:
                    continue
                seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2]
                transitions = sum((seq[i] == 0 and seq[i + 1] == 1) for i in range(8))
                if transitions != 1:
                    continue
                if step == 0:
                    if p2 * p4 * p6 != 0:
                        continue
                    if p4 * p6 * p8 != 0:
                        continue
                else:
                    if p2 * p4 * p8 != 0:
                        continue
                    if p2 * p6 * p8 != 0:
                        continue
                remove.append((y, x))
            if remove:
                changed = True
                for y, x in remove:
                    img[y, x] = 0
    return img.astype(bool)


def build_graph(mask: np.ndarray) -> tuple[dict[tuple[int, int], list[tuple[int, int]]], list[tuple[int, int]]]:
    h, w = mask.shape
    pts = [tuple(p) for p in np.argwhere(mask)]
    pts_set = set(pts)
    graph: dict[tuple[int, int], list[tuple[int, int]]] = {pt: [] for pt in pts}
    for y, x in pts:
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy == 0 and dx == 0:
                    continue
                q = (y + dy, x + dx)
                if q in pts_set:
                    graph[(y, x)].append(q)
    endpoints = [pt for pt, ns in graph.items() if len(ns) == 1]
    return graph, endpoints


def bfs_distances(graph: dict[tuple[int, int], list[tuple[int, int]]], start: tuple[int, int]):
    q = deque([start])
    dist = {start: 0}
    prev: dict[tuple[int, int], tuple[int, int]] = {}
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                prev[v] = u
                q.append(v)
    return dist, prev


def longest_path(graph: dict[tuple[int, int], list[tuple[int, int]]], endpoints: list[tuple[int, int]]):
    if not graph:
        return []

    if len(endpoints) >= 2:
        best_len = -1
        best_pair: tuple[tuple[int, int], tuple[int, int]] | None = None
        best_prev = None
        for s in endpoints:
            dist, prev = bfs_distances(graph, s)
            for t in endpoints:
                if t in dist and dist[t] > best_len:
                    best_len = dist[t]
                    best_pair = (s, t)
                    best_prev = prev
        if best_pair and best_prev is not None:
            s, t = best_pair
            path = [t]
            while path[-1] != s:
                path.append(best_prev[path[-1]])
            return path[::-1]

    # Fallback for cyclic graphs.
    start = next(iter(graph))
    dist, _ = bfs_distances(graph, start)
    farthest = max(dist, key=dist.get)
    dist2, prev2 = bfs_distances(graph, farthest)
    end = max(dist2, key=dist2.get)
    path = [end]
    while path[-1] != farthest:
        path.append(prev2[path[-1]])
    return path[::-1]


def rdp(points: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx = x2 - x1
    dy = y2 - y1
    denom = math.hypot(dx, dy) or 1.0
    best_i = None
    best_d = -1.0
    for i, (x, y) in enumerate(points[1:-1], 1):
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / denom
        if d > best_d:
            best_d = d
            best_i = i
    if best_i is None or best_d <= eps:
        return [points[0], points[-1]]
    left = rdp(points[: best_i + 1], eps)
    right = rdp(points[best_i:], eps)
    return left[:-1] + right


def clean_points(points: list[tuple[float, float]], min_step: float = 1.0) -> list[tuple[float, float]]:
    out: list[tuple[float, float]] = []
    last: tuple[float, float] | None = None
    for pt in points:
        if last is None or math.hypot(pt[0] - last[0], pt[1] - last[1]) >= min_step:
            out.append(pt)
            last = pt
    if out and out[-1] != points[-1]:
        out.append(points[-1])
    return out


def path_to_svg(points: list[tuple[float, float]]) -> str:
    if not points:
        return ''
    parts = [f'M {points[0][0]:.1f} {points[0][1]:.1f}']
    for x, y in points[1:]:
        parts.append(f'L {x:.1f} {y:.1f}')
    return ' '.join(parts)


def image_to_path(image_path: Path) -> str:
    rgba = Image.open(image_path).convert('RGBA')
    arr = np.array(rgba)
    alpha = arr[:, :, 3]
    # White glyphs on transparent or dark background.
    luminance = (arr[:, :, 0].astype(np.int32) + arr[:, :, 1].astype(np.int32) + arr[:, :, 2].astype(np.int32)) // 3
    mask = (alpha > 10) & (luminance > 100)
    if not mask.any():
        mask = alpha > 10
    mask = largest_component(mask)
    skel = thin_zhang_suen(mask)
    graph, endpoints = build_graph(skel)
    path_pts = longest_path(graph, endpoints)
    if len(path_pts) < 2:
        return ''

    # Convert to image space centered in the same way the SVG image is placed.
    h, w = mask.shape
    scale = VIEWBOX / max(w, h)
    offset_x = (VIEWBOX - w * scale) / 2.0
    offset_y = (VIEWBOX - h * scale) / 2.0

    pts = [(x * scale + offset_x, y * scale + offset_y) for y, x in path_pts]
    pts = clean_points(pts, min_step=0.9)
    pts = rdp(pts, 1.7)
    return path_to_svg(pts)


def main():
    items = []
    for png in sorted(TRACE_DIR.glob('*.png')):
        if png.name.endswith('.png.png'):
            continue
        if png.stem == 'be_overlay':
            continue
        path = MANUAL_PATHS.get(png.stem, image_to_path(png))
        items.append((png.stem, path))

    lines = [
        '// Auto-generated from Tahoma trace PNGs.',
        '// Regenerate with scripts/generate-vazirmatn-trace-paths.py.',
        '',
        'export const VAZIRMATN_TRACE_PATHS = {',
    ]
    for key, path in items:
        lines.append(f"  {key!r}: {path!r},")
    lines.append('} as const;')
    lines.append('')
    OUT_FILE.write_text('\n'.join(lines), encoding='utf-8')


if __name__ == '__main__':
    main()
