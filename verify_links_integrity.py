import os
import re
from urllib.parse import unquote

PROJECT_ROOT = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare'

def verify_links():
    print("Starting link verification...")
    broken_links = []
    checked_count = 0
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Exclude hidden dirs
        if '.git' in dirs: dirs.remove('.git')
        if 'node_modules' in dirs: dirs.remove('node_modules')
        
        for file in files:
            if not file.endswith('.html'):
                continue
                
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find all href and src
            # match group 2 is the url
            # We ignore #, mailto:, tel:, http:, https:, //
            
            # Simple regex
            matches = re.finditer(r'(href|src)=["\']([^"\']+)["\']', content)
            
            for match in matches:
                attr = match.group(1)
                url = match.group(2)
                
                # Filter out external/special links
                if url.startswith(('http', '//', 'mailto:', 'tel:', 'javascript:', '#')):
                    continue
                
                # Check for absolute paths (still bad for GH pages)
                if url.startswith('/'):
                    broken_links.append(f"Generic Absolute Path: {file} -> {url}")
                    continue
                    
                # Resolve relative path
                # Handle query params or anchors
                clean_url = url.split('?')[0].split('#')[0]
                
                # URL might be URL-encoded?
                clean_url = unquote(clean_url)
                
                target_path = os.path.normpath(os.path.join(root, clean_url))
                
                if not os.path.exists(target_path):
                    # Maybe it's a directory and we should check for index.html inside?
                    # But we updated links to include index.html explicitly. 
                    # If the link *is* a directory, let's check if it exists at least.
                    if os.path.exists(target_path) and os.path.isdir(target_path):
                         # Technically valid if server redirects, but we wanted explicit index.html
                         # Let's flag if it doesn't end in .html and is a dir?
                         # The user asked for all things perfect.
                         pass
                    else:
                        broken_links.append(f"Missing File: {os.path.relpath(file_path, PROJECT_ROOT)} -> {url} (resolved: {target_path})")
                
                checked_count += 1

    print(f"Verified {checked_count} links.")
    
    if broken_links:
        print(f"Found {len(broken_links)} issues:")
        for link in broken_links:
            print(f" - {link}")
    else:
        print("No broken links found!")

if __name__ == "__main__":
    verify_links()
