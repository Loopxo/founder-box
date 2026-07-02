import re

files = [
    '/Users/main/Desktop/projext/founder-box/my-goal/Loopxo Academy/web/src/index.css',
    '/Users/main/Desktop/projext/founder-box/my-goal/Loopxo Academy/web/src/App.css',
    '/Users/main/Desktop/projext/founder-box/my-goal/Loopxo Academy/web/src/mappack-game.css'
]

combined = ""
for f in files:
    with open(f, 'r') as file:
        combined += file.read() + "\n"

# Remove imports and :root
combined = re.sub(r'@import url\(.*?\);\n', '', combined)
combined = re.sub(r':root\s*\{[^}]*\}', '', combined, flags=re.MULTILINE)

# Namespace map
classes_to_namespace = [
    'mappack-app', 'sidebar', 'main-content', 'realm-hub', 'realm-card', 
    'hub-header', 'stats-grid', 'stat-card', 'nav-item', 'nav-icon',
    'academy-logo', 'top-bar', 'btn', 'realm-map-container', 'map-node',
    'map-path', 'level-page', 'knowledge-vault', 'tools-container',
    'stepper', 'step-item', 'scenario-player', 'proof-log'
]
# We'll just prefix all classes that are part of the app.
# Actually, since there are many classes, let's prefix `.btn` to `.academy-btn` etc.
# A simpler approach: we can wrap everything in `.academy-app`? Wait, we can just replace specific root classes.

# Let's do string replacements for colors to match Studio theme
replacements = {
    'var(--bg-app)': '#111118',
    'var(--bg-surface)': '#18181F',
    'var(--bg-surface-hover)': '#1E1E28',
    'var(--text-main)': '#EDE9DC',
    'var(--text-muted)': '#9E9880',
    'var(--border-color)': '#2A2A38',
    'var(--accent)': '#D4A853',
    'var(--accent-hover)': '#c29a4a',
    'var(--accent-glow)': 'rgba(212, 168, 83, 0.3)',
    'var(--success)': '#4D9E6A',
    'var(--success-glow)': 'rgba(77, 158, 106, 0.3)',
    'var(--warning)': '#C0514A',
    'var(--sidebar-width)': '280px',
    'var(--font-heading)': 'inherit',
    'var(--font-body)': 'inherit',
    '#f5f7fb': '#111118',
    '#ffffff': '#18181F',
    '#f0f2f7': '#1E1E28',
    '#121826': '#EDE9DC',
    '#4b5563': '#9E9880',
    '#e2e5ea': '#2A2A38',
    '#0f766e': '#D4A853',
    '#115e59': '#c29a4a',
    '#c92f4f': '#C0514A',
    '#15803d': '#4D9E6A'
}

for k, v in replacements.items():
    combined = combined.replace(k, v)

# Prefixing classes
prefixes = [
    'mappack-app', 'sidebar', 'main-content', 'nav-item', 'academy-logo',
    'top-bar', 'realm-hub', 'hub-header', 'stats-grid', 'stat-card', 'boss-list',
    'boss-item', 'realm-grid', 'realm-card', 'realm-map-container', 'map-node',
    'level-page', 'level-header', 'level-layout', 'level-content', 'stepper',
    'step-item', 'level-sidebar', 'reading-card', 'proof-log', 'btn', 'scenario-player',
    'knowledge-vault', 'vault-sidebar', 'vault-main', 'playbook-card', 'playbook-reader',
    'tools-layout', 'funnel-calculator', 'scraper-tool'
]

for p in prefixes:
    combined = re.sub(r'\.' + p + r'([:\s\.\[{])', r'.academy-' + p + r'\1', combined)

# Clean up CSS Reset
combined = re.sub(r'\*,\n\*::before,\n\*::after \{[^}]*\}', '', combined, flags=re.MULTILINE)
combined = re.sub(r'body \{[^}]*\}', '', combined, flags=re.MULTILINE)
combined = re.sub(r'h1, h2, h3, h4, h5, h6 \{[^}]*\}', '', combined, flags=re.MULTILINE)

with open('/Users/main/Desktop/projext/founder-box/apps/web/app/academy/academy.css', 'w') as out:
    out.write(combined)
print("CSS Ported!")
