import os

replacements = [
    ("name: ponytail-review", "name: reviewer-lazy-review"),
    ("name: ponytail-audit", "name: reviewer-lazy-audit"),
    ("name: ponytail-debt", "name: reviewer-lazy-debt"),
    ("name: ponytail-gain", "name: reviewer-lazy-gain"),
    ("name: ponytail-help", "name: reviewer-lazy-help"),
    ("name: ponytail", "name: reviewer-lazy"),
    ("/ponytail-review", "/reviewer-lazy-review"),
    ("/ponytail-audit", "/reviewer-lazy-audit"),
    ("/ponytail-debt", "/reviewer-lazy-debt"),
    ("/ponytail-gain", "/reviewer-lazy-gain"),
    ("/ponytail-help", "/reviewer-lazy-help"),
    ("/ponytail", "/reviewer-lazy")
]

src_base = r"c:\Users\soni8\Desktop\everything\University 2.0\Project(s)\1_Working on\Code Review\ponytail\skills"
dest_base = r"c:\Users\soni8\Desktop\everything\University 2.0\Project(s)\1_Working on\Code Review\reviewer\skills"

mappings = {
    "ponytail": "reviewer-lazy",
    "ponytail-review": "reviewer-lazy-review",
    "ponytail-audit": "reviewer-lazy-audit",
    "ponytail-debt": "reviewer-lazy-debt",
    "ponytail-gain": "reviewer-lazy-gain",
    "ponytail-help": "reviewer-lazy-help"
}

for old_name, new_name in mappings.items():
    src_file = os.path.join(src_base, old_name, "SKILL.md")
    dest_dir = os.path.join(dest_base, new_name)
    os.makedirs(dest_dir, exist_ok=True)
    dest_file = os.path.join(dest_dir, "SKILL.md")
    
    with open(src_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    for old_txt, new_txt in replacements:
        content = content.replace(old_txt, new_txt)
        
    with open(dest_file, "w", encoding="utf-8") as f:
        f.write(content)

sec_src = r"c:\Users\soni8\Desktop\everything\University 2.0\Project(s)\1_Working on\Code Review\claude-code-security-audit"
sec_dest_dir = os.path.join(dest_base, "reviewer-security")
os.makedirs(sec_dest_dir, exist_ok=True)

with open(os.path.join(sec_src, "SKILL.md"), "r", encoding="utf-8") as f:
    sec_content = f.read()
    
sec_content = sec_content.replace("name: security-audit", "name: reviewer-security")
sec_content = sec_content.replace("/security-audit", "/reviewer-security")

with open(os.path.join(sec_dest_dir, "SKILL.md"), "w", encoding="utf-8") as f:
    f.write(sec_content)
