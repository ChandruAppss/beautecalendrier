"""Crops the Girly Room product photos (images/src/*.jpg) into the site's WebP assets.
Usage: python tools/build-photos.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "images" / "src", ROOT / "images"

PACKSHOT = "71gbc50U-pL.jpg"   # box + all products, white background (1990x1591)
DOORS = "91yp_d7C2lL.jpg"      # hand opening the doors
OPEN_BOX = "91IkaijdK3L.jpg"   # open calendar with products in front
PANORAMA = "81QHxJO6XoL.jpg"   # hand holding a mascara
GIFT = "91-6mJQyUtL.jpg"       # closed box held in hands


def card(src, cx, cy, h, name, size=(540, 600)):
    """Crop a 9:10 window centred on (cx, cy) with height h."""
    im = Image.open(SRC / src).convert("RGB")
    w = h * 0.9
    box = (round(cx - w / 2), round(cy - h / 2), round(cx + w / 2), round(cy + h / 2))
    save(im.crop(box).resize(size, Image.LANCZOS), name, 84)


def save(im, name, q=82):
    im.save(OUT / f"{name}.webp", "WEBP", quality=q, method=6)


def white_to_alpha(im):
    """Exact 'colour to alpha' for a white background: keeps soft reflections and shadows."""
    import numpy as np
    a = np.asarray(im, dtype=np.float32) / 255.0
    alpha = np.clip((1.0 - a).max(axis=2), 0, 1)
    safe = np.where(alpha > 0, alpha, 1)[..., None]
    rgb = np.clip(1.0 - (1.0 - a) / safe, 0, 1)
    out = np.dstack([rgb, alpha]) * 255
    return Image.fromarray(out.round().astype("uint8"), "RGBA")


# Hero: the packshot, trimmed to the product group, white background made transparent
hero = Image.open(SRC / PACKSHOT).convert("RGB").crop((240, 0, 1750, 1500)).resize((1208, 1200), Image.LANCZOS)
white_to_alpha(hero).save(OUT / "hero-calendar.webp", "WEBP", quality=88, method=6)

# Product section: open calendar, below the headline text (ratio 1100:980)
im = Image.open(SRC / OPEN_BOX).convert("RGB").crop((0, 620, 2177, 2560))
save(im.resize((1100, 980), Image.LANCZOS), "product-calendar", 84)

# Carousel cards (9:10)
card(PACKSHOT, 700, 1080, 420, "photo-lipstick")        # Color Riche lipstick
card(PACKSHOT, 1540, 1130, 470, "photo-mascara")        # Panorama / Volume Millions
card(PACKSHOT, 1160, 850, 520, "photo-serum")           # Revitalift Glass Skin
card(PACKSHOT, 520, 800, 520, "photo-haircare")         # Elvive Dream Long
card(PACKSHOT, 870, 900, 480, "photo-glotion")          # Lumi Glotion
card(PACKSHOT, 1500, 760, 600, "photo-tonic")           # Age Perfect tonique
card(PACKSHOT, 1110, 1170, 380, "photo-revitalift")     # Revitalift cream
card(PACKSHOT, 430, 1160, 400, "photo-lips")            # Hyaluron lip tints
card(PANORAMA, 1150, 1600, 1900, "photo-panorama")      # mascara in hand
card(DOORS, 1200, 1580, 1940, "photo-doors")            # opening the doors

# Open Graph image (1200x630): packshot centred on white
og = Image.new("RGB", (1200, 630), (255, 255, 255))
pk = Image.open(SRC / PACKSHOT).convert("RGB").crop((240, 0, 1750, 1500)).resize((600, 596), Image.LANCZOS)
og.paste(pk, (300, 17))
og.save(OUT / "og-image.jpg", "JPEG", quality=85)
print("done")
