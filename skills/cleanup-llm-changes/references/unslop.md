# Unslop (writing in the tree)

Phase 5 of `cleanup-llm-changes`. Adapted from [pstack unslop](https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md) (MIT). If that skill is installed, read it for the full pattern list. This file is the FMC subset for **code comments, JSDoc, markdown, and user-facing strings**.

Unslop is writing. Do not use it as a license to restructure code (that is phases 1-4).

**Do not "add soul."** FMC voice is dry and specific ([finish-work](../../finish-work/SKILL.md) commit bodies, skill `tech-stack`). No first-person color, no "let some mess in," no opinions-for-texture.

## Scope

Diff vs `<base>` plus leftover LLM comments in touched files. Do not rewrite the whole docs tree.

**Rewrite or delete:** comments that restate the next line; JSDoc that only repeats the name; AI vocabulary; chatbot closers; filler; hedging stacks; generic README conclusions; decorative emoji; title-case headings in new markdown; em dashes; curly quotes.

**Keep:** a constraint that is not yet in a type, test, or lint; legal/attribution text; intentional German UI copy; a comment that names a MapLibre/React quirk with a link.

## Patterns (code and docs)

From unslop, the ones that show up in LLM diffs:

| Tell                                                                       | Fix                                   |
| -------------------------------------------------------------------------- | ------------------------------------- |
| Comment restates the code                                                  | Delete the comment                    |
| Puffery, promotional words, "crucial" / "robust" / "comprehensive"         | State the fact or delete              |
| Superficial -ing clauses ("ensuring...", "highlighting...")                | Delete or name the mechanism          |
| Vague "experts" / "best practice" with no source                           | Name the FMC skill or delete          |
| AI vocabulary (delve, pivotal, landscape, tapestry, leverage, utilize)     | Plain word                            |
| "Not just X, but Y"                                                        | One sentence, the point               |
| Forced groups of three                                                     | Natural count                         |
| Em dashes; hyphen-as-dash; parenthetical asides that are a second sentence | Period or comma                       |
| Colon as a mid-sentence crutch                                             | Rewrite so the clause stands          |
| Bold on every proper noun; `**Label:**` lines that repeat the sentence     | Prose, or a bold name then new detail |
| Title Case Headings                                                        | Sentence case                         |
| Decorative emoji                                                           | Remove                                |
| Curly quotes                                                               | Straight `"` / `'`                    |
| Chatbot: "I hope this helps", "Simply", "Feel free to"                     | Delete                                |
| Filler: "In order to", "It is important to note that"                      | "To" / delete                         |
| Hedging stacks                                                             | One "may" or a fact                   |
| Abstract metaphor nouns (surface, scaffolding, north star)                 | Concrete word                         |
| Sentence that could be pasted into another repo unchanged                  | Cut or make it about this app         |

## Orchestrator chat

The end summary follows the same rules: no puffery, no chatbot closer, no "great question."
