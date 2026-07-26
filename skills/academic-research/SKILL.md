---
name: academic-research
description: >-
  Evidence-bound academic research focused on facts, quotes, and sources for a
  specific question or topic. Uses Semantic Scholar, OpenAlex, BASE, DNB, and
  citation-graph workflows. Use when the user asks to research a scholarly
  question, do a literature review, find papers, verify claims with citations,
  synthesize academic sources, or gather quotable evidence.
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

## Conceptual workflow

Copy and track:

```
Research progress:
- [ ] 1. Frame the question
- [ ] 2. Multi-perspective sub-questions
- [ ] 3. Discover candidate sources (APIs / catalogs)
- [ ] 4. Triage by relevance + impact (citations, venue, recency)
- [ ] 5. Read / extract evidence (quotes, numbers, methods)
- [ ] 6. Citation-graph pass (pioneers vs follow-ups)
- [ ] 7. Adjudicate conflicts
- [ ] 8. Synthesize answer with sources
```

### 1. Frame the question

- Restate the user's question as a falsifiable research question.
- Define scope: field, geography/language (e.g. DE vs EN), time window, OA-only.
- List inclusion/exclusion criteria before searching.

### 2. Multi-perspective sub-questions

Generate 3–6 angles before deep reading (inspired by STORM-style coverage), e.g.:

- definition / state of the art
- methods & measurement
- empirical findings
- critiques / limitations
- policy or practice implications (if relevant)

Search and answer **per sub-question**, then merge.

### 3–4. Discover and triage

Use scholarly APIs first (not general web search alone). See
[references/apis.md](references/apis.md) for endpoints and non-obvious tips.

Triage signals (use together; none alone is enough):

| Signal            | Use for                                |
| ----------------- | -------------------------------------- |
| Citation count    | Impact / landmark vs niche             |
| Year              | Currency; pair with citations          |
| Venue / type      | Peer-reviewed vs preprint vs thesis    |
| Open access / PDF | Ability to quote from full text        |
| Citation graph    | Pioneer paper vs incremental follow-up |

### 5. Extract evidence

From abstracts first; open full text (OA PDF) when quoting methods, numbers, or
nuanced claims.

For each kept source, capture in a markdown table:

| Field         | Content                                          |
| ------------- | ------------------------------------------------ |
| ID            | DOI / S2 paperId / OpenAlex Work ID              |
| Bibliographic | Authors, year, title, venue                      |
| Claim         | One atomic claim in your words                   |
| Quote / data  | Verbatim quote or exact statistic                |
| Location      | Page, section, or "abstract"                     |
| Limits        | Sample size, bias, scope limits noted by authors |

**Markdown-first:** put quantitative values (n, p, CI, effect sizes) in tables —
accuracy is higher than free prose.

### 6. Citation-graph pass

For the 2–5 most important papers:

- Who do they cite? → likely foundations / pioneers
- Who cites them highly? → extensions, replications, critiques

Distinguish **pioneer** vs **follow-up** before treating a paper as definitive.

### 7. Adjudication

When sources conflict:

1. Prefer the primary study over reviews summarizing it.
2. Prefer fuller methods reporting and larger / more appropriate samples.
3. Re-open the original PDF when metadata or secondary summaries disagree.
4. If still unclear: report both sides with citations; do not pick a winner.

### 8. Methodology critic (when empirical)

Briefly check Methods for: design, sample size, significance / uncertainty,
confounds, generalizability. Flag weak evidence explicitly.

## Output format

Deliver in this structure (adapt depth to the question):

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

APIs, queries, filters, date of search — enough to reproduce.
```

## Tooling priorities

1. **Metadata + discovery:** Semantic Scholar, OpenAlex (global); BASE, DNB (DE / catalogs).
2. **Full text:** OA PDF links from APIs; layout-aware parsing when PDFs are complex.
3. **Do not** treat training-memory papers as retrieved evidence.

API details, example calls, auth, and rate-limit tips:
→ [references/apis.md](references/apis.md)

Optional frameworks (deeper multi-agent research systems):
→ [references/frameworks.md](references/frameworks.md)
