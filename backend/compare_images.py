
import hashlib
import os

images_dir = r"c:\Users\Administrator\Music\studyApp (2) (1)\studyApp (2) (1)\studyApp\study-bloom-15-main\study-bloom-15-main\src\images"

def get_hash(filename):
    path = os.path.join(images_dir, filename)
    if not os.path.exists(path):
        return None
    with open(path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

files = os.listdir(images_dir)
hashes = {}
duplicates = []

for f in files:
    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
        h = get_hash(f)
        if h:
            if h in hashes:
                duplicates.append((hashes[h], f))
            else:
                hashes[h] = f

if duplicates:
    print(f"Found {len(duplicates)} duplicate image sets:")
    for d in duplicates:
        print(f"'{d[0]}' and '{d[1]}' are identical.")
else:
    print("No identical images found.")
