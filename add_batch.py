import re
import sys

# ─── Recommendation phrases to make UPPERCASE + BOLD (font-weight:700) ────────
REC_PHRASES = [
    "conditionally recommended",
    "conditionally recommend",
    "conditionally rec'd",
    "conditional rec'd",
    "strongly recommended",
    "strongly recommend",
    "strongly rec'd",
    "strong rec'd",
    "strong recommendation",
    "strong recommend",
    "weakly recommended",
    "weakly recommend",
    "weak rec'd",
    "weak recommendation",
    "weak recommend",
]
# Sort longest first so longer phrases match before shorter ones
REC_PHRASES.sort(key=len, reverse=True)

def apply_rec_styling(text):
    """Replace recommendation phrases with UPPERCASE bold HTML."""
    for phrase in REC_PHRASES:
        pattern = re.compile(re.escape(phrase), re.IGNORECASE)
        upper = phrase.upper()
        replacement = f'<b style="font-weight:700;">{upper}</b>'
        text = pattern.sub(replacement, text)
    return text

def html_newlines(text):
    """Convert real newlines to <br> for HTML display."""
    return text.replace('\r\n', '<br>').replace('\r', '<br>').replace('\n', '<br>')

def parse_batch(raw_text):
    """
    Parse a batch of questions in the format:
    
    Question:
    <question text>
    
    Ans:
    <answer text>
    
    Tags:
    <tag1>
    <tag2>
    ...
    """
    questions = []

    # Improved splitting to handle variations and extra newlines
    # Use re.IGNORECASE and handle potential spaces around colon
    blocks = re.split(r'\n(?=Question\s*:)', raw_text, flags=re.IGNORECASE)

    print(f"DEBUG: Found {len(blocks)} potential blocks")

    for i, block in enumerate(blocks):
        block = block.strip()
        # Extract components
        q_match = re.search(r'Question\s*:\s*(.*?)(?=\s+Ans\s*:|\s+Answer\s*:)', block, re.IGNORECASE | re.DOTALL)
        a_match = re.search(r'(?:Ans|Answer)\s*:\s*(.*?)(?=\nTags\s*:|\Z)', block, re.IGNORECASE | re.DOTALL)
        t_match = re.search(r'Tags\s*:\s*(.*?)(?=\Z)', block, re.IGNORECASE | re.DOTALL)
        img_match = re.search(r'Image\s*:\s*(.*?)(?=\nTags\s*:|\nAns\s*:|\nQuestion\s*:|\Z)', block, re.IGNORECASE | re.DOTALL)
        
        if not q_match or not a_match:
            # Fallback for simpler blocks if first split was weird
            if "Question:" in block and "Ans:" in block:
                try:
                    q_part = block.split("Ans:")[0].replace("Question:", "").split("Image:")[0].strip()
                    rem = block.split("Ans:")[1]
                    if "Tags:" in rem:
                        a_part = rem.split("Tags:")[0].strip()
                        t_part = rem.split("Tags:")[1].strip()
                    else:
                        a_part = rem.strip()
                        t_part = ""
                    
                    # Try to find image in the whole block if fallback
                    img_part = ""
                    img2_part = ""
                    if "Image:" in block:
                        img_part = block.split("Image:")[1].splitlines()[0].strip()
                    if "Image2:" in block:
                        img2_part = block.split("Image2:")[1].splitlines()[0].strip()
                        
                    q_text, a_text, t_text, img_text, img2_text = q_part, a_part, t_part, img_part, img2_part
                except:
                    print(f"⚠️  Skipped block {i} (failed to parse)")
                    continue
            else:
                print(f"⚠️  Skipped block {i} (missing Q or A boundaries)")
                continue
        else:
            q_text = q_match.group(1).strip()
            a_text = a_match.group(1).strip()
            t_text = t_match.group(1).strip() if t_match else ""
            img_text = img_match.group(1).strip() if img_match else ""
            
            img2_match = re.search(r'(?i)Image2\s*:\s*(.+)', block)
            img2_text = img2_match.group(1).strip() if img2_match else ""

        # Remove Image line from a_text if it was captured there
        if img_text:
            # Create a pattern to remove 'Image: <filename>' accurately
            img_pattern = re.compile(r'\n?\s*Image\s*:\s*' + re.escape(img_text), re.IGNORECASE)
            a_text = img_pattern.sub('', a_text).strip()
            
        if img2_text:
            img2_pattern = re.compile(r'\n?\s*Image2\s*:\s*' + re.escape(img2_text), re.IGNORECASE)
            a_text = img2_pattern.sub('', a_text).strip()

        # Parse tags
        tags = []
        for line in t_text.splitlines():
            line = line.strip()
            if line:
                for t in line.split(','):
                    t = t.strip()
                    if t:
                        tags.append(t)
        
        tags_str = ' '.join(tags) if tags else 'Uncategorized'

        # Apply transformations
        a_styled = apply_rec_styling(a_text)
        q_html = html_newlines(q_text)
        a_html = html_newlines(a_styled)

        # Remove internal tabs
        q_html = q_html.replace('\t', ' ')
        a_html = a_html.replace('\t', ' ')
        tags_str = tags_str.replace('\t', ' ')
        img_text = img_text.replace('\t', ' ').strip()
        img2_text = img2_text.replace('\t', ' ').strip()

        questions.append((q_html, a_html, tags_str, img_text, img2_text))

    return questions


def append_to_question_bank(questions, output_file='updatedquestion.txt'):
    """Append questions to the updatedquestion.txt file in TSV format."""
    import os
    file_exists = os.path.exists(output_file)
    
    with open(output_file, 'a', encoding='utf-8') as f:
        if not file_exists:
            f.write('#separator:tab\n#html:true\n#tags column:12\n')
        for item in questions:
            if len(item) == 4:
                q, a, t, img = item
                img2 = ""
            elif len(item) == 5:
                q, a, t, img, img2 = item
            else:
                q, a, t, img, img2 = item[0], item[1], item[2], "", ""
                
            line = f"{q}\t{a}\t{t}"
            if img or img2:
                line += f"\t{img}"
            if img2:
                line += f"\t{img2}"
            f.write(line + "\n")
    
    return len(questions)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            raw = f.read()
    else:
        print("Usage: python add_batch.py <batch_file.txt>")
        sys.exit(1)

    print(f"Processing {sys.argv[1]}...")
    questions = parse_batch(raw)
    count = append_to_question_bank(questions)
    print(f"✅ Added {count} questions to updatedquestion.txt")
