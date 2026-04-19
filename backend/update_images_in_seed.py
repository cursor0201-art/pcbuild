import json
import sqlite3
import re

def update_seed_script_with_images():
    # Connect to local DB to get image paths
    conn = sqlite3.connect('backend/db.sqlite3')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT slug, image FROM shop_product')
    image_map = {row['slug']: row['image'] for row in cur.fetchall()}
    conn.close()

    # Read existing script
    with open('backend/manage_sample_data.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to find each product entry in products_data and add 'image': '...'
    # This is tricky with regex. I'll use a simpler approach.
    
    # Let's rebuild the products_data block
    # I'll re-read the my_real_data.json I created earlier (if it still exists)
    # Actually I deleted it. I'll just use the SQLite data again.
    
    # ... actually, I'll just write a script that knows the images.
    
    # I'll use a more robust regex to find the product dicts
    for slug, image_path in image_map.items():
        if not image_path: continue
        
        # Look for the block with this slug
        pattern = r"('slug': '" + re.escape(slug) + r"',)"
        replacement = r"\1\n            'image': '" + image_path + r"',"
        content = re.sub(pattern, replacement, content)

    with open('backend/manage_sample_data.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("manage_sample_data.py updated with image paths!")

if __name__ == '__main__':
    update_seed_script_with_images()
