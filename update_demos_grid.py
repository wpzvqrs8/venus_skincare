import os
import re

DEMOS_DIR = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare\demos'
DEMOS_HTML_PATH = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare\demos.html'
PRODUCTS_DIR = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare\products'

def update_demos_index():
    # Get list of demo files
    demo_files = [f for f in os.listdir(DEMOS_DIR) if f.endswith('-demo.html')]
    
    grid_html = ""
    
    for demo_file in demo_files:
        product_name = demo_file.replace('-demo.html', '').replace('-', ' ').title()
        
        # Try to find image from original product file
        original_product_file = demo_file.replace('-demo.html', '.html')
        img_src = "img/portable-diode-hair-removal-machine-01.png" # Default
        
        try:
            with open(os.path.join(PRODUCTS_DIR, original_product_file), 'r', encoding='utf-8') as f:
                content = f.read()
                match = re.search(r'<img src="\.\./img/(.*?)"', content)
                if match:
                    img_src = f"img/{match.group(1)}"
        except:
            pass

        card = f"""
                        <div class="demo-card">
                            <a href="demos/{demo_file}" style="display: block;">
                                <img src="{img_src}" alt="{product_name} Demo" class="demo-thumbnail">
                                <div class="demo-content">
                                    <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--color-primary);">{product_name}</h3>
                                    <p style="color: #64748b; font-size: 0.9rem;">Operational guide and treatment steps.</p>
                                </div>
                            </a>
                        </div>"""
        grid_html += card

    # Read demos.html
    with open(DEMOS_HTML_PATH, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Replace grid content
    # Look for <div class="demos-grid"> ... </div>
    new_html = re.sub(
        r'(<div class="demos-grid">)(.*?)(</div>)',
        f'\\1{grid_html}\\3',
        html_content,
        flags=re.DOTALL
    )

    with open(DEMOS_HTML_PATH, 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    print(f"Updated demos.html with {len(demo_files)} items.")

if __name__ == "__main__":
    update_demos_index()
