import os
import re

PROJECT_ROOT = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare'

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find href="../products/xyz.html"
    # We want to change it to href="../products/xyz/index.html"
    
    # match group 1: href="../products/
    # match group 2: filename (xyz)
    # match group 3: .html"
    
    pattern = re.compile(r'(href=["\']\.\./products/)([^/]+?)(\.html["\'])')
    
    def replacer(match):
        prefix = match.group(1)
        filename = match.group(2)
        suffix = match.group(3)
        quote = suffix[-1]
        
        # New format: ../products/filename/index.html
        new_link = f'{prefix}{filename}/index.html{quote}'
        
        print(f"Fixed in {os.path.basename(file_path)}: .../{filename}.html -> .../{filename}/index.html")
        return new_link

    new_content = pattern.sub(replacer, content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

def main():
    categories_dir = os.path.join(PROJECT_ROOT, 'categories')
    if not os.path.exists(categories_dir):
        print("Categories directory not found.")
        return

    for root, dirs, files in os.walk(categories_dir):
        for file in files:
            if file.endswith('.html'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
