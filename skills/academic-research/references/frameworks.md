# Research-agent frameworks (optional)

Use when building multi-agent research systems or when default PDF text
extraction fails. Not required for a normal literature pass with
[apis.md](apis.md).

| Project                           | Link                                                  | Useful idea                                             |
| --------------------------------- | ----------------------------------------------------- | ------------------------------------------------------- |
| STORM (Stanford)                  | https://github.com/stanford-oval/storm                | Multi-perspective outline + curated article drafting    |
| Scientific Agent Skills (K-Dense) | https://github.com/k-dense-ai/scientific-agent-skills | Evidence-bound synthesis, methodology critique patterns |
| Docling (IBM)                     | https://github.com/docling-project/docling            | Layout-aware PDF → structured text/tables/formulas      |

## Patterns to reuse

- **Evidence-bound synthesis:** every sentence maps to a quote or data cell.
- **Multi-perspective questioning:** expand one user question into angles before searching.
- **Methodology critic:** treat Methods as first-class evidence, not only the Abstract.
- **Adjudication agent:** on conflict, re-read primaries instead of averaging summaries.

## PDF extraction in Cursor (practical)

Default (fast path) — try first:

```bash
curl -fsSL -o /tmp/paper.pdf 'PDF_URL'
pdftotext -layout /tmp/paper.pdf /tmp/paper.txt
# or: python3 -c "import pathlib;…" with pypdf/pdfplumber if installed
```

If text is garbled (multi-column, heavy figures) and Docling is available in the
environment:

```bash
# Only if docling is already installed or the user asked to install it
docling /tmp/paper.pdf --output /tmp/paper-docling.md
```

Do **not** install heavy PDF stacks unless the user wants that or the default
extractor clearly fails. If extraction fails, quote from the abstract and state
that full text was unreachable.
