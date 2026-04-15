
import json
import os

json_path = r"c:\Users\Administrator\Music\studyApp (2) (1)\studyApp (2) (1)\studyApp\rheumzoom_mongodb_format.json"

with open(json_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions: {len(questions)}")

seen = {}
to_remove = []

for i, q in enumerate(questions):
    text = q.get('text', '').strip()
    expl = ""
    if q.get('options') and len(q['options']) > 0:
        expl = q['options'][0].get('explanation', '').strip()
    
    # Signature
    sig = (text, expl)
    
    if sig in seen:
        print(f"Duplicate found: Index {i} is a duplicate of {seen[sig]}")
        print(f"  Text: {text[:50]}...")
        to_remove.append(i)
    else:
        seen[sig] = i

if to_remove:
    print(f"\nRemoving {len(to_remove)} duplicates from JSON...")
    # Remove in reverse order to keep indices correct while removing
    for i in sorted(to_remove, reverse=True):
        questions.pop(i)
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=4)
    print("JSON file updated.")
else:
    print("No duplicates found in JSON.")

