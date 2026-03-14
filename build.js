const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// ── Config ────────────────────────────────────────────────────
const NOTES_DIR = path.join(__dirname, 'notes');
const OUTPUT_DIR = path.join(__dirname, 'dist');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const STATIC_DIR = path.join(__dirname, 'static');

// ── Helpers ───────────────────────────────────────────────────
function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readTemplate(name) {
    return fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf-8');
}

// ── Parse all notes ───────────────────────────────────────────
function parseNotes() {
    const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'));
    const notes = {};

    for (const file of files) {
        const raw = fs.readFileSync(path.join(NOTES_DIR, file), 'utf-8');
        const { data: frontmatter, content } = matter(raw);
        const name = path.basename(file, '.md');
        const slug = slugify(name);

        notes[name] = {
            name,
            slug,
            title: frontmatter.title || name,
            stage: frontmatter.stage || 'seedling', // seedling, growing, evergreen
            tags: frontmatter.tags || [],
            summary: frontmatter.summary || '',
            content,
            links: [],     // outgoing [[links]]
            backlinks: []  // pages that link to this
        };
    }

    return notes;
}

// ── Resolve [[wiki-links]] ───────────────────────────────────
function resolveWikiLinks(notes) {
    const nameMap = {};
    for (const [name, note] of Object.entries(notes)) {
        nameMap[name.toLowerCase()] = note;
    }

    for (const [name, note] of Object.entries(notes)) {
        // Find all [[Link]] or [[Link|Display Text]] patterns
        const linkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        let match;
        while ((match = linkRegex.exec(note.content)) !== null) {
            const target = match[1].trim();
            const targetLower = target.toLowerCase();
            if (nameMap[targetLower] && targetLower !== name.toLowerCase()) {
                note.links.push(nameMap[targetLower].name);
                nameMap[targetLower].backlinks.push(name);
            }
        }
        // Deduplicate
        note.links = [...new Set(note.links)];
    }

    // Deduplicate backlinks
    for (const note of Object.values(notes)) {
        note.backlinks = [...new Set(note.backlinks)];
    }
}

// ── Render markdown with wiki-links → HTML links ─────────────
function renderContent(content, notes) {
    const nameMap = {};
    for (const note of Object.values(notes)) {
        nameMap[note.name.toLowerCase()] = note;
    }

    // Replace [[links]] with HTML
    const withLinks = content.replace(
        /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
        (_, target, display) => {
            const targetNote = nameMap[target.trim().toLowerCase()];
            const text = display || target.trim();
            if (targetNote) {
                return `<a href="${targetNote.slug}.html" class="wiki-link">${text}</a>`;
            }
            return `<span class="wiki-link broken" title="Note not yet written">${text}</span>`;
        }
    );

    return marked(withLinks);
}

// ── Build graph data ─────────────────────────────────────────
function buildGraphData(notes) {
    const nodes = [];
    const edges = [];
    const stageSize = { seedling: 6, growing: 10, evergreen: 15 };

    for (const note of Object.values(notes)) {
        nodes.push({
            id: note.slug,
            label: note.title,
            stage: note.stage,
            size: stageSize[note.stage] || 8,
            connections: note.links.length + note.backlinks.length
        });

        for (const linkName of note.links) {
            const target = notes[linkName];
            if (target) {
                edges.push({ source: note.slug, target: target.slug });
            }
        }
    }

    return { nodes, edges };
}

// ── Generate HTML pages ──────────────────────────────────────
function build() {
    console.log('🌱 Building digital garden...\n');

    const notes = parseNotes();
    resolveWikiLinks(notes);

    ensureDir(OUTPUT_DIR);
    ensureDir(path.join(OUTPUT_DIR, 'css'));
    ensureDir(path.join(OUTPUT_DIR, 'js'));

    // Copy static files
    if (fs.existsSync(path.join(STATIC_DIR, 'css'))) {
        for (const f of fs.readdirSync(path.join(STATIC_DIR, 'css'))) {
            fs.copyFileSync(path.join(STATIC_DIR, 'css', f), path.join(OUTPUT_DIR, 'css', f));
        }
    }
    if (fs.existsSync(path.join(STATIC_DIR, 'js'))) {
        for (const f of fs.readdirSync(path.join(STATIC_DIR, 'js'))) {
            fs.copyFileSync(path.join(STATIC_DIR, 'js', f), path.join(OUTPUT_DIR, 'js', f));
        }
    }

    const noteTemplate = readTemplate('note.html');
    const indexTemplate = readTemplate('index.html');
    const graphTemplate = readTemplate('graph.html');

    // ── Build each note page ──────────────────────────────────
    const notesList = Object.values(notes);
    const stageEmoji = { seedling: '🌱', growing: '🌿', evergreen: '🌳' };

    for (const note of notesList) {
        const bodyHtml = renderContent(note.content, notes);

        const backlinksHtml = note.backlinks.length > 0
            ? note.backlinks.map(bl => {
                const bn = notes[bl];
                return `<a href="${bn.slug}.html" class="backlink-item">${bn.title}</a>`;
            }).join('\n')
            : '<p class="no-backlinks">No other notes link here yet.</p>';

        const tagsHtml = note.tags.map(t => `<span class="note-tag">${t}</span>`).join('');

        const html = noteTemplate
            .replace(/{{title}}/g, note.title)
            .replace(/{{stage}}/g, note.stage)
            .replace(/{{stageEmoji}}/g, stageEmoji[note.stage] || '🌱')
            .replace(/{{tags}}/g, tagsHtml)
            .replace(/{{body}}/g, bodyHtml)
            .replace(/{{backlinks}}/g, backlinksHtml);

        fs.writeFileSync(path.join(OUTPUT_DIR, `${note.slug}.html`), html);
        console.log(`  📄 ${note.title} (${note.stage})`);
    }

    // ── Build index page ──────────────────────────────────────
    const sortedNotes = notesList.sort((a, b) => a.title.localeCompare(b.title));
    const indexCardsHtml = sortedNotes.map(n => `
        <a href="${n.slug}.html" class="garden-card" data-stage="${n.stage}" data-tags="${n.tags.join(' ')}">
            <div class="card-stage">${stageEmoji[n.stage] || '🌱'} ${n.stage}</div>
            <h2>${n.title}</h2>
            ${n.summary ? `<p>${n.summary}</p>` : ''}
            <div class="card-meta">${n.links.length + n.backlinks.length} connections</div>
        </a>
    `).join('\n');

    const indexHtml = indexTemplate
        .replace('{{cards}}', indexCardsHtml)
        .replace('{{count}}', notesList.length);

    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml);

    // ── Build graph page ──────────────────────────────────────
    const graphData = buildGraphData(notes);
    const graphHtml = graphTemplate.replace('GRAPH_DATA_PLACEHOLDER', JSON.stringify(graphData));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'graph.html'), graphHtml);

    console.log(`\n✅ Built ${notesList.length} notes + index + graph → dist/`);
}

build();
