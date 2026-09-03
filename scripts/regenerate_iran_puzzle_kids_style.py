from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
GEN = ROOT / "assets" / "neli-world" / "puzzle" / "Iran" / "generated"
SHAPES = GEN / "province-shapes"
META_PATH = GEN / "iran_puzzle_shapes_meta.json"
OLD_BASE = GEN / "iran_names_placeholder_3840x2160.png"

CANVAS_W = 3840
CANVAS_H = 2160
CROP_X = 897
CROP_Y = 40
CROP_W = 2063
CROP_H = 2042

NAMES_FA = {
    "west_azerbaijan": "\u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u063a\u0631\u0628\u06cc",
    "east_azerbaijan": "\u0622\u0630\u0631\u0628\u0627\u06cc\u062c\u0627\u0646 \u0634\u0631\u0642\u06cc",
    "ardabil": "\u0627\u0631\u062f\u0628\u06cc\u0644",
    "gilan": "\u06af\u06cc\u0644\u0627\u0646",
    "zanjan": "\u0632\u0646\u062c\u0627\u0646",
    "kurdistan": "\u06a9\u0631\u062f\u0633\u062a\u0627\u0646",
    "kermanshah": "\u06a9\u0631\u0645\u0627\u0646\u0634\u0627\u0647",
    "ilam": "\u0627\u06cc\u0644\u0627\u0645",
    "hamadan": "\u0647\u0645\u062f\u0627\u0646",
    "qazvin": "\u0642\u0632\u0648\u06cc\u0646",
    "alborz": "\u0627\u0644\u0628\u0631\u0632",
    "tehran": "\u062a\u0647\u0631\u0627\u0646",
    "qom": "\u0642\u0645",
    "markazi": "\u0645\u0631\u06a9\u0632\u06cc",
    "lorestan": "\u0644\u0631\u0633\u062a\u0627\u0646",
    "khuzestan": "\u062e\u0648\u0632\u0633\u062a\u0627\u0646",
    "chaharmahal": "\u0686\u0647\u0627\u0631\u0645\u062d\u0627\u0644 \u0648 \u0628\u062e\u062a\u06cc\u0627\u0631\u06cc",
    "kohgiluyeh": "\u06a9\u0647\u06af\u06cc\u0644\u0648\u06cc\u0647 \u0648 \u0628\u0648\u06cc\u0631\u0627\u062d\u0645\u062f",
    "bushehr": "\u0628\u0648\u0634\u0647\u0631",
    "fars": "\u0641\u0627\u0631\u0633",
    "isfahan": "\u0627\u0635\u0641\u0647\u0627\u0646",
    "yazd": "\u06cc\u0632\u062f",
    "kerman": "\u06a9\u0631\u0645\u0627\u0646",
    "hormozgan": "\u0647\u0631\u0645\u0632\u06af\u0627\u0646",
    "sistan": "\u0633\u06cc\u0633\u062a\u0627\u0646 \u0648 \u0628\u0644\u0648\u0686\u0633\u062a\u0627\u0646",
    "south_khorasan": "\u062e\u0631\u0627\u0633\u0627\u0646 \u062c\u0646\u0648\u0628\u06cc",
    "razavi_khorasan": "\u062e\u0631\u0627\u0633\u0627\u0646 \u0631\u0636\u0648\u06cc",
    "north_khorasan": "\u062e\u0631\u0627\u0633\u0627\u0646 \u0634\u0645\u0627\u0644\u06cc",
    "semnan": "\u0633\u0645\u0646\u0627\u0646",
    "mazandaran": "\u0645\u0627\u0632\u0646\u062f\u0631\u0627\u0646",
    "golestan": "\u06af\u0644\u0633\u062a\u0627\u0646",
}

