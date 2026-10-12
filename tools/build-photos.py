"""Crops the Sundye product photos (images/src/sundye/*) into the site's WebP assets.
Usage: python tools/build-photos.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "images" / "src" / "sundye", ROOT / "images"


def load(name):
    return Image.open(SRC / name).convert("RGB")


def save(im, name, q=82):
    im.save(OUT / f"{name}.webp", "WEBP", quality=q, method=6)


def cover(im, ratio, fx=0.5, fy=0.5):
    """Largest crop of `im` with aspect `ratio` (w/h); fx/fy place the window (0 = left/top, 1 = right/bottom)."""
    w, h = im.size
    if w / h > ratio:
        cw, ch = round(h * ratio), h
    else:
        cw, ch = w, round(w / ratio)
    x, y = round((w - cw) * fx), round((h - ch) * fy)
    return im.crop((x, y, x + cw, y + ch))


# Hero: mirror on the vanity (square)
save(load("01.jpg").resize((1100, 1100), Image.LANCZOS), "hero-miroir", 86)

# Product section: make-up in the mirror (ratio 1100:980)
save(cover(load("02.jpg"), 1100 / 980, fy=0.35).resize((1100, 980), Image.LANCZOS), "produit-miroir", 84)

# Gallery cards (9:10)
GALLERY = [
    ("03.png", "galerie-cristaux-tactile", 0.5),
    ("09.jpg", "galerie-maquillage", 0.5),
    ("05.png", "galerie-coiffeuse", 0.4),
    ("06.jpg", "galerie-commande-tactile", 0.5),
    ("08.jpg", "galerie-cristaux", 0.6),
    ("04.jpg", "galerie-lumiere", 0.6),
    ("10.jpg", "galerie-reflet", 0.5),
    ("11.jpg", "galerie-studio", 0.6),
    ("07.jpg", "galerie-routine", 0.5),
    ("01.jpg", "galerie-miroir", 0.5),
]
for src, name, fx in GALLERY:
    save(cover(load(src), 0.9, fx=fx).resize((540, 600), Image.LANCZOS), name, 82)

# Final CTA background (wide crop of the mirror, text sits over the pink glass)
save(cover(load("01.jpg"), 16 / 6, fy=0.3).resize((1920, 720), Image.LANCZOS), "cta-miroir", 78)

# Open Graph image (1200x630)
cover(load("01.jpg"), 1200 / 630, fy=0.45).resize((1200, 630), Image.LANCZOS).save(OUT / "og-image.jpg", "JPEG", quality=85)
print("done")
