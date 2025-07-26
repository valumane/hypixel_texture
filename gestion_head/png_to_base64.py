import sys
import os
import base64

# Vérifier les arguments
if len(sys.argv) < 2:
    print(f"❌ Usage: python {os.path.basename(__file__)} <image.png>")
    sys.exit(1)

# Chemin de l'image
img_path = sys.argv[1]

# Vérification d'existence
if not os.path.isfile(img_path):
    print(f"❌ Fichier introuvable : {img_path}")
    sys.exit(1)

# Lecture et encodage
with open(img_path, "rb") as f:
    encoded = base64.b64encode(f.read()).decode("utf-8")

# Création du Data URL
data_url = f"data:image/png;base64,{encoded}"

# Affichage
print(data_url)