PALETTE = [
    (255, 211, 64),
    (87, 213, 118),
    (143, 220, 104),
    (0, 181, 111),
    (251, 226, 66),
    (161, 222, 52),
    (228, 211, 118),
    (255, 181, 87),
    (255, 223, 92),
    (249, 211, 55),
    (235, 207, 160),
    (255, 126, 167),
    (150, 216, 244),
    (225, 223, 152),
    (89, 199, 150),
    (74, 196, 136),
    (246, 224, 100),
    (156, 226, 205),
    (73, 211, 181),
    (145, 213, 0),
    (255, 222, 69),
    (254, 210, 75),
    (255, 173, 36),
    (255, 219, 102),
    (255, 224, 105),
    (245, 105, 29),
    (255, 143, 67),
    (247, 174, 103),
    (255, 215, 133),
    (0, 178, 104),
    (96, 211, 137),
]

ICONS = {
    "west_azerbaijan": "water",
    "east_azerbaijan": "mountain",
    "ardabil": "mountain",
    "gilan": "leaf",
    "zanjan": "grape",
    "kurdistan": "trees",
    "kermanshah": "monument",
    "ilam": "tree",
    "hamadan": "mountain",
    "qazvin": "hill",
    "alborz": "mountain",
    "tehran": "tower",
    "qom": "water",
    "markazi": "wheat",
    "lorestan": "waterfall",
    "khuzestan": "palm",
    "chaharmahal": "river",
    "kohgiluyeh": "mountain",
    "bushehr": "sailboat",
    "fars": "columns",
    "isfahan": "bridge",
    "yazd": "windtower",
    "kerman": "mountain",
    "hormozgan": "ship",
    "sistan": "camel",
    "south_khorasan": "cactus",
    "razavi_khorasan": "saffron",
    "north_khorasan": "hill",
    "semnan": "sun",
    "mazandaran": "trees",
    "golestan": "trees",
}

ICON_Y_FACTOR = {
    "bushehr": 0.58,
    "fars": 0.62,
    "kerman": 0.68,
    "hormozgan": 0.62,
    "sistan": 0.58,
    "south_khorasan": 0.61,
    "razavi_khorasan": 0.6,
    "semnan": 0.58,
    "isfahan": 0.62,
}

ICON_STROKE = (34, 34, 34, 235)
ICON_WHITE = (255, 255, 255, 245)
ICON_GREEN = (22, 155, 79, 245)
ICON_DARK_GREEN = (12, 105, 62, 245)
ICON_BLUE = (22, 154, 223, 245)
ICON_GOLD = (246, 176, 45, 245)
ICON_ORANGE = (242, 126, 45, 245)
ICON_BROWN = (151, 91, 45, 245)
ICON_RED = (205, 46, 58, 245)


def brighten(color: tuple[int, int, int], amount: int) -> tuple[int, int, int]:
    return tuple(min(255, channel + amount) for channel in color)


def alpha_from_piece(index: int) -> Image.Image:
    piece = Image.open(SHAPES / f"province_full_{index:02d}.png").convert("RGBA")
    alpha = piece.getchannel("A")
    # A little smoothing gives the child-friendly simplified border style while
    # still keeping the real province shape recognizable.
    return alpha.filter(ImageFilter.GaussianBlur(2.2)).point(lambda p: 255 if p > 72 else 0)


