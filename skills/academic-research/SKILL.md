---
name: academic-research
description: >-
  Evidence-bound academic research focused on facts, quotes, and sources for a
  specific question or topic. Uses Semantic Scholar, OpenAlex, Crossref, BASE,
  DNB, and citation-graph workflows. Use when the user asks to research a
  scholarly question, do a literature review, find papers, verify claims with
  citations, synthesize academic sources, or gather quotable evidence.
---

# Academic research

Research a **specific question or topic** at university level. Output must be
**facts, quotes, and sources** — not unsourced summaries or invented citations.

## Core rules

1. **Every claim needs a source.** Prefer primary papers over secondary blogs.
2. **Bind claims to evidence.** Quote or closely paraphrase a specific passage;
   note page/section when available. No orphan assertions.
3. **Prefer originals on conflict.** If two sources disagree, re-check the
   primary document (or PDF) before resolving; say when unresolved.
4. **Separate fact / interpretation / gap.** Label clearly what the source
   states vs. what you infer vs. what is missing.
5. **Never invent citations.** If you cannot retrieve or open a source, mark it
   unverified and do not cite it as evidence.
6. **Never treat training memory as retrieved evidence.** Only cite what you
   fetched in this session (API, catalog, or opened full text).

## Budgets (default)

Stop expanding search unless the user asks for more:

| Cap                       | Default                                   |
| ------------------------- | ----------------------------------------- |
| Discovery queries         | 4–6 total across APIs                     |
| Candidates after triage   | 8–12                                      |
| Deep-read / quote sources | 3–6                                       |
| Citation-graph papers     | top 2–3                                   |
| API retries on 429        | backoff once, then switch API (see below) |

## Agent tools

1. **Discovery / metadata:** `Shell` + `curl` (or equivalent HTTP) against the
   APIs in [references/apis.md](references/apis.md). Prefer curl over guessing.
2. **HTML landing pages / abstracts:** `WebFetch` when the API already gave a
   stable URL.
3. **PDFs:** download with curl to a temp file, then extract text (below). Do
   not claim page quotes from metadata alone.
4. **Keys:** read from env if set — never invent keys; never commit them.

| Service          | Env var                    | Header / param     |
| ---------------- | -------------------------- | ------------------ |
| Semantic Scholar | `SEMANTIC_SCHOLAR_API_KEY` | header `x-api-key` |
| OpenAlex         | `OPENALEX_API_KEY`         | query `api_key=`   |
| BASE             | `BASE_API_KEY`             | query `apikey=`    |

If a required key is missing and the unauthenticated path fails, say so and
continue with the next API in the fallback order.

## Fallback order

1. **OpenAlex** — default discovery when no S2 key (search often 429s on the
   shared pool).
2. **Semantic Scholar** — citation graph + recommendations; use key if
   available. On **429**: sleep ~2s once; if still 429, switch to OpenAlex for
   search; keep S2 for single-paper / citations only if those still succeed.
3. **Crossref** — DOI resolution / bibliographic confirmation.
4. **BASE** — only with `BASE_API_KEY`; German/EU repositories & theses.
5. **DNB** — German national bibliography / authority (no key).

Do not block the whole research on one failing API.

## Conceptual workflow

Copy and track:

```
Research progress:
- [ ] 1. Frame the question
- [ ] 2. Multi-perspective sub-questions
- [ ] 3. Discover candidate sources (APIs / catalogs)
- [ ] 4. Triage by relevance + impact
- [ ] 5. Read / extract evidence (quotes, numbers, methods)
- [ ] 6. Citation-graph pass (pioneers vs follow-ups)
- [ ] 7. Adjudicate conflicts
- [ ] 8. Synthesize answer with sources
```

### 1. Frame the question

- Restate the user's question as a clear research question (empirical questions
  should be answerable with evidence; conceptual/historical ones with scoped
  claims).
- Define scope: field, geography/language (e.g. DE vs EN), time window, OA-only.
- List inclusion/exclusion criteria before searching.

### 2. Multi-perspective sub-questions

Generate 3–6 angles before deep reading, e.g.:

