import csv
import io
import re

def clean_html(text):
    if not text: return ""
    # Standardize recommendations
    recs = ["conditionally recommend", "strongly recommend", "conditionally recommended", "strongly recommended", "conditionally rec'd", "strongly rec'd", "weakly rec'd", "weak rec'd", "WEAK Rec'd", "STRONG REC'D", "STRONGLY REC'D", "CONDITIONALLY REC'D", "WEAK rec'd", "STRONG rec'd"]
    for r in recs:
        raw_r = r.replace('<b>', '').replace('</b>', '')
        pattern = re.compile(re.escape(raw_r), re.IGNORECASE)
        text = pattern.sub(f"<b>{raw_r.upper()}</b>", text)
        
    text = text.replace("<b><b>", "<b>").replace("</b></b>", "</b>")
    # Clean up weird spaced text like "Y o u n g" -> "Young"
    # (Matches single letters followed by single spaces)
    text = re.sub(r'([A-Za-z])\s(?=[A-Za-z]\s)', r'\1', text)
    return text

def run():
    with open('updatedquestion.txt.bak', 'r', encoding='utf-8') as f:
        content = f.read()

    # The file starts with headers, skip them for CSV parsing
    lines = content.splitlines()
    data_start = 0
    headers = []
    for i, line in enumerate(lines):
        if line.startswith('#'):
            headers.append(line)
            data_start = i + 1
        else:
            break
    
    data_content = '\n'.join(lines[data_start:])
    
    # Use CSV reader with tab delimiter to handle multi-line quoted fields
    f_in = io.StringIO(data_content)
    # The file seems to use " as quotechar based on the bak file view
    reader = csv.reader(f_in, delimiter='\t', quotechar='"')

    final_questions = []
    for row in reader:
        if not row: continue
        
        q = row[0].strip()
        # The answer and tags might be across multiple columns due to extra tabs
        # But tags are always the LAST non-empty column
        non_empty = [c.strip() for c in row[1:] if c.strip()]
        
        if not non_empty:
            # Maybe just a question without answer? Skip or handle
            continue
            
        tags = non_empty[-1]
        answer = " ".join(non_empty[:-1]) if len(non_empty) > 1 else non_empty[0]
        
        # Repair internal newlines in Q and A
        q = q.replace('\n', '<br>').replace('\r', '')
        answer = answer.replace('\n', '<br>').replace('\r', '')
        
        final_questions.append((q, clean_html(answer), tags))

    with open('updatedquestion.txt', 'w', encoding='utf-8') as f:
        # Default headers if none found
        if not headers:
            headers = ['#separator:tab', '#html:true', '#tags column:12']
        for h in headers:
            f.write(h + '\n')
            
        for q, a, t in final_questions:
            # Ensure NO TABS inside any column
            q_clean = q.replace('\t', ' ')
            a_clean = a.replace('\t', ' ')
            t_clean = t.replace('\t', ' ')
            f.write(f"{q_clean}\t{a_clean}\t{t_clean}\n")

    print(f"Successfully repaired {len(final_questions)} questions.")

if __name__ == '__main__':
    run()