def draw_simple_icon(canvas: Image.Image, kind: str, cx: float, cy: float, size: float) -> None:
    if size < 14:
        return
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    s = size
    x = cx
    y = cy
    lw = max(2, round(s * 0.08))

    def line(points, fill=ICON_STROKE, width=lw):
        d.line(points, fill=fill, width=width, joint="curve")

    def polygon(points, fill, outline=ICON_STROKE):
        d.polygon(points, fill=fill)
        line(points + [points[0]], fill=outline)

    if kind == "mountain":
        polygon([(x - s * 0.58, y + s * 0.34), (x - s * 0.2, y - s * 0.34), (x + s * 0.1, y + s * 0.34)], ICON_WHITE)
        polygon([(x - s * 0.05, y + s * 0.34), (x + s * 0.32, y - s * 0.26), (x + s * 0.62, y + s * 0.34)], (158, 176, 116, 245))
    elif kind in {"trees", "tree"}:
        offsets = [-0.35, 0, 0.35] if kind == "trees" else [0]
        for off in offsets:
            tx = x + s * off
            polygon([(tx, y - s * 0.45), (tx - s * 0.22, y - s * 0.05), (tx + s * 0.22, y - s * 0.05)], ICON_GREEN)
            polygon([(tx, y - s * 0.18), (tx - s * 0.27, y + s * 0.22), (tx + s * 0.27, y + s * 0.22)], ICON_DARK_GREEN)
            line([(tx, y + s * 0.2), (tx, y + s * 0.48)], fill=ICON_BROWN)
    elif kind == "leaf":
        d.ellipse((x - s * 0.42, y - s * 0.32, x + s * 0.44, y + s * 0.34), fill=ICON_GREEN, outline=ICON_STROKE, width=lw)
        line([(x - s * 0.25, y + s * 0.22), (x + s * 0.28, y - s * 0.2)])
    elif kind == "grape":
        for gx, gy in [(-.2, -.25), (.05, -.25), (-.32, 0), (-.05, 0), (.2, 0), (-.2, .25), (.05, .25)]:
            d.ellipse((x + gx*s - .13*s, y + gy*s - .13*s, x + gx*s + .13*s, y + gy*s + .13*s), fill=(143, 55, 190, 245), outline=ICON_STROKE, width=max(1, lw - 1))
        line([(x - s * 0.08, y - s * 0.42), (x + s * 0.18, y - s * 0.58)], fill=ICON_DARK_GREEN)
    elif kind in {"water", "river"}:
        for i in range(3):
            yy = y - s * 0.2 + i * s * 0.22
            line([(x - s * 0.45, yy), (x - s * 0.2, yy + s * 0.1), (x + s * 0.05, yy), (x + s * 0.32, yy + s * 0.1), (x + s * 0.5, yy)], fill=ICON_BLUE)
    elif kind == "waterfall":
        d.rounded_rectangle((x - s * 0.35, y - s * 0.42, x + s * 0.25, y + s * 0.22), radius=s * 0.12, fill=(87, 105, 126, 245), outline=ICON_STROKE, width=lw)
        for off in [-0.16, 0.03, 0.2]:
            line([(x + s * off, y - s * 0.3), (x + s * (off - .05), y + s * 0.28)], fill=(72, 202, 255, 245), width=max(2, lw + 1))
        line([(x - s * 0.45, y + s * 0.35), (x + s * 0.45, y + s * 0.35)], fill=ICON_BLUE)
    elif kind == "sun":
        d.ellipse((x - s * 0.2, y - s * 0.2, x + s * 0.2, y + s * 0.2), fill=ICON_GOLD, outline=ICON_STROKE, width=lw)
        for dx, dy in [(0,-.5),(.35,-.35),(.5,0),(.35,.35),(0,.5),(-.35,.35),(-.5,0),(-.35,-.35)]:
            line([(x + dx*s*.55, y + dy*s*.55), (x + dx*s*.78, y + dy*s*.78)], fill=ICON_GOLD)
    elif kind == "wheat":
        for off in [-0.18, 0.18]:
            line([(x + off*s, y + s*.45), (x + off*s, y - s*.45)], fill=ICON_BROWN)
            for i in range(4):
                yy = y + s*(0.25 - i*0.18)
                d.ellipse((x + off*s - s*.13, yy - s*.08, x + off*s, yy + s*.08), fill=ICON_GOLD, outline=ICON_STROKE, width=1)
                d.ellipse((x + off*s, yy - s*.08, x + off*s + s*.13, yy + s*.08), fill=ICON_GOLD, outline=ICON_STROKE, width=1)
    elif kind == "tower":
        d.polygon([(x, y - s*.5), (x - s*.16, y + s*.35), (x + s*.16, y + s*.35)], fill=(105, 115, 125, 245), outline=ICON_STROKE)
        line([(x - s*.28, y + s*.35), (x + s*.28, y + s*.35)])
        line([(x - s*.22, y - s*.08), (x + s*.22, y - s*.08)])
    elif kind == "bridge":
        for i in range(5):
            d.arc((x - s*.55 + i*s*.22, y - s*.1, x - s*.35 + i*s*.22, y + s*.3), 180, 360, fill=ICON_STROKE, width=lw)
        line([(x - s*.6, y - s*.08), (x + s*.6, y - s*.08)], fill=ICON_BROWN)
        line([(x - s*.62, y + s*.32), (x + s*.62, y + s*.32)], fill=ICON_BLUE)
    elif kind in {"boat", "sailboat", "ship"}:
        d.polygon([(x - s*.45, y + s*.12), (x + s*.45, y + s*.12), (x + s*.25, y + s*.35), (x - s*.28, y + s*.35)], fill=ICON_ORANGE if kind == "sailboat" else ICON_BLUE, outline=ICON_STROKE)
        if kind == "sailboat":
            d.polygon([(x - s*.05, y - s*.48), (x - s*.05, y + s*.1), (x + s*.3, y + s*.1)], fill=ICON_WHITE, outline=ICON_STROKE)
            line([(x - s*.05, y - s*.5), (x - s*.05, y + s*.12)])
        else:
            d.rectangle((x - s*.1, y - s*.12, x + s*.2, y + s*.12), fill=ICON_GOLD, outline=ICON_STROKE, width=lw)
        line([(x - s*.5, y + s*.44), (x + s*.5, y + s*.44)], fill=ICON_BLUE)
    elif kind == "columns":
        for off in [-.28, 0, .28]:
            d.rectangle((x + off*s - s*.07, y - s*.28, x + off*s + s*.07, y + s*.28), fill=(246, 198, 113, 245), outline=ICON_STROKE, width=max(1, lw-1))
            line([(x + off*s - s*.12, y - s*.32), (x + off*s + s*.12, y - s*.32)])
        line([(x - s*.48, y + s*.34), (x + s*.48, y + s*.34)], fill=ICON_BROWN)
    elif kind == "windtower":
        d.rectangle((x - s*.22, y - s*.38, x + s*.22, y + s*.34), fill=(238, 178, 85, 245), outline=ICON_STROKE, width=lw)
        d.polygon([(x - s*.28, y - s*.38), (x, y - s*.62), (x + s*.28, y - s*.38)], fill=(255, 215, 123, 245), outline=ICON_STROKE)
        line([(x, y - s*.35), (x, y + s*.25)])
    elif kind == "camel":
        d.ellipse((x - s*.42, y - s*.12, x + s*.18, y + s*.28), fill=(206, 133, 62, 245), outline=ICON_STROKE, width=lw)
        d.ellipse((x - s*.2, y - s*.35, x + s*.12, y + s*.02), fill=(206, 133, 62, 245), outline=ICON_STROKE, width=lw)
        line([(x + s*.18, y - s*.02), (x + s*.44, y - s*.2), (x + s*.5, y + s*.06)], fill=ICON_BROWN)
        for off in [-.25, .08]:
            line([(x + off*s, y + s*.25), (x + off*s, y + s*.48)], fill=ICON_BROWN)
    elif kind == "cactus":
        line([(x, y + s*.42), (x, y - s*.42)], fill=ICON_GREEN, width=max(lw + 3, round(s*.16)))
        line([(x, y - s*.05), (x - s*.25, y - s*.05), (x - s*.25, y - s*.24)], fill=ICON_GREEN, width=max(lw + 2, round(s*.13)))
        line([(x, y + s*.08), (x + s*.25, y + s*.08), (x + s*.25, y - s*.1)], fill=ICON_GREEN, width=max(lw + 2, round(s*.13)))
    elif kind == "saffron":
        d.ellipse((x - s*.38, y + s*.02, x + s*.38, y + s*.35), fill=(170, 225, 255, 245), outline=ICON_STROKE, width=lw)
        for off in [-.2, 0, .2]:
            line([(x + off*s, y + s*.02), (x + off*s*.5, y - s*.45)], fill=ICON_RED, width=max(2, lw))
    elif kind == "palm":
        line([(x, y + s*.45), (x + s*.05, y - s*.15)], fill=ICON_BROWN, width=max(2, lw + 1))
        for dx in [-.42, -.22, .18, .42]:
            line([(x, y - s*.18), (x + dx*s, y - s*.38)], fill=ICON_GREEN, width=max(2, lw))
        d.ellipse((x - s*.38, y + s*.32, x + s*.38, y + s*.5), fill=(91, 204, 255, 210), outline=ICON_BLUE, width=max(1, lw-1))
    elif kind == "monument":
        d.rounded_rectangle((x - s*.32, y - s*.38, x + s*.32, y + s*.32), radius=s*.06, fill=(205, 172, 119, 245), outline=ICON_STROKE, width=lw)
        d.arc((x - s*.18, y - s*.2, x + s*.18, y + s*.2), 180, 360, fill=ICON_STROKE, width=lw)
    elif kind == "hill":
        d.arc((x - s*.45, y - s*.05, x + s*.12, y + s*.45), 190, 350, fill=ICON_DARK_GREEN, width=max(2, lw+1))
        d.arc((x - s*.05, y - s*.15, x + s*.55, y + s*.45), 190, 350, fill=ICON_DARK_GREEN, width=max(2, lw+1))

    canvas.alpha_composite(layer)


