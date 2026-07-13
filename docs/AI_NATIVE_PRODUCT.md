# AI-Native Product Operating System

This repo is structured so humans **and** AI agents can ship safely.

## Document hierarchy

```
AGENTS.md          → How agents work in this repo
CLAUDE.md          → Pointer for Claude-compatible tools
DESIGN.md          → Visual + interaction system (UI law)
docs/PRD.md        → What to build and why
docs/specs/UX-SPEC.md → Flows and IA
docs/HONEST_MARKET_VERDICT.md → What customers pay for
docs/PRODUCT_CRITIQUE_AND_STRATEGY.md → Strategy depth
src/lib/plans.ts   → Feature entitlement law (code)
```

## Agent workflow (mandatory)

1. Read AGENTS.md + relevant PRD section  
2. For UI: read DESIGN.md section for the surface  
3. Implement smallest change that passes Definition of Done  
4. Run `npm run build`  
5. Update docs if behavior/user-facing copy changed  

## Product surfaces checklist

| Surface | Design ref | PRD IDs |
|---------|------------|---------|
| Home | DESIGN §9 marketing | Brand |
| Donate | DESIGN §9 transaction | P0-1 |
| Book | DESIGN §9 transaction | P0-3 |
| Money desk | DESIGN §9 trustee | P0-2 |
| Weekly report | DESIGN §9 trustee | P0-4 |
| Demo | UX-SPEC F5 | P0-10 |

## Definition of a “big tech” ready slice

- Spec exists before code (or is updated same PR)  
- Design tokens only  
- Mobile + desktop verified  
- Feature flagged if paid  
- No silent tenant data leakage  
- Observable success metrics in PRD  

---

This is how MandirOS stays coherent as many agents contribute.
