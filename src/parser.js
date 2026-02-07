// TDD: This parser must handle lists in Markdown
// Specifically: "- [ ] Task" or "- [x] Task"
// It should also extract Title/Description/Timestamp from Frontmatter

function parseMarkdown(md) {
    const result = {
        title: "Untitled List",
        description: "",
        items: []
    };

    if (!md) return result;

    // 1. Frontmatter extraction (simple regex for --- ... ---)
    const frontmatterMatch = md.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
        const yaml = frontmatterMatch[1];
        // quick & dirty yaml parser for title/description
        const titleMatch = yaml.match(/title:\s*["']?([^"'\n]+)["']?/);
        if (titleMatch) result.title = titleMatch[1];
        
        const descMatch = yaml.match(/description:\s*["']?([^"'\n]+)["']?/);
        if (descMatch) result.description = descMatch[1];
    }

    // 2. Task parsing
    // Matches "- [ ]" or "- [x]" followed by text
    const lines = md.split('\n');
    lines.forEach(line => {
        const taskMatch = line.match(/^\s*-\s*\[([ xX])\]\s*(.*)$/);
        if (taskMatch) {
            const isChecked = taskMatch[1].toLowerCase() === 'x';
            let text = taskMatch[2];
            let timestamp = null;

            // Extract timestamp `YYYYMMDD HH:MM` if present at start
            const timeMatch = text.match(/^`(\d{8}\s\d{2}:\d{2})`\s*(.*)$/);
            if (timeMatch) {
                timestamp = timeMatch[1];
                text = timeMatch[2];
            }

            result.items.push({
                done: isChecked,
                text: text.trim(),
                timestamp: timestamp
            });
        }
    });

    return result;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseMarkdown };
}