def add_icons_to_base(canvas: Image.Image, items: list[tuple[dict, Image.Image]]) -> None:
    for item, _alpha in items:
        x0, y0, x1, y1 = item["sourceBox"]
        w = x1 - x0
        h = y1 - y0
        size = min(78, max(24, min(w, h) * 0.2))
        y_factor = ICON_Y_FACTOR.get(item["id"], 0.65)
        draw_simple_icon(canvas, ICONS.get(item["id"], "hill"), x0 + w * 0.5, y0 + h * y_factor, size)


def paste_gradient(canvas: Image.Image, box: list[int], alpha: Image.Image, color: tuple[int, int, int]) -> None:
    w, h = alpha.size
    top = brighten(color, 30)
    bottom = tuple(max(0, c - 10) for c in color)
    t = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    rgb = np.array(top, dtype=np.float32) * (1 - t) + np.array(bottom, dtype=np.float32) * t
    rgb = np.repeat(rgb[:, None, :], w, axis=1).astype(np.uint8)
    rgba = np.dstack([rgb, np.array(alpha, dtype=np.uint8)])
    gradient = Image.fromarray(rgba, "RGBA")
    canvas.alpha_composite(gradient, (box[0], box[1]))


def build_masks(meta: list[dict]) -> tuple[list[tuple[dict, Image.Image]], Image.Image, Image.Image]:
    items: list[tuple[dict, Image.Image]] = []
    union = Image.new("L", (CANVAS_W, CANVAS_H), 0)
    separator = Image.new("L", (CANVAS_W, CANVAS_H), 0)
    for index, item in enumerate(meta, start=1):
        alpha = alpha_from_piece(index)
        box = item["sourceBox"]
        items.append((item, alpha))
        crop_box = (box[0], box[1], box[2], box[3])
        union_crop = union.crop(crop_box)
        union.paste(ImageChops.lighter(union_crop, alpha), crop_box)
        edge = ImageChops.subtract(alpha.filter(ImageFilter.MaxFilter(13)), alpha.filter(ImageFilter.MinFilter(5)))
        separator_crop = separator.crop(crop_box)
        separator.paste(ImageChops.lighter(separator_crop, edge), crop_box)
    return items, union, separator


