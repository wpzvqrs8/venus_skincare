import os
import re

# Project root
PROJECT_ROOT = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare'

# Files to specifically locate
TARGET_FILES = [
    'ipl-3in1.html', 'derma-chair.html', 'derma-pen-a6.html', 
    'drs-roller.html', 'zgts-roller.html', 'omega-led.html', 
    'hair-helmet.html', 'skin-analyzer.html'
]

def verify_images():
    report_lines = []
    report_lines.append("--- Locating Target Files ---")
    
    found_files = {}
    for root, dirs, files in os.walk(PROJECT_ROOT):
        for file in files:
            if file in TARGET_FILES:
                full_path = os.path.join(root, file)
                report_lines.append(f"Found {file}: {full_path}")
                found_files[file] = full_path

    report_lines.append("\n--- Verifying Images ---")
    missing_images = []
    
    for root, dirs, files in os.walk(PROJECT_ROOT):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    matches = re.finditer(r'<img[^>]+src=["\']([^"\']+)["\']', content)
                    
                    for match in matches:
                        src = match.group(1)
                        if src.startswith(('http', 'https', 'data:')):
                            continue
                        
                        if src.startswith('/'):
                            abs_image_path = os.path.join(PROJECT_ROOT, src.lstrip('/'))
                        else:
                            abs_image_path = os.path.normpath(os.path.join(root, src))
                            
                        if not os.path.exists(abs_image_path):
                            line = f"[MISSING] File: {file_path}\n    Image: {src}\n    Expected: {abs_image_path}"
                            report_lines.append(line)
                            missing_images.append((file_path, src))
                            
                except Exception as e:
                    report_lines.append(f"Error reading {file}: {e}")

    report_lines.append("\n--- Summary ---")
    report_lines.append(f"Total missing images found: {len(missing_images)}")
    
    with open('missing_images_report.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))
    
    print(f"Report saved to missing_images_report.txt. Found {len(missing_images)} missing images.")

if __name__ == "__main__":
    verify_images()
