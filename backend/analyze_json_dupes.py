
import json

json_path = r"c:\Users\Administrator\Music\studyApp (2) (1)\studyApp (2) (1)\studyApp\rheumzoom_mongodb_format.json"

with open(json_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions in JSON: {len(questions)}")

seen = {}
duplicates = []

for i, q in enumerate(questions):
    # Normalize text and options for comparison
    text = q.get('text', '').strip()
    expl = ""
    if q.get('options') and len(q['options']) > 0:
        expl = q['options'][0].get('explanation', '').strip()
    
    # Use a signature to identify duplicates
    sig = f"{text}||{expl}"
    
    if sig in seen:
        duplicates.append((seen[sig], i, text[:50]))
    else:
        seen[sig] = i

if duplicates:
    print(f"Found {len(duplicates)} duplicate sets in JSON:")
    for d in duplicates[:20]:
        print(f"Index {d[0]} and Index {d[1]} are duplicates: {d[2]}")
else:
    print("No duplicates found by text+explanation in JSON.")

# Now check for "What do you do?" specifically
what_qs = [(i, q) for i, q in enumerate(questions) if q.get('text') == "What do you do?"]
print(f"\nFound {len(what_qs)} 'What do you do?' questions in JSON.")
for i, q in what_qs:
    img = q.get('image', 'None')
    expl = q.get('options', [{}])[0].get('explanation', '')[:50]
    print(f"Index {i}: Image: {img}, Expl: {expl}")