def build_water_mask() -> Image.Image:
    base = Image.open(OLD_BASE).convert("RGBA")
    arr = np.array(base)
    water = (arr[:, :, 2] > 140) & (arr[:, :, 1] > 120) & (arr[:, :, 0] < 120)
    mask = Image.fromarray((water.astype(np.uint8) * 255), "L")
    return mask.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(1.2))


def build_base(meta: list[dict]) -> None:
    items, union, separator = build_masks(meta)
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (255, 255, 255, 255))

    water_mask = build_water_mask()
    water = Image.new("RGBA", (CANVAS_W, CANVAS_H), (28, 177, 231, 255))
    water.putalpha(water_mask)
    canvas.alpha_composite(water)

    outer_black = ImageChops.subtract(union.filter(ImageFilter.MaxFilter(21)), union.filter(ImageFilter.MaxFilter(3))).filter(ImageFilter.GaussianBlur(0.5))
    outer_white = ImageChops.subtract(union.filter(ImageFilter.MaxFilter(13)), union).filter(ImageFilter.GaussianBlur(0.5))
    black_layer = Image.new("RGBA", (CANVAS_W, CANVAS_H), (28, 32, 36, 255))
    black_layer.putalpha(outer_black)
    white_layer = Image.new("RGBA", (CANVAS_W, CANVAS_H), (255, 255, 255, 255))
    white_layer.putalpha(outer_white)
    canvas.alpha_composite(black_layer)
    canvas.alpha_composite(white_layer)

    for index, (item, alpha) in enumerate(items):
        paste_gradient(canvas, item["sourceBox"], alpha, PALETTE[index % len(PALETTE)])

    add_icons_to_base(canvas, items)

    sep_layer = Image.new("RGBA", (CANVAS_W, CANVAS_H), (255, 255, 255, 255))
    sep_layer.putalpha(separator.filter(ImageFilter.GaussianBlur(0.2)))
    canvas.alpha_composite(sep_layer)

    canvas.save(GEN / "iran_kids_placeholder_3840x2160_base.png")
    canvas.crop((CROP_X, CROP_Y, CROP_X + CROP_W, CROP_Y + CROP_H)).save(GEN / "iran_kids_placeholder_cropped_base.png")


