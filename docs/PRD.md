# Product Requirement Document (PRD)

## Project: Markdown To-Do Lists (Multi-List Manager)

**Status:** Draft
**Owner:** Riccardo
**AI Assistant:** Lobby

## 1. Executive Summary
A file-based application to manage multiple To-Do lists. Unlike standard to-do apps where every item is a database row, here **one file = one context/project** (e.g., "South Africa Trip", "Groceries"). The file contains a list of related tasks, optionally grouped by sections.

## 2. Core Philosophy
- **Granularity:** The unit of management is the *List* (File).
- **Storage:** Markdown files with YAML Frontmatter for metadata.
- **Portability:** Human-readable, Git-friendly, editable by any text editor.
- **Simplicity Boundary:** We support **H2 (##)** for grouping. We do **NOT** support H3, H4, etc. nesting for tasks.

## 3. Data Schema (The "Database")
Each list is a single Markdown file stored in `memory/todo_lists/`.

### File Structure
```markdown
---
title: "Project Alpha"
created_at: "2026-02-07T10:00:00Z"
updated_at: "2026-02-07T10:15:00Z"
tags: ["work", "alpha"]
---

## Phase 1
- [x] `20260207 09:00` Setup repo
- [ ] Define architecture

## Phase 2
- [ ] Implement core
```

### Parsing Rules
1.  **Sections:** Tasks under `## Section Name` belong to that group. Tasks at the top (before any H2) belong to a virtual `Default` section.
2.  **Timestamps:**
    - Format: `` `YYYYMMDD HH:MM` `` (backticked).
    - Position: Preferred at the **start** of the line (after the checkbox) for readability.
    - **Logic:**
        - If present: Use as the item's creation/log time.
        - If absent: Treat item as created at the file's `created_at`.
3.  **Human vs. Robot:**
    - *Humans* can just write `- [ ] Buy milk`.
    - *Robots/App* should auto-append the timestamp when adding items to preserve history.

### Frontmatter Fields
- `title` (string): Display name.
- `created_at` (ISO 8601).
- `updated_at` (ISO 8601).
- `tags` (array).

## 4. Interaction (CLI/Agent)
- **Read:** Parse file, group by H2.
- **Add:** Append to specific H2 (or Default). If robot adds, include timestamp.
- **Toggle:** Flip `[ ]` to `[x]`.

## 5. Web Application (GitHub Pages)
- **Repo:** `palladius/markdown-todo-app` (TBD)
- **Deployment:** GitHub Pages via GitHub Actions.
- **Stack:** Static HTML/JS (Vue.js or React via CDN for simplicity) or Next.js static export.
- **Data Source:** Fetches raw markdown files from the repo itself (or a linked data repo).
## 6. Engineering Standards
- **Testing:** Test Driven Development (TDD) is mandatory. Logic for parsing Markdown and handling lists must be covered by unit tests.
- **CI/CD:** GitHub Actions must run tests before deployment.

