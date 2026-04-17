---
title: Example Title
draft: true
tags:
  - example-tag
---

```markdown
---
title: Example Title
draft: false
description: 
tags:
  - example-tag
---
```
- `title`: Title of the page. If it isn’t provided, Quartz will use the name of the file as the title.
- `description`: Description of the page used for link previews.
- `permalink`: A custom URL for the page that will remain constant even if the path to the file changes.
- `aliases`: Other names for this note. This is a list of strings.
- `tags`: Tags for this note.
- `draft`: Whether to publish the page or not. This is one way to make [pages private](https://quartz.jzhao.xyz/features/private-pages) in Quartz.
- `date`: A string representing the day the note was published. Normally uses `YYYY-MM-DD` format.
- `lang` : language
<div class="rec-card">
  <img src="./" alt="Book Title" />
  <div class="rec-info">
    <div class="rec-header">
      <h3>Book Title</h3>
      <span class="rec-rating">9/10</span>
    </div>
    <div class="rec-tags">
      <span class="tag">book</span>
      <span class="tag">currently reading</span>
    </div>
    <p>Short description here.</p>
  </div>
</div>