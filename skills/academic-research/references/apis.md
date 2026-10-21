# Academic research APIs

Non-obvious endpoints, auth, and query patterns. Prefer these over ad-hoc web
search for discovery; then open OA PDFs for quotable evidence. Request only the
**fields you need**. 429 handling: see SKILL.md fallback order.

---

## Semantic Scholar

- Docs: https://api.semanticscholar.org/api-docs/
- Product / key request: https://www.semanticscholar.org/product/api
- Tutorial: https://www.semanticscholar.org/product/api/tutorial

### Auth & limits

```bash
# Optional but strongly recommended for /paper/search
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/search' \
  -H "x-api-key: ${SEMANTIC_SCHOLAR_API_KEY}" \
  --data-urlencode 'query=LLM research agents' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'fields=title,year,citationCount,externalIds,openAccessPdf'
```

- Header `x-api-key` is case-sensitive.
- Without a key, `/paper/search` often returns **429** (shared pool).
- Single-paper, citations, references, batch, and recommendations often still
  work without a key — prefer those when search is throttled.
- With a key: typically ~1 req/s.

### Relevance search

```bash
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/search' \
  -H "x-api-key: ${SEMANTIC_SCHOLAR_API_KEY}" \
  --data-urlencode 'query=LLM research agents' \
  --data-urlencode 'limit=10' \
  --data-urlencode 'fields=title,authors,year,abstract,citationCount,externalIds,openAccessPdf,url,venue' \
  --data-urlencode 'year=2020-2026' \
  --data-urlencode 'minCitationCount=10'
```

**Flag filters** (presence-only). Use a **bare** `openAccessPdf` query flag —
not `openAccessPdf=true` and not `openAccessPdf=` (empty value can 500):

```bash
# Bare &openAccessPdf& (no equals). Prefer a key; search is often 429 without one.
curl -sS -H "x-api-key: ${SEMANTIC_SCHOLAR_API_KEY}" \
  'https://api.semanticscholar.org/graph/v1/paper/search?query=machine%20learning&openAccessPdf&limit=5&fields=title,openAccessPdf'
```

Other filters: `fieldsOfStudy`, `publicationTypes`, `venue`. Cap ~**1000**
relevance hits; use `/paper/search/bulk` or Datasets for dumps.

### Paper by ID

Use IDs that resolve. Prefer `ARXIV:`, `DOI:` from a prior search hit, or S2
`paperId`.

```bash
# arXiv (reliable)
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/ARXIV:2301.10140' \
  --data-urlencode 'fields=title,year,citationCount,externalIds,openAccessPdf'

# DOI that is in the S2 graph (example)
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/DOI:10.18653/v1/N18-3011' \
  --data-urlencode 'fields=title,year,citationCount,openAccessPdf'

# OpenAlex-style DataCite DOI for the same arXiv paper
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/DOI:10.48550/arXiv.2301.10140' \
  --data-urlencode 'fields=title,year,openAccessPdf'
```

If a DOI 404s, retry with `ARXIV:` / S2 `paperId` from OpenAlex `ids`, or look
up via Crossref then search S2 by title.

### Citation graph — response nesting

`fields=title,year,citationCount` apply to the **nested** paper object.

```bash
# Who cites this → read data[].citingPaper
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/ARXIV:2301.10140/citations' \
  --data-urlencode 'fields=title,year,citationCount' \
  --data-urlencode 'limit=20'

# What this cites → read data[].citedPaper
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/ARXIV:2301.10140/references' \
  --data-urlencode 'fields=title,year,citationCount' \
  --data-urlencode 'limit=20'
```

Example shape:

```json
{
  "data": [
    {
      "citingPaper": {
        "paperId": "…",
        "title": "…",
        "year": 2024,
        "citationCount": 12
      }
    }
  ]
}
```

### Recommendations

```bash
curl -sG 'https://api.semanticscholar.org/recommendations/v1/papers/forpaper/ARXIV:2301.10140' \
  --data-urlencode 'limit=10' \
  --data-urlencode 'fields=title,year,citationCount'
```

Response key: `recommendedPapers` (not `data`).

### Batch lookup (POST)

```bash
curl -s -X POST \
  'https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,year,externalIds,openAccessPdf' \
  -H 'Content-Type: application/json' \
  -d '{"ids":["ARXIV:2301.10140","DOI:10.18653/v1/N18-3011"]}'
```

Returns a **JSON array** of papers (same order as `ids`; missing IDs may be
`null`).

### PDF field

`openAccessPdf` is an object, e.g. `{"url":"https://…pdf", …}`. Use `.url` for
download. Absence means quote from abstract only or find OA via OpenAlex.

