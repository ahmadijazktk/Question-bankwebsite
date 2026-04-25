import re
import os

path = 'c:\\Users\\Administrator\\Music\\studyApp (2) (1)\\studyApp (2) (1)\\studyApp\\study-bloom-15-main\\study-bloom-15-main\\updatedquestion.txt'

phrases_regex = {
    'conditionally_recommend': re.compile(r'conditionally\s+recommend(ed)?', re.IGNORECASE),
    'conditionally_recd': re.compile(r'conditionally\s+rec\'?d', re.IGNORECASE),
    'weak_recd': re.compile(r'weak\s+rec\'?d', re.IGNORECASE),
    'strong_recd': re.compile(r'strong(ly)?\s+rec\'?d', re.IGNORECASE),
    'strong_recommend': re.compile(r'strong(ly)?\s+recommend(ation|ed)?', re.IGNORECASE),
}

def clean_and_apply(text):
    # 1. Aggressive Strip of nested b/strong tags around these phrases
    # Remove our previous styles and any other styles
    text = re.sub(r'<(b|strong|span) style=[^>]+>', '', text)
    text = text.replace('<b>', '').replace('</b>', '').replace('<strong>', '').replace('</strong>', '').replace('<span>', '').replace('</span>', '')
    
    # 2. Re-apply a single clean layer
    # Sort by length descending
    sorted_re = [
        re.compile(r'conditionally\s+recommend(ed)?', re.IGNORECASE),
        re.compile(r'conditionally\s+rec\'?d', re.IGNORECASE),
        re.compile(r'weak\s+rec\'?d', re.IGNORECASE),
        re.compile(r'strong(ly)?\s+rec\'?d', re.IGNORECASE),
        re.compile(r'strong(ly)?\s+recommend(ation|ed)?', re.IGNORECASE),
    ]
    
    processed = text
    for regex in sorted_re:
        processed = regex.sub(lambda m: f'__BOLDSTART__{m.group(0).upper()}__BOLDEND__', processed)
    
    # Final replacement
    processed = processed.replace('__BOLDSTART__', '<b style="font-weight: 700 !important; color: #000000 !important;">')
    processed = processed.replace('__BOLDEND__', '</b>')
    
    return processed

if not os.path.exists(path):
    print(f"Error: {path} not found")
    exit(1)

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('#') or not line.strip():
        new_lines.append(line)
        continue
    
    parts = line.split('\t')
    if len(parts) < 2:
        new_lines.append(line)
        continue
    
    for idx in range(len(parts)):
        # Skip if it's the image columns or tags (though usually first two are text)
        if idx < 2:
            parts[idx] = clean_and_apply(parts[idx])
        
    new_lines.append('\t'.join(parts))

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Database Cleaned & Formatted: {len(new_lines)} lines.')
