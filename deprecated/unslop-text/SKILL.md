---
name: unslop-text
description: >-
  Rewrite plans, markdown, comments, JSDoc, and user-facing strings so a
  human can follow the decision chain without losing facts. Use when the
  user asks to rewrite, make text readable, fix Grok wording, unslop prose,
  or when unslop-code phase 10 runs.
user-invocable: true
disable-model-invocation: true
---

# Unslop text

Rewrite prose so a technical reader can follow it. Preserve meaning and verdicts. Do not restructure code. Do not add soul.

For orchestrated cleanup of a git branch (TypeScript, Zod, shims, location, then this pass on comments/docs in the diff), use [unslop-code](../unslop-code/SKILL.md).

## Length is not the metric

Cut redundancy. Spend the saved words on the thing the reader does not know yet. Never pad. Never answer "what is this" with a label. If the reader would have to search the web to follow a sentence, explain it in place.

## Never trade a fact for a smoother sentence

Grok's prose is often hard to read and still precise. Keep every version number, file path, script name, verdict, and threshold. If a smooth sentence loses "only `dev:vite` passes `--bun`", the smooth sentence is wrong.

Keep the anchors. Cite the file (`[util.ts](app/src/…/util.ts)`), a pinned permalink, or a line-range code block so the reader can check the claim.

## Shape

Open with where we are, or what the thing is. Then one section per option. Put a visible verdict on each option (`do now` / `try` / `later` / `don't`, or a one-line recommendation) plus the reason.

For a flow, a short mermaid diagram beats a paragraph.

## Verified vs guessed

Mark facts, assessments, and open questions differently. Plans: "verified in the repo" vs "assumption" vs "needs a decision." Research: keep FAKT / EINSCHÄTZUNG / UNSICHER (or the equivalent in the document's language).

## Sentences

One idea per sentence. Cause before effect. Name the actor.

Prefer the mechanism over the feeling. Not "this improves DX." Instead: "the image has no Node, so `bun run build` already runs Vite under Bun."

## Structure

Tables only when the rows share the same columns. When a table is carrying "what it is / why / trade-off," split it into subchapters.

Drop facts that do not serve this decision.

## One name per concept

Define the term once, then repeat it. No synonym cycling. When a name would collide with an existing concept, say which words are banned and why.

## Tells to cut

| Tell                                                                   | Fix                                   |
| ---------------------------------------------------------------------- | ------------------------------------- |
| Comment restates the next line                                         | Delete the comment                    |
| Puffery, "crucial" / "robust" / "comprehensive"                        | State the fact or delete              |
| Superficial -ing clauses ("ensuring...", "highlighting...")            | Delete or name the mechanism          |
| Vague "experts" / "best practice" with no source                       | Name the FMC skill or delete          |
| AI vocabulary (delve, pivotal, landscape, tapestry, leverage, utilize) | Plain word                            |
| "Not just X, but Y"                                                    | One sentence, the point               |
| Forced groups of three                                                 | Natural count                         |
| Em dashes; hyphen-as-dash                                              | Period or comma                       |
| Colon as a mid-sentence crutch                                         | Rewrite so the clause stands          |
| Bold on every proper noun; `**Label:**` lines that repeat the sentence | Prose, or a bold name then new detail |
| Title Case Headings                                                    | Sentence case                         |
| Decorative emoji                                                       | Remove                                |
| Curly quotes                                                           | Straight `"` / `'`                    |
| Chatbot: "I hope this helps", "Simply", "Feel free to"                 | Delete                                |
| Filler: "In order to", "It is important to note that"                  | "To" / delete                         |
| Hedging stacks                                                         | One "may" or a fact                   |
| Abstract metaphor nouns (surface, scaffolding, north star)             | Concrete word                         |
| Sentence that could be pasted into another repo unchanged              | Cut or make it about this app         |

Do not "add soul." No first-person color, no "let some mess in," no opinions-for-texture.

## In code

Delete comments that restate the next line. Delete JSDoc that only repeats the name. Keep a comment that states a constraint the code cannot show (a MapLibre/React quirk with a link, a legal note, a type the compiler cannot express).

## Voice

Dry and specific. Match the user's voice when they asked for it (GitHub issue, mail to a maintainer). Keep the document's language. Do not translate German into English while rewriting.

## Don't silently change the substance

A wording pass may reveal a wrong or overstated claim. Fix it, but say so separately instead of burying it in the rewrite.

## Chat reply

The summary in chat follows this skill too. If the chat summary is clearer than the document, the document is what needs fixing.

## Related

[unslop-code](../unslop-code/SKILL.md) · [finish-work](../finish-work/SKILL.md)
