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
    
    for idx in [0, 1]:
        text = parts[idx]
        
        # 1. Clean existing styles specifically added by previous script runs
        text = re.sub(r'<b style="font-weight: [^"]+">', '', text)
        
        # 2. Re-apply formatting to target phrases
        sorted_phrases = sorted(phrases, key=len, reverse=True)
        regex_pattern = r'(' + '|'.join([re.escape(p) for p in sorted_phrases]) + r')'
        
        # We need to make sure we don't end up with <b><b>WORD</b></b>
        # So we clean those phrases from standard <b> tags first
        for p in phrases:
            text = re.sub(r'<b>\s*(' + re.escape(p) + r')\s*</b>', r'\1', text, flags=re.IGNORECASE)
            
        text = re.sub(regex_pattern, format_match, text, flags=re.IGNORECASE)
        
        # Clean up any residual double </b>
        text = text.replace('</b></b>', '</b>')
        
        parts[idx] = text

    new_lines.append('\t'.join(parts))

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Final Polish Done. Questions and Answers updated.')
