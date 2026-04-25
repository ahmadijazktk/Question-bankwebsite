import re
import os

path = 'c:\\Users\\Administrator\\Music\\studyApp (2) (1)\\studyApp (2) (1)\\studyApp\\study-bloom-15-main\\study-bloom-15-main\\updatedquestion.txt'
phrases = [
    'conditionally recommend',
    'conditionally recommended',
    'CONDITIONALLY REC\'D',
    'conditionally rec\'d',
    'WEAK Rec\'d',
    'weak rec\'d',
    'STRONG REC\'D',
    'strong rec\'d',
    'STRONGLY REC\'D',
    'strongly rec\'d',
    'Strong Recommendation',
    'strong recommendation',
    'strongly recommend',
    'strongly recommended'
]

def format_match(match):
    text = match.group(0).upper()
    return f'<b style="font-weight: 600 !important; color: #000000 !important;">{text}</b>'

if not os.path.exists(path):
    print(f"Error: {path} not found")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if line.startswith('#') or not line.strip():
        new_lines.append(line)
        continue
    
    parts = line.split('\t')
    if len(parts) < 2:
        new_lines.append(line)
        continue
    
    answer = parts[1]
    
    # Clean up previous attempts to prevent nesting
    answer = re.sub(r'<b style="font-weight: [^"]+">', '', answer)
    # Also clean standard <b> tags around these phrases to avoid double bolds
    for p in phrases:
        pattern = r'<b>\s*(' + re.escape(p) + r')\s*</b>'
        answer = re.sub(pattern, r'\1', answer, flags=re.IGNORECASE)
    
    # Apply new formatting
    sorted_phrases = sorted(phrases, key=len, reverse=True)
    regex_pattern = r'(' + '|'.join([re.escape(p) for p in sorted_phrases]) + r')'
    answer = re.sub(regex_pattern, format_match, answer, flags=re.IGNORECASE)
    
    # Fix potential duplicate </b> if we stripped <b> but not </b> correctly
    # Use a simpler way: just clean up double </b> tags
    answer = answer.replace('</b></b>', '</b>')

    parts[1] = answer
    new_lines.append('\t'.join(parts))

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Done. Applied WEIGHT 600 and BLACK !important to {len(new_lines)} answers.')
