import os
import re

# Configuration
PRODUCTS_DIR = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare\products'
DEMOS_DIR = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare\demos'
TEMPLATE_PATH = r'c:\Users\Admin\.vscode\$PROJECTS\venus-skincare\demos\venus-diode-1-demo.html'

# Step Templates (HTML fragments)
STEPS_DIODE = r"""
                    <!-- Step 1 -->
                    <div class="step-item"><div class="step-number">01</div><div class="step-content"><h3>Prepare the Client</h3><p>Shave the area, clean skin, and ensure it is dry. Wear safety goggles.</p></div></div>
                    <!-- Step 2 -->
                    <div class="step-item"><div class="step-number">02</div><div class="step-content"><h3>Gel Application</h3><p>Apply ultrasound gel.</p></div></div>
                    <!-- Step 3 -->
                    <div class="step-item"><div class="step-number">03</div><div class="step-content"><h3>Settings</h3><p>Select skin type and hair thickness.</p></div></div>
                    <!-- Hidden -->
                    <div class="step-item hidden-step"><div class="step-number">04</div><div class="step-content"><h3>Treatment</h3><p>Use sliding (SHR) or stamping (HR) motion.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">05</div><div class="step-content"><h3>Post-Care</h3><p>Clean area and apply aloe vera.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">06</div><div class="step-content"><h3>Maintenance</h3><p>Clean handpiece with disinfectant.</p></div></div>
"""

STEPS_IPL = r"""
                    <div class="step-item"><div class="step-number">01</div><div class="step-content"><h3>Preparation</h3><p>Shave and clean area. Apply gel.</p></div></div>
                    <div class="step-item"><div class="step-number">02</div><div class="step-content"><h3>Filter Selection</h3><p>Insert correct filter (e.g., 640nm for hair, 530nm for skin).</p></div></div>
                    <div class="step-item"><div class="step-number">03</div><div class="step-content"><h3>Settings</h3><p>Adjust IPL energy and pulse width.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">04</div><div class="step-content"><h3>Treatment</h3><p>Place crystal on skin and flash. Move with overlap.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">05</div><div class="step-content"><h3>Cooling</h3><p>Ensure cooling tip remains cold.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">06</div><div class="step-content"><h3>Finish</h3><p>Clean gel and apply sunblock.</p></div></div>
"""

STEPS_HIFU = r"""
                    <div class="step-item"><div class="step-number">01</div><div class="step-content"><h3>Mapping</h3><p>Mark treatment zones on face/body.</p></div></div>
                    <div class="step-item"><div class="step-number">02</div><div class="step-content"><h3>Cartridge</h3><p>Select depth (1.5mm, 3.0mm, 4.5mm).</p></div></div>
                    <div class="step-item"><div class="step-number">03</div><div class="step-content"><h3>Gel</h3><p>Apply generous amount of gel.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">04</div><div class="step-content"><h3>Shooting</h3><p>Press button to deliver shots line by line.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">05</div><div class="step-content"><h3>Adjustment</h3><p>Adjust spacing and length if needed.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">06</div><div class="step-content"><h3>Post-Op</h3><p>No downtime. Normal skincare.</p></div></div>
"""

STEPS_HYDRA = r"""
                    <div class="step-item"><div class="step-number">01</div><div class="step-content"><h3>Cleanse</h3><p>Remove makeup.</p></div></div>
                    <div class="step-item"><div class="step-number">02</div><div class="step-content"><h3>Hydro Peeling</h3><p>Use suction pen with Solution A (AHA).</p></div></div>
                    <div class="step-item"><div class="step-number">03</div><div class="step-content"><h3>Extraction</h3><p>Use Solution B (BHA) on T-zone.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">04</div><div class="step-content"><h3>Hydration</h3><p>Use Solution C to infuse nutrients.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">05</div><div class="step-content"><h3>RF / Ultrasound</h3><p>Use lifting handles for absorption.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">06</div><div class="step-content"><h3>Cold Hammer</h3><p>Seal pores and calm skin.</p></div></div>
"""

STEPS_LASER_TATTOO = r"""
                    <div class="step-item"><div class="step-number">01</div><div class="step-content"><h3>Numbing</h3><p>Apply numbing cream for 30 mins.</p></div></div>
                    <div class="step-item"><div class="step-number">02</div><div class="step-content"><h3>Tip Selection</h3><p>1064nm for dark, 532nm for red/color.</p></div></div>
                    <div class="step-item"><div class="step-number">03</div><div class="step-content"><h3>Aiming</h3><p>Aim pilot beam at pigment.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">04</div><div class="step-content"><h3>Firing</h3><p>Fire laser. Look for frosting effect.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">05</div><div class="step-content"><h3>Cooling</h3><p>Ice pack immediately.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">06</div><div class="step-content"><h3>Care</h3><p>Antibiotic ointment and bandage.</p></div></div>
"""

