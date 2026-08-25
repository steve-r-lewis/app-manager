## 6. Orchestrators — Current State, and the JSX/TSX Question Properly Scoped

### 6.1 Where Things Actually Stand

Only one orchestrator exists — `VueStrategy`, still sitting in `app/orchestrators/vue/` pending its own previously-noted, not-yet-executed move to `app/strategies/vue/`. I want to be direct about one thing before scoping JSX/TSX: I found no existing code implementing or even directly referencing JSX/TSX support anywhere in the repository — the only hit anywhere is a single line in `JavascriptStrategy`'s own docstring, mentioning `.jsx`/`.mjs` as a *hypothetical* future extension point, not a plan. So this is genuinely new scope, not something partially built that I'd missed — worth saying plainly so we're scoping from the real starting point.

One relevant thing **does** already exist, though, and it's a good sign: `app/types/scanners/sfcTypes.ts` defines a `RegionOfInterest` interface with a generic, open `type: string` field (not a closed Vue-only union) — meaning the type system already anticipates marking arbitrary named spans within a file as "of interest" for some purpose beyond Vue's specific script/template/style blocks. That's a reusable hook, not a coincidence — it's worth building JSX support to fit that existing shape when the time comes.

### 6.2 Why This Isn't Just "Build a `ReactOrchestrator` Like `VueOrchestrator`"

I want to flag a genuine architectural difference before this gets informally assumed to be a smaller task than it is. `VueOrchestrator`'s pattern works because a `.vue` file has **clean, non-overlapping, textually-delimited regions** — `<script>`, `<template>`, `<style>` — found with a simple regex match, extracted as a contiguous string, handed to a specialized strategy, and spliced back. That extraction step is the whole trick, and it works because Vue's SFC format was designed to make it work.

JSX/TSX has no equivalent clean region. JSX is **inline expression syntax embedded directly in otherwise normal TypeScript/JavaScript grammar** — it can appear nested arbitrarily deep inside a function body, inside a conditional, inside an array map callback, anywhere an expression is valid. There's no `<script>`-equivalent tag to regex-match and extract as one block; a `.tsx` file isn't "TypeScript plus a separate JSX region," it's TypeScript *with JSX woven through it*. So the delegate-to-a-sub-strategy-via-text-extraction pattern that makes `VueStrategy` clean doesn't have an equivalent extraction point to hook into here.

The harder, more honest version of what real JSX/TSX support requires is closer to what `TypescriptScanner` already does than what `VueStrategy` does: a genuine tokenizer that understands JSX as first-class grammar, not a hand-off between two separate tools. And it's a harder tokenization problem than anything solved so far — `TypescriptScanner` already correctly disambiguates `/` as division vs. regex-literal-start by checking the preceding token (§10.3 of the architecture audit covers this). JSX needs the same category of disambiguation for `<`, except three-way instead of two-way: `a < b` (comparison), `Array<string>` (generic type parameter), and `<Component>` (JSX element start) are all valid in the same file, sometimes the same line, and a naive regex-based approach — which is what every current strategy uses — would misfire on this constantly.

### 6.3 What Real Support Would Actually Require

Scoped honestly, not minimized:

1. A JSX-aware tokenizer — either a new `TsxScanner extends BaseScanner` or a substantial extension to `TypescriptScanner` — correctly resolving the three-way `<` ambiguity above, plus JSX-specific constructs (attributes, spread props, fragments `<>...</>`, expression containers `{...}`).
2. A `TsxStrategy` (or a genuine extension to `TypescriptStrategy`, following the same "extension point" pattern `JavascriptStrategy` already establishes) capable of finding *React-meaningful* documentable blocks — component functions specifically, not just any exported function — and injecting headers/docs without corrupting JSX syntax in the process.
3. Possibly a `ReactOrchestrator` — but very likely with a different internal shape than `VueOrchestrator`'s extract-delegate-splice pattern, since there's no clean region to extract. More likely a strategy that consumes a JSX-aware token stream directly, using `RegionOfInterest` (§6.1) to mark JSX spans within the token stream rather than extracting them as separate text.

### 6.4 Recommendation: Scope as Deferred Future Work, Reserve the Architectural Home, Don't Design Further Now

This is a meaningfully harder problem than anything else in this roadmap, and — importantly — **nothing in the ~25 commands already specified depends on it**. I'd recommend:
- Log it explicitly as a scoped, deferred item (Phase 9 in §7 below), not designed further until Phases 1–8 are implemented and stable.
- Reserve its architectural home now, at zero cost: `baseStrategy.ts`'s extension-to-strategy map already trivially accepts new `.jsx`/`.tsx` entries whenever the underlying scanner/strategy exist; `app/orchestrators/react/` (or wherever `VueStrategy`'s pending move lands, `app/strategies/react/`) is a one-line addition to create when the time comes.
- Treat `RegionOfInterest` as the confirmed hook point for whatever region-marking JSX support eventually needs, since it's already generalized past Vue specifically.