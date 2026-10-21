# Research-agent frameworks (optional)

Use when building multi-agent research systems or when default PDF text
extraction (SKILL.md step 5) is garbled. Not required for a normal literature
pass.

| Project                           | Link                                                  | Useful idea                                             |
| --------------------------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| STORM (Stanford)                  | https://github.com/stanford-oval/storm                | Multi-perspective outline + curated article drafting    |
| Scientific Agent Skills (K-Dense) | https://github.com/k-dense-ai/scientific-agent-skills | Evidence-bound synthesis, methodology critique patterns |
| Docling (IBM)                     | https://github.com/docling-project/docling            | Layout-aware PDF → structured text/tables/formulas      |

## Docling for garbled PDFs

```bash
# Only if docling is already installed or the user asked to install it
docling /tmp/paper.pdf --output /tmp/paper-docling.md
```

Do **not** install heavy PDF stacks unless the user wants that or the default
extractor clearly fails.
