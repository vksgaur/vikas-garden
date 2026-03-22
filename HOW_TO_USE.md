# 🌿 Vikas's Digital Garden — Instruction Manual

> **Live site:** https://vksgaur.github.io/vikas-garden/
> **Repository:** https://github.com/vksgaur/vikas-garden

---

## What Is This?

A digital garden is a collection of interconnected notes — like a personal Wikipedia. Unlike a blog (which is linear and chronological), a garden is non-linear. Ideas link to each other, grow over time, and don't need to be "finished" before you publish them.

---

## How to Add a New Note

### The Easiest Way (Browser Only)

1. Go to https://github.com/vksgaur/vikas-garden/tree/main/notes
2. Click **"Add file"** → **"Create new file"**
3. Name it (e.g., `My New Idea.md`)
4. Write your note (see template below)
5. Click **"Commit changes"**
6. ✅ Your note is live in ~45 seconds

### Note Template

Copy this at the top of every new note:

```markdown
---
title: "Your Note Title"
stage: seedling
tags: [ideas]
summary: "One line about what this note is about."
---

Your content here. Write freely.

Link to other notes like this: [[The Enlightenment]] or [[Democracy]].
```

#### Required Fields
- **title** — the display name of your note
- **stage** — one of `seedling`, `growing`, or `evergreen`

#### Optional Fields
- **tags** — broad categories (e.g., `history`, `philosophy`, `economics`)
- **summary** — a one-liner that appears on the homepage card

---

## The Three Growth Stages

| Stage | Emoji | When to Use |
|-------|-------|-------------|
| **seedling** | 🌱 | A quick thought, a half-formed idea, even just 2-3 lines |
| **growing** | 🌿 | You've added more depth, examples, or structure |
| **evergreen** | 🌳 | Well-developed, revisited multiple times, a reference page |

**Start everything as `seedling`.** Promote later when you naturally revisit and expand.

---

## How to Link Notes Together

When you mention a concept that is (or could be) its own note, wrap it in double brackets:

```markdown
The success of Singapore proves that [[Institutions Matter More Than Geography]].
```

**What happens:**
- If the note exists → becomes a clickable green link on the site
- If it doesn't exist yet → appears as a grey broken link (a reminder to write it someday)

**The link must match the filename exactly** (without `.md`). For example:
- File: `The Enlightenment.md` → Link: `[[The Enlightenment]]`
- File: `John Locke.md` → Link: `[[John Locke]]`

**Display text:** You can show different text with the pipe syntax:
```markdown
Read more about the [[The Enlightenment|Age of Reason]].
```
This shows "Age of Reason" but links to "The Enlightenment" note.

---

## How to Edit an Existing Note

1. Go to https://github.com/vksgaur/vikas-garden/tree/main/notes
2. Click on the note you want to edit
3. Click the **pencil icon** (✏️) to edit
4. Make your changes
5. Click **"Commit changes"**
6. ✅ Updated in ~45 seconds

### Common Edits
- **Promote a seedling** → change `stage: seedling` to `stage: growing`
- **Add links** → just add `[[Note Name]]` anywhere in the text
- **Add tags** → update the `tags: [...]` line in the header

---

## How to Delete a Note

1. Go to the note on GitHub
2. Click the **three dots** menu (⋯) → **Delete file**
3. Commit the change

---

## Tags — Keep It Simple

Use **broad categories**. Aim for 5-10 tags across your entire garden:

| ✅ Good | ❌ Too Specific |
|---------|----------------|
| `history` | `18th-century-european-history` |
| `philosophy` | `epistemological-frameworks` |
| `economics` | `fiscal-policy-in-emerging-markets` |
| `ideas` | `shower-thought-march-2026` |
| `people` | `enlightenment-era-philosophers` |
| `books` | `chapter-3-of-sapiens` |
| `mental-models` | `compound-interest-applied-to-learning` |
| `science` | `biology-of-neural-networks` |
| `politics` | `indian-electoral-reform` |

---

## The Graph Page

Visit https://vksgaur.github.io/vikas-garden/graph.html to see how your ideas connect visually.

- **Bigger nodes** = evergreen notes (well-developed)
- **Smaller nodes** = seedlings (early ideas)
- **Lines** = links between notes
- **Click any node** to jump to that note
- **Drag nodes** to rearrange the graph

The graph builds itself automatically from your `[[links]]`.

---

## Backlinks

At the bottom of every note, you'll see a **"🔗 Linked from"** section. This automatically shows all other notes that link TO this note. You don't need to do anything — backlinks are generated automatically during build.

---

## Quick Reference

| I want to... | Do this... |
|---|---|
| Add a new note | Create a `.md` file in `/notes/` on GitHub |
| Link to another note | Write `[[Note Title]]` in your text |
| Mark an idea as developing | Change `stage: seedling` to `stage: growing` |
| See how ideas connect | Visit the `/graph.html` page |
| Delete a note | Delete the file on GitHub |
| Change the site design | Edit `static/css/garden.css` |

---

## Project Files (For Reference)

```
vikas-garden/
├── notes/               ← Your notes go here
│   ├── The Enlightenment.md
│   ├── Democracy.md
│   ├── John Locke.md
│   └── ...
├── build.js             ← Converts notes to HTML (runs automatically)
├── static/css/
│   └── garden.css       ← The site's visual design
├── templates/
│   ├── index.html       ← Homepage template
│   ├── note.html        ← Individual note template
│   └── graph.html       ← Graph visualization template
└── .github/workflows/
    └── deploy.yml       ← Auto-deploys on every commit
```

---

## Tips for a Great Garden

1. **Start small** — even 2-3 sentences make a valid seedling
2. **Link generously** — links are what make a garden a *garden*
3. **Revisit weekly** — browse your index, expand one seedling
4. **Don't aim for perfection** — messy, connected notes > polished, isolated essays
5. **Think in concepts** — each note should be about ONE idea, not a whole topic

---

*Last updated: March 15, 2026*
