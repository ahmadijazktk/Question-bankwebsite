import sys

try:
    with open('updatedquestion.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            if i < 3: continue
            parts = line.strip().split('\t')
            if len(parts) != 3:
                print(f"Line {i+1}: {len(parts)} parts - {line[:50]}...")
            else:
                q, a, t = parts
                if not q.strip() or not a.strip():
                    print(f"Line {i+1}: Empty Q or A - Q: '{q[:20]}', A: '{a[:20]}'")
except Exception as e:
    print(f"Error: {e}")
