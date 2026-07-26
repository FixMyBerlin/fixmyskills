# Academic research APIs

Non-obvious endpoints, auth, and query patterns. Prefer these over ad-hoc web
search for discovery; then open OA PDFs for quotable evidence.

## Quick picker

| Need                                     | Prefer                         |
| ---------------------------------------- | ------------------------------ |
| Broad STEM/CS + citation graph           | Semantic Scholar               |
| Open graph of works / authors / orgs     | OpenAlex                       |
| German / EU repositories, theses, OA     | BASE                           |
| German national bibliography / authority | DNB (SRU / OAI-PMH)            |
| "Who cites this?" / recommendations      | Semantic Scholar citations API |

Always request only the **fields you need** (faster, fewer timeouts).

---

## Semantic Scholar

- Docs: https://api.semanticscholar.org/api-docs/
- Product / key request: https://www.semanticscholar.org/product/api
- Tutorial: https://www.semanticscholar.org/product/api/tutorial

### Auth & limits

- Optional API key in header: `x-api-key: YOUR_KEY` (case-sensitive).
- Without a key you share a global pool and get throttled under load.
- With a key: dedicated limit (typically ~1 req/s introductory). Sleep / backoff on `429`.

### Relevance search (default discovery)

```bash
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/search' \
  --data-urlencode 'query=LLM research agents' \
  --data-urlencode 'limit=10' \
  --data-urlencode 'fields=title,authors,year,abstract,citationCount,externalIds,openAccessPdf,url,venue'
```

Useful filters (query params): `year`, `minCitationCount`, `openAccessPdf`,
`fieldsOfStudy`, `publicationTypes`, `venue`.

Caps: relevance search returns at most **~1000** hits. For large dumps use
`/paper/search/bulk` or the Datasets API.

### Paper by ID (DOI, arXiv, S2, …)

```bash
# DOI
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/DOI:10.1145/3394486.3406701' \
  --data-urlencode 'fields=title,abstract,citationCount,references,citations,openAccessPdf'

# arXiv
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/ARXIV:2301.10140' \
  --data-urlencode 'fields=title,year,citationCount,openAccessPdf'
```

### Citation graph (pioneer vs follow-up)

```bash
# Highly cited works that cite this paper → extensions / critiques
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/DOI:10.48550/arXiv.2301.10140/citations' \
  --data-urlencode 'fields=title,year,citationCount' \
  --data-urlencode 'limit=20'

# What this paper cites → foundations
curl -sG 'https://api.semanticscholar.org/graph/v1/paper/DOI:10.48550/arXiv.2301.10140/references' \
  --data-urlencode 'fields=title,year,citationCount' \
  --data-urlencode 'limit=20'
```

### Recommendations

```bash
curl -s 'https://api.semanticscholar.org/recommendations/v1/papers/forpaper/DOI:10.48550/arXiv.2301.10140?limit=10&fields=title,year,citationCount'
```

### Non-obvious tips

- Use `openAccessPdf` in `fields` early — only quote from reachable full text when precision matters.
- Nested fields use dots, e.g. `authors.name`, `embedding.specter_v2`.
- Prefer `externalIds` (DOI, ArXiv, …) in the source list for stable links.
- Batch lookups: `/graph/v1/paper/batch` with JSON body of IDs (see docs) to cut round-trips.

Python sketch:

```python
import requests

r = requests.get(
    "https://api.semanticscholar.org/graph/v1/paper/search",
    params={
        "query": "LLM research agents",
        "limit": 5,
        "fields": "title,authors,year,abstract,citationCount,externalIds,openAccessPdf",
    },
    headers={"x-api-key": "YOUR_KEY"},  # optional but recommended
    timeout=60,
)
r.raise_for_status()
print(r.json())
```

---

## OpenAlex

- Docs: https://developers.openalex.org/
- Get API key: https://openalex.org/settings/api

### Auth (required for real work)

