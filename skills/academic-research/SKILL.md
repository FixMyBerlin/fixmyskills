---
name: academic-research
description: >-
  Evidence-bound academic research focused on facts, quotes, and sources for a
  specific question or topic. Uses Semantic Scholar, OpenAlex, Crossref, BASE,
  DNB, and citation-graph workflows. Use when the user asks to research a
  scholarly question, do a literature review, find papers, verify claims with
  citations, synthesize academic sources, or gather quotable evidence.
disable-model-invocation: true
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

| Cap                       | Default               |
| ------------------------- | --------------------- |
| Discovery queries         | 4–6 total across APIs |
| Candidates after triage   | 8–12                  |
| Deep-read / quote sources | 3–6                   |
| Citation-graph papers     | top 2–3               |

## Agent tools

Read [references/apis.md](references/apis.md) before the first API call.

1. **Discovery / metadata:** `curl` against the APIs. Prefer curl over guessing.
2. **HTML landing pages / abstracts:** `WebFetch` when the API already gave a
   stable URL.
3. **PDFs:** download with curl, then extract text (step 5). Do not claim page
   quotes from metadata alone.
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
   available. On **429** (any API): sleep ~2s once; if still 429, switch API
   (S2: use OpenAlex for search; keep S2 for single-paper / citations only if
   those still succeed).
3. **Crossref** — DOI resolution / bibliographic confirmation.
4. **BASE** — only with `BASE_API_KEY`; German/EU repositories & theses.
5. **DNB** — German national bibliography / authority (no key).

Do not block the whole research on one failing API.

## Conceptual workflow

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

Use scholarly APIs first (not general web search alone).

Typical pass: OpenAlex search → hydrate top hits → optional S2 citation graph
(step 6) → Crossref if DOI metadata is thin or sources disagree → BASE/DNB only
if DE catalogs matter.

### 4. Triage by relevance + impact

| Signal                | Use for                                |
| --------------------- | -------------------------------------- |
| Citation count        | Impact / landmark vs niche             |
| Year                  | Currency; pair with citations          |
| Venue / type          | Peer-reviewed vs preprint vs thesis    |
| Open access / PDF URL | Ability to quote from full text        |
| Citation graph        | Pioneer paper vs incremental follow-up |

### 5. Extract evidence (quotes)

1. Capture abstract-level claims from API fields first; mark location `abstract`.
2. Resolve a PDF URL: S2 `openAccessPdf.url`, or OpenAlex
   `best_oa_location.pdf_url` / `open_access.oa_url`.
3. If no PDF: quote only from abstract/API text, or mark claim as
   metadata-only (weaker).
4. If PDF available:

```bash
curl -fsSL -o /tmp/paper.pdf 'PDF_URL'
pdftotext -layout /tmp/paper.pdf /tmp/paper.txt   # else pypdf/pdfplumber
```

If extraction fails or is garbled, quote from the abstract and state that full
text was unreachable. For multi-column layouts see
[references/frameworks.md](references/frameworks.md) (Docling). Do not invent
page numbers — use `abstract` or § headings if pages are unknown.

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

For the top papers (Semantic Scholar, see budgets):

- `/references` → foundations (parse `citedPaper`)
- `/citations` → extensions / critiques (parse `citingPaper`)

Distinguish **pioneer** vs **follow-up** before treating a paper as definitive.

### 7. Adjudication

When sources conflict (rule 3 first): prefer fuller methods reporting and larger
/ more appropriate samples. If still unclear, report both sides with citations;
do not pick a winner. For empirical work, check Methods and flag weak evidence
explicitly.

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
