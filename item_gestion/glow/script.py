from PIL import Image, ImageChops
import os

# === CONFIGURATION ===
ITEM_PATH = "item.png"
FRAMES_DIR = "frames"
OUTPUT_PATH = "item_enchanted_clean.gif"
FRAME_COUNT = 87
FRAME_DURATION = 80  # ms

# === CHARGER L'ITEM ===
item = Image.open(ITEM_PATH).convert("RGBA")
target_size = item.size

# === EXTRAIRE LE MASQUE DE L'OBJET (où l'objet est non-transparent) ===
mask = item.split()[3]  # canal alpha → 0 (transparent), 255 (opaque)

frames = []
for i in range(1, FRAME_COUNT + 1):
    frame_name = f"Frame_{i:04}.png"
    frame_path = os.path.join(FRAMES_DIR, frame_name)

    if not os.path.exists(frame_path):
        print(f"⚠️ Frame manquante : {frame_name}")
        continue

    # Charger et redimensionner le glint
    glint = Image.open(frame_path).convert("RGBA").resize(target_size, resample=Image.Resampling.BILINEAR)

    # Masquer le glint là où l'item est transparent
    glint_masked = Image.new("RGBA", target_size, (0, 0, 0, 0))
    glint_masked.paste(glint, (0, 0), mask=mask)

    # Superposer le glow uniquement sur les pixels visibles de l'item
    enchanted = ImageChops.screen(item, glint_masked)
    frames.append(enchanted)

# === EXPORTER LE GIF ===
if frames:
    frames[0].save(
        OUTPUT_PATH,
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION,
        loop=0,
        disposal=2,
        transparency=0
    )
    print(f"✨ Glow propre appliqué → {OUTPUT_PATH}")
else:
    print("❌ Aucune frame produite.")