STEPS_CO2 = r"""
                    <div class="step-item"><div class="step-number">01</div><div class="step-content"><h3>Numbing</h3><p>Apply numbing cream for 45 mins.</p></div></div>
                    <div class="step-item"><div class="step-number">02</div><div class="step-content"><h3>Shape Selection</h3><p>Draw scan area (square, triangle).</p></div></div>
                    <div class="step-item"><div class="step-number">03</div><div class="step-content"><h3>Scan</h3><p>Deliver fractional laser shots.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">04</div><div class="step-content"><h3>Technique</h3><p>Do not overlap scan areas.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">05</div><div class="step-content"><h3>Post-Op</h3><p>Skin will be red. Keep moist.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">06</div><div class="step-content"><h3>Recovery</h3><p>Avoid sun for 1 month.</p></div></div>
"""

STEPS_DEFAULT = r"""
                    <div class="step-item"><div class="step-number">01</div><div class="step-content"><h3>Setup</h3><p>Unpack and assemble device.</p></div></div>
                    <div class="step-item"><div class="step-number">02</div><div class="step-content"><h3>Power On</h3><p>Connect power and switch on.</p></div></div>
                    <div class="step-item"><div class="step-number">03</div><div class="step-content"><h3>Operation</h3><p>Follow screen prompts or manual.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">04</div><div class="step-content"><h3>Usage</h3><p>Use according to professional training.</p></div></div>
                    <div class="step-item hidden-step"><div class="step-number">05</div><div class="step-content"><h3>Cleaning</h3><p>Clean after every use.</p></div></div>
"""

def get_machine_type(filename):
    name = filename.lower()
    if 'diode' in name: return 'Diode Laser', STEPS_DIODE
    if 'ipl' in name or 'shr' in name: return 'IPL/SHR System', STEPS_IPL
    if 'hifu' in name: return 'HIFU System', STEPS_HIFU
    if 'hydra' in name or 'h2o2' in name or 'bubble' in name: return 'Hydra Beauty', STEPS_HYDRA
    if 'nd-yag' in name or 'pico' in name or 'laser' in name: return 'Laser System', STEPS_LASER_TATTOO
    if 'co2' in name: return 'CO2 Fractional', STEPS_CO2
    return 'Professional Device', STEPS_DEFAULT

def generate_demos():
    print("Starting generation...")
    
    # Read Template
    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
        template = f.read()

    files = [f for f in os.listdir(PRODUCTS_DIR) if f.endswith('.html')]
    demo_links = [] # To update demos.html later if needed

    for filename in files:
        if filename == 'venus-diode-1.html': continue # Skip source template

        product_name = filename.replace('.html', '').replace('-', ' ').title()
        machine_type, steps = get_machine_type(filename)
        
        demo_filename = filename.replace('.html', '-demo.html')
        demo_filepath = os.path.join(DEMOS_DIR, demo_filename)
        
        # 1. GENERATE DEMO PAGE
        title_pattern = r'<title>.*?</title>'
        h1_pattern = r'<h1 class="section-title-dark">.*?</h1>'
        steps_pattern = r'<div class="steps-list" id="stepsList">.*?</div>'
        
        new_content = re.sub(title_pattern, f'<title>{product_name} Demo | Venus Skincare</title>', template)
        new_content = re.sub(h1_pattern, f'<h1 class="section-title-dark">{product_name}</h1>', new_content)
        new_content = re.sub(steps_pattern, f'<div class="steps-list" id="stepsList">{steps}</div>', new_content, flags=re.DOTALL)
        
        # Update image if possible (naive check for matching image in original file)
        # For now, we will use the same placeholder as template or try to extract from product file.
        # Let's try to extract hero image from product file
        product_filepath = os.path.join(PRODUCTS_DIR, filename)
        with open(product_filepath, 'r', encoding='utf-8') as f:
            prod_content = f.read()
        
        img_match = re.search(r'<img src="\.\./img/(.*?)"', prod_content)
        if img_match:
            img_src = img_match.group(1)
            # Update video placeholder
            new_content = new_content.replace('src="../img/portable-diode-hair-removal-machine-01.png"', f'src="../img/{img_src}"')
        
        with open(demo_filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Created {demo_filename}")

        # 2. INJECT WATCH DEMO BUTTON INTO PRODUCT PAGE
        # Look for <div class="hero-actions"> ... </div>
        # And append button if not exists
        if 'Watch Demo' not in prod_content:
            action_pattern = r'(<div class="hero-actions".*?>)(.*?)(</div>)'
            
            # Helper to add button
            def add_btn(match):
                start, inner, end = match.groups()
                btn_html = f'\n                        <a href="../demos/{demo_filename}" class="btn-glass">Watch Demo</a>'
                return f"{start}{inner}{btn_html}{end}"
            
            new_prod_content = re.sub(action_pattern, add_btn, prod_content, flags=re.DOTALL)
            
            if new_prod_content != prod_content:
                with open(product_filepath, 'w', encoding='utf-8') as f:
                    f.write(new_prod_content)
                print(f"Updated {filename} with Watch Button")

    print("Done.")

if __name__ == "__main__":
    generate_demos()
