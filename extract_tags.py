import re
import sys

def extract_tags(text):
    # Match tags: ... or tag: ... until newline or next question
    # We look for patterns like "Tags:\nACR\nILD" or "Tags: ACR, ILD"
    tag_matches = re.findall(r'Tags?:\s*(.*?)(?=\n\n|\s*\nQuestion:|$)', text, re.IGNORECASE | re.DOTALL)
    
    unique_tags = set()
    for tag_str in tag_matches:
        # Split by comma or newline
        lines = tag_str.split('\n')
        for line in lines:
            parts = line.split(',')
            for p in parts:
                clean = p.strip().strip('*')
                if clean:
                    unique_tags.add(clean)
    
    return sorted(list(unique_tags))

if __name__ == "__main__":
    # In a real environment, I would read from the turn text.
    # Here I'll just hardcode the logic and the tags I've already identified as a starting point,
    # but I want to be 100% accurate to the provided text.
    # Since I'm the AI, I can access the text directly from context.
    pass
