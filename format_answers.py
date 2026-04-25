import re
import os

path = 'c:\\Users\\Administrator\\Music\\studyApp (2) (1)\\studyApp (2) (1)\\studyApp\\study-bloom-15-main\\study-bloom-15-main\\updatedquestion.txt'
phrases = [
    'conditionally recommend',
    'CONDITIONALLY REC\'D',
    'WEAK Rec\'d',
    'STRONG REC\'D',
    'STRONGLY REC\'D',
    'Strong Recommendation',
    'conditionally recommended',
    'strongly recommend',
    'strongly recommended',
    'conditionally rec\'d',
    'strongly rec\'d'
]

def format_match(match):
    text = match.group(0).upper()
    return f'<b style="font-weight: 700; color: black;">{text}</b>'

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
    
    # Clean existing messy tags first to prevent nested bolds
    # Remove any existing b tags wrapping these phrases
    for p in phrases:
        pattern = r'<b[^>]*>\s*(' + re.escape(p) + r')\s*</b>'
        answer = re.sub(pattern, r'\1', answer, flags=re.IGNORECASE)
    
    # General cleanup of nested b tags from previous runs
    answer = answer.replace('<b><b>', '<b>').replace('</b></b>', '</b>')
    answer = re.sub(r'<b style="font-weight: 700; color: black;">\s*<b[^>]*>', '<b style="font-weight: 700; color: black;">', answer)
    answer = answer.replace('</b>\s*</b>', '</b>')

    # Apply formatting to all phrases (case insensitive)
    # We sort phrases by length descending to match longer ones first
    sorted_phrases = sorted(phrases, key=len, reverse=True)
    regex_pattern = r'\b(' + '|'.join([re.escape(p) for p in sorted_phrases]) + r')\b'
    
    # We need to avoid re-tagging already tagged content.
    # A simple way is to replace only if not already preceded by the specific style tag.
    # But simpler is to clean all tags first and then apply once.
    
    # Clean ALL bold tags from these specific answers first? 
    # No, that might destroy other bolding the user wanted.
    
    # Let's do a more careful re-substitution.
    answer = re.sub(regex_pattern, format_match, answer, flags=re.IGNORECASE)
    
    parts[1] = answer
    new_lines.append('\t'.join(parts))

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Done. Re-formatted {len(new_lines)} lines in updatedquestion.txt')