As of 2026, include a free API key. The old `mailto=` polite pool is **deprecated
and ignored**.

```bash
curl -sG 'https://api.openalex.org/works' \
  --data-urlencode 'filter=publication_year:2024,is_oa:true,cited_by_count:>100' \
  --data-urlencode 'per_page=5' \
  --data-urlencode 'select=id,doi,title,publication_year,cited_by_count,open_access' \
  --data-urlencode 'api_key=YOUR_KEY'
```

Without a key you only get a tiny daily credit budget — fine for a smoke test,
not for a literature pass.

### Useful patterns

```bash
# Keyword search
curl -sG 'https://api.openalex.org/works' \
  --data-urlencode 'search=research agents large language models' \
  --data-urlencode 'per_page=10' \
  --data-urlencode 'api_key=YOUR_KEY'

# Work by DOI
curl -sG 'https://api.openalex.org/works/https://doi.org/10.48550/arXiv.2301.10140' \
  --data-urlencode 'api_key=YOUR_KEY'

# Authors / institutions graph
curl -sG 'https://api.openalex.org/authors' \
  --data-urlencode 'search=Yoshua Bengio' \
  --data-urlencode 'api_key=YOUR_KEY'
```

### Non-obvious tips

- Use `select=` to shrink payloads.
- `per_page=100` + cursor pagination for deeper lists (see docs).
- Filter with comma-AND; use `|` for OR inside a filter value (docs: filtering guide).
- Prefer Topics over legacy Concepts (Concepts are deprecated).
- Credits differ by operation (list/filter vs singleton). Batch OR filters for DOIs when hydrating many works.

---

## BASE (Bielefeld Academic Search Engine)

Strong for **repository / OA / German & European** material (theses, reports, institutional repos).

- API: https://api.base-search.net/
- Interface guide (PDF): https://www.base-search.net/about/download/base_interface.pdf

Requires an API key from BASE.

```bash
# Example shape — replace YOUR_API_KEY; see PDF for full param set
curl -sG 'https://api.base-search.net/cgi-bin/BaseHttpSearchInterface.fcgi' \
  --data-urlencode 'func=PerformSearch' \
  --data-urlencode 'query=KI Forschung' \
  --data-urlencode 'coll=de' \
  --data-urlencode 'apikey=YOUR_API_KEY'
```

Tips: use `coll=de` (or other collections) to bias German repositories; combine
with English queries when the topic is international. Treat BASE hits as
discovery — still verify DOI / full text before quoting.

---

## DNB (Deutsche Nationalbibliothek)

German national bibliography and catalog metadata.

- Metadata services overview: https://www.dnb.de/metadatendienste
- Protocols: **SRU** and **OAI-PMH**

### SRU example

```bash
curl -sG 'https://services.dnb.de/sru/dnb' \
  --data-urlencode 'version=1.1' \
  --data-urlencode 'operation=searchRetrieve' \
  --data-urlencode 'query=per=Habermas' \
  --data-urlencode 'recordSchema=MARC21-xml'
```

Other useful indexes (see DNB SRU docs): title (`tit=`), topic (`swd=` / subject),
ISBN, etc. Responses are XML (MARC21 or other schemas) — parse fields; do not
hallucinate MARC subfields.

Use DNB when the question needs **German-language monographs, dissertations, or
authority control**, not as the primary STEM citation graph.

---

## Practical search sequence

For a typical topic (global + optional DE coverage):

1. **OpenAlex or Semantic Scholar** — 10–20 candidates with year + citations + OA flag.
2. **Triage** — keep 5–10; fetch details + references/citations for top 3.
3. **BASE / DNB** — only if DE repositories, theses, or national bib matter.
4. **Full text** — follow `openAccessPdf` / OA URLs; extract quotes into tables.
5. **Conflict** — re-fetch primary via DOI; adjudicate.

Record queries and filters in the research **Search log**.