---

## OpenAlex

- Docs: https://developers.openalex.org/
- Free API key: https://openalex.org/settings/api

### Auth

Prefer a key for real literature passes (`api_key=`). Unauthenticated calls may
still work with a **small** daily credit budget — fine for demos, easy to
exhaust. Old `mailto=` polite pool is **ignored**.

```bash
curl -sG 'https://api.openalex.org/works' \
  --data-urlencode 'filter=publication_year:2024,is_oa:true,cited_by_count:>100' \
  --data-urlencode 'per_page=5' \
  --data-urlencode 'select=id,doi,title,publication_year,cited_by_count,open_access,best_oa_location' \
  --data-urlencode "api_key=${OPENALEX_API_KEY}"
```

`is_oa` is accepted and normalized to `open_access.is_oa`. Canonical form also
works: `open_access.is_oa:true`.

### Search, DOI, authors

```bash
# Keyword search (default discovery without S2)
curl -sG 'https://api.openalex.org/works' \
  --data-urlencode 'search=research agents large language models' \
  --data-urlencode 'per_page=10' \
  --data-urlencode 'select=id,doi,title,publication_year,cited_by_count,open_access,best_oa_location' \
  --data-urlencode "api_key=${OPENALEX_API_KEY}"

# Work by DOI
curl -sG 'https://api.openalex.org/works/https://doi.org/10.48550/arXiv.2301.10140' \
  --data-urlencode 'select=id,doi,title,publication_year,cited_by_count,open_access,best_oa_location,primary_location' \
  --data-urlencode "api_key=${OPENALEX_API_KEY}"

# Authors
curl -sG 'https://api.openalex.org/authors' \
  --data-urlencode 'search=Yoshua Bengio' \
  --data-urlencode "api_key=${OPENALEX_API_KEY}"
```

### Full-text URLs (for quotes)

Prefer, in order:

1. `best_oa_location.pdf_url`
2. `open_access.oa_url`
3. `primary_location.pdf_url`

Example values often look like `https://arxiv.org/pdf/2301.10140`.

### Tips

- `select=` shrinks payloads; `title` works (alias of display name in select).
- `per_page=100` + cursor pagination for deeper lists.
- Filter: comma = AND; `|` = OR inside a value (see filtering guide).
- Prefer **Topics** over deprecated Concepts.
- Batch DOI hydrate:
  `filter=doi:https://doi.org/10.1/a|https://doi.org/10.1/b` (up to 100).

---

## Crossref

Lightweight DOI / bibliographic confirmation; send a polite User-Agent with
contact mail.

```bash
curl -sG 'https://api.crossref.org/works' \
  -A 'academic-research-skill (mailto:you@example.com)' \
  --data-urlencode 'query=LLM agents' \
  --data-urlencode 'rows=5'

# Exact DOI
curl -sG 'https://api.crossref.org/works/10.18653/v1/N18-3011' \
  -A 'academic-research-skill (mailto:you@example.com)'
```

Use for: confirm title/year/container-title, get DOI when S2/OpenAlex disagree.
Not a substitute for citation graphs.

---

## BASE (Bielefeld Academic Search Engine)

Strong for **repository / OA / German & European** material (theses, reports).

- API: https://api.base-search.net/
- Interface guide (PDF): https://www.base-search.net/about/download/base_interface.pdf
- **Request a key** (required): https://www.base-search.net/about/en/contact.php  
  Describe use case; key arrives by email (subject like "Your BASE API key").
  Store as `BASE_API_KEY`. Without it, the API returns access denied.

```bash
curl -sG 'https://api.base-search.net/cgi-bin/BaseHttpSearchInterface.fcgi' \
  --data-urlencode 'func=PerformSearch' \
  --data-urlencode 'query=KI Forschung' \
  --data-urlencode 'coll=de' \
  --data-urlencode "apikey=${BASE_API_KEY}"
```

Tips: `coll=de` biases German repositories. Treat hits as discovery — verify
DOI / full text before quoting.

---

## DNB (Deutsche Nationalbibliothek)

German national bibliography and catalog metadata. No API key.

- Overview: https://www.dnb.de/metadatendienste
- Protocols: **SRU** and **OAI-PMH**

SRU: `https://services.dnb.de/sru/dnb` with `version=1.1`,
`operation=searchRetrieve`, `recordSchema=MARC21-xml`, `query=per=Habermas`
(also `tit=`, `swd=`, ISBN). Responses are XML — extract only the fields you
need. OAI-PMH: `https://services.dnb.de/oai/repository` (`verb=Identify`).

Use DNB for **German monographs, dissertations, authority control** — not as
the primary STEM citation graph.