- definition / state of the art
- methods & measurement
- empirical findings
- critiques / limitations
- policy or practice implications (if relevant)

Search and answer **per sub-question**, then merge.

### 3. Discover candidate sources

Use scholarly APIs first (not general web search alone). Details:
[references/apis.md](references/apis.md).

Typical pass: OpenAlex search → hydrate top hits → optional S2 citation graph
on the best 2–3 → Crossref if DOI metadata is thin → BASE/DNB only if DE
catalogs matter.

### 4. Triage by relevance + impact

| Signal                | Use for                                |
| --------------------- | -------------------------------------- |
| Citation count        | Impact / landmark vs niche             |
| Year                  | Currency; pair with citations          |
| Venue / type          | Peer-reviewed vs preprint vs thesis    |
| Open access / PDF URL | Ability to quote from full text        |
| Citation graph        | Pioneer paper vs incremental follow-up |

Keep 8–12 candidates; deep-read 3–6.

### 5. Extract evidence (quotes)

1. Capture abstract-level claims from API fields first; mark location `abstract`.
2. Resolve a PDF URL: S2 `openAccessPdf.url`, or OpenAlex
   `best_oa_location.pdf_url` / `open_access.oa_url`.
3. If no PDF: quote only from abstract/API text, or mark claim as
   metadata-only (weaker).
4. If PDF available:

```bash
curl -fsSL -o /tmp/paper.pdf 'PDF_URL'
# Prefer pdftotext when installed; else python pypdf/pdfplumber if available
pdftotext -layout /tmp/paper.pdf - | head -n 200
```

For complex multi-column layouts, see [references/frameworks.md](references/frameworks.md)
(Docling). Do not invent page numbers — use `abstract` or § headings if pages
are unknown.

Per kept source, fill:

| Field         | Content                                          |
| ------------- | ------------------------------------------------ |
| ID            | DOI / S2 paperId / OpenAlex Work ID              |
| Bibliographic | Authors, year, title, venue                      |
| Claim         | One atomic claim in your words                   |
| Quote / data  | Verbatim quote or exact statistic                |
| Location      | Page, section, or `abstract`                     |
| Limits        | Sample size, bias, scope limits noted by authors |

**Markdown-first:** put n, p, CI, effect sizes in tables.

### 6. Citation-graph pass

For the top 2–3 papers (Semantic Scholar):

- `/references` → foundations (parse `citedPaper`)
- `/citations` → extensions / critiques (parse `citingPaper`)

Distinguish **pioneer** vs **follow-up** before treating a paper as definitive.

### 7. Adjudication

When sources conflict:

1. Prefer the primary study over reviews summarizing it.
2. Prefer fuller methods reporting and larger / more appropriate samples.
3. Re-open the original PDF when metadata or secondary summaries disagree.
4. If still unclear: report both sides with citations; do not pick a winner.

### 8. Methodology critic (when empirical)

Check Methods for: design, sample size, significance / uncertainty, confounds,
generalizability. Flag weak evidence explicitly.

## Output format

```markdown
# [Research question]

## Short answer

2–5 sentences. Every factual sentence either cites a source or is clearly
labeled as synthesis.

## Findings

### [Sub-question / theme]

- **Claim:** …
  - **Evidence:** "…" (Author et al., Year, p./§…)
  - **Source:** DOI / URL / catalog ID
  - **Caveat:** … (optional)

## Source list

| #   | Citation | Year | Type | DOI / ID | OA PDF | Why included |
| --- | -------- | ---- | ---- | -------- | ------ | ------------ |

## Gaps and open questions

What the literature does not settle.

## Search log (brief)

APIs, queries, filters, HTTP failures (e.g. 429), date of search — enough to reproduce.
```

## Tooling priorities

1. **Metadata + discovery:** OpenAlex, Semantic Scholar, Crossref; BASE, DNB (DE).
2. **Full text:** OA PDF URLs from APIs → extract text → quote.
3. **Optional deeper tooling:** [references/frameworks.md](references/frameworks.md).

API details → [references/apis.md](references/apis.md)
