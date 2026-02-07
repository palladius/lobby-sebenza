const { parseMarkdown } = require('../src/parser');

describe('parseMarkdown', () => {
    test('should parse a simple checkbox list', () => {
        const md = `
- [ ] Task 1
- [x] Task 2
        `;
        const result = parseMarkdown(md);
        expect(result.items).toHaveLength(2);
        expect(result.items[0].done).toBe(false);
        expect(result.items[1].done).toBe(true);
        expect(result.items[0].text).toBe('Task 1');
    });

    test('should extract title from frontmatter', () => {
        const md = `---
title: "My List"
---
- [ ] Item
        `;
        const result = parseMarkdown(md);
        expect(result.title).toBe("My List");
    });

    test('should extract timestamps `YYYYMMDD HH:MM`', () => {
        const md = `- [ ] \`20260207 12:00\` Go to Safari`;
        const result = parseMarkdown(md);
        expect(result.items[0].timestamp).toBe('20260207 12:00');
        expect(result.items[0].text).toBe('Go to Safari');
    });

    test('should handle empty markdown gracefully', () => {
        expect(parseMarkdown(null)).toEqual({ title: "Untitled List", description: "", items: [] });
    });
});