def build_pieces(meta: list[dict]) -> None:
    for index, item in enumerate(meta, start=1):
        alpha = alpha_from_piece(index)
        w, h = alpha.size
        color = PALETTE[(index - 1) % len(PALETTE)]
        piece = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        outline = alpha.filter(ImageFilter.MaxFilter(11))
        outline_layer = Image.new("RGBA", (w, h), (255, 255, 255, 255))
        outline_layer.putalpha(outline)
        piece.alpha_composite(outline_layer)
        paste_gradient(piece, [0, 0, w, h], alpha, color)
        draw_simple_icon(
            piece,
            ICONS.get(item["id"], "hill"),
            w * 0.5,
            h * ICON_Y_FACTOR.get(item["id"], 0.65),
            min(58, max(20, min(w, h) * 0.2)),
        )
        piece.save(SHAPES / f"province_kids_{index:02d}.png")


def write_label_data(meta: list[dict]) -> None:
    label_items = []
    for index, item in enumerate(meta, start=1):
        x0, y0, x1, y1 = item["sourceBox"]
        label_items.append(
            {
                "index": index,
                "id": item["id"],
                "nameFa": NAMES_FA[item["id"]],
                "piecePath": str(SHAPES / f"province_kids_{index:02d}.png"),
                "sourceBox": item["sourceBox"],
                "center": [(x0 + x1) / 2, (y0 + y1) / 2],
            }
        )
    (GEN / "iran_kids_labels.json").write_text(json.dumps(label_items, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    meta = json.loads(META_PATH.read_text(encoding="utf-8"))
    build_base(meta)
    build_pieces(meta)
    write_label_data(meta)


if __name__ == "__main__":
    main()
