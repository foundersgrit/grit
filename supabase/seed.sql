-- SEED DATA FOR GRIT PLATFORM

-- Categories
INSERT INTO public.categories (name, slug, description) VALUES
('Tops', 'tops', 'Reinforced upper-body gear.'),
('Bottoms', 'bottoms', 'Durable lower-body essentials.'),
('Outerwear', 'outerwear', 'Weather-resistant barrier layers.'),
('Baselayers', 'baselayers', 'Moisture-wicking foundation pieces.'),
('Accessories', 'accessories', 'Technical add-ons for the grind.'),
('Limited Editions', 'limited-editions', 'Rare drops for the elite.')
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO public.products (name, slug, category_slug, price, description, specifications, images, variants) VALUES
(
    'Tactical Endurance Hoodie', 
    'tactical-endurance-hoodie', 
    'tops', 
    4850, 
    'Built for the relentless. Reinforced elbows and moisture-wicking tech.', 
    '{"Fabric": "80% Cotton, 20% Technical Polyester", "Weight": "450gsm", "Reinforcement": "Double-stitched stress points"}'::jsonb,
    ARRAY['/images/products/hoodie-1.webp', '/images/products/hoodie-2.webp'],
    '[
        {"id": "v1", "size": "S", "color": "Bottle Green", "stock": 15},
        {"id": "v2", "size": "M", "color": "Bottle Green", "stock": 25},
        {"id": "v3", "size": "L", "color": "Bottle Green", "stock": 10}
    ]'::jsonb
),
(
    'Arena Combat Joggers', 
    'arena-combat-joggers', 
    'bottoms', 
    3950, 
    'High-mobility trousers for intense arena sessions.', 
    '{"Material": "Ripstop Nylon Blend", "Stretch": "4-way mechanical", "Pockets": "6 technical utility"}'::jsonb,
    ARRAY['/images/products/joggers-1.webp'],
    '[
        {"id": "v4", "size": "M", "color": "Dark Slate", "stock": 20},
        {"id": "v5", "size": "L", "color": "Dark Slate", "stock": 18}
    ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Journal Entries
INSERT INTO public.journal_entries (title, slug, excerpt, author, category, body_content, featured_image) VALUES
(
    'The Science of Endurance', 
    'science-of-endurance', 
    'Understanding the physiological barriers of elite performance.', 
    'Asfak Ahamed', 
    'Endurance', 
    'Endurance is more than physical stamina; it is a psychological architecture built through repeated failure...', 
    '/images/journal/endurance.webp'
)
ON CONFLICT (slug) DO NOTHING;

-- Arena Entries
INSERT INTO public.arena_entries (member_name, story_excerpt, challenge_name, spotlight_image) VALUES
(
    'Rayhan Kabir', 
    'Clocked 500 hours in the tactical hoodie. Zero failure at seams.', 
    'Iron Will 2026', 
    '/images/arena/rayhan.webp'
);
