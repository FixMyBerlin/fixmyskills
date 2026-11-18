# Model policy ladder

Notes for maintaining the ladder in [assets/model-policy.md](assets/model-policy.md). `/model-policy` does not copy this file into `~/.claude`, so no session loads it.

Last checked: 2026-11-18 against [slopalytics, coding score vs. cost, frontier](https://slopalytics.com/?frontier=true&models=claude-opus-5-5,claude-haiku-5-5,gemini-4-argon,grok-4-7,muse-wonder-full,muse-wonder,claude-sonnet-5-5,claude-fable-5-2&hide-reasoning=none,max,xhigh&linear=cost-intelligence&code=true).

## Values

"Code only" is on: Terminal-Bench 4.0 and FrontierCode 2.0, weighted equally. Our subagents write and check code, so the coding score is the one that matters.

| Model and effort   | Cost per task | Coding score | Decision                                             |
| ------------------ | ------------- | ------------ | ---------------------------------------------------- |
| Haiku `low`        | ~$0.02        | ~10          | skip: `high` costs a few cents more, scores far more |
| Haiku `medium`     | ~$0.05        | ~16          | skip, same reason                                    |
| **Haiku `high`**   | $0.22         | 22.6         | step 1                                               |
| **Sonnet `high`**  | $1.33         | 33.0         | step 2                                               |
| **Opus `medium`**  | $2.64         | 40.9         | step 3, session model                                |
| **Fable `low`**    | $3.01         | 44.9         | step 4                                               |
| Opus `high`        | ~$3.50        | ~44          | skip: Fable `low` is cheaper and stronger            |
| **Fable `medium`** | $3.71         | 46.8         | step 5                                               |
| Fable `high`       | ~$11          | ~53          | skip: three times Fable `medium` for a few points    |

Sonnet `low` and `medium` and Opus `low` lie below the line. `xhigh` and `max` are hidden in the chart and never on the ladder.

Haiku `high` uses about 117k tokens per task in this benchmark, so its price already includes Haiku's higher rate above 100K prompt tokens. The rule sets no token budget.

## Refreshing the ladder

1. Open the link above; add new Claude models to `models=`.
2. Read cost and score of each Claude point on the frontier from the tooltips.
3. Drop points that cost almost the same as a much stronger neighbour.
4. Update the table here and the ladder (with its month) in the rule; set "Last checked" to today.
5. Commit. Everyone then runs `bunx skills update -g -y` and `/model-policy`.
