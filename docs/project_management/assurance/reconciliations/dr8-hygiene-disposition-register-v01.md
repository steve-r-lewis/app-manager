# DR-8 Hygiene Disposition Register

> **Status:** DR-8 branch closeout evidence
>
> **Baseline:** live `master` after merged PR #165, `a43e1b1af19c64b96f1f479a4c5505f74289c67a`
>
> **Normative product effect:** None. This is project-management assurance/accounting evidence.

## 1. Purpose

This register accounts for every candidate named by DR-8 — Documentation and Project-Management Hygiene.

## 2. Candidate Dispositions

| ID | Candidate | Disposition | Result |
|---|---|---|---|
| DR8-01 | project-management compatibility stubs | `RETAIN` | Active normative and historical documents still contain repository-relative references to legacy root PM paths. Removing stubs now would break navigation/compatibility. Substantive records remain correctly classified under `assurance/` or `history/`. |
| DR8-02 | redundant `.gitkeep` | `REMOVE` | `docs/dd_4_policy_and_resource_domains/.gitkeep` is redundant because the directory contains four primary DD documents. Removed. |
| DR8-03 | IS heading conventions | `RETAIN` | Primary IS files consistently use stable `IS-n — Subject Implementation Specification` H1 identities. Differences in internal section counts/content reflect subject delta; no safe hygiene rewrite justified. |
| DR8-04 | Functional front matter / modal convention | `RETAIN` | Status/header wording varies historically, but `FR-*` requirement bodies remain the semantic checksum and DR-6 already controls corpus reading. Bulk wording normalization would create noise without semantic benefit. |
| DR8-05 | stable DD-1 rule identifiers | `RETAIN / NO CHANGE` | No separate corpus-wide DD-1 rule-ID namespace is required by current normative governance. Existing DD identities, section structure and named contracts provide stable traceability. Inventing IDs in a hygiene package would be new documentation structure rather than low-risk cleanup. |
| DR8-06 | stale clarification tracking | `CORRECT` | Added `active-clarification-register-v01.md` as a non-normative current navigation register covering live Functional, DD and Implementation clarifications. |
| DR8-07 | historical-register references | `RETAIN compatibility / classify` | Root compatibility pointers and superseded-plan stubs remain because active documents still reference some historical paths. Current state is explicitly owned by PM README, DD register, active clarification register and Level 4 register. Historical records remain provenance, not work queues. |

## 3. Compatibility Evidence

The compatibility-pointer body explicitly states that the root path is retained temporarily to avoid breaking existing repository-relative links and has no normative product effect. Search of live `master` confirms active Detailed Designs still reference examples such as the root DD-3.2 handover path and superseded authoring/decomposition-plan paths.

Therefore deleting compatibility stubs in DR-8 would violate the programme instruction to check active references and compatibility value first.

## 4. Empty-File Evidence

The repository tree contains one `.gitkeep` under the normative documentation families: `docs/dd_4_policy_and_resource_domains/.gitkeep`. The same directory already contains DD-4.1 through DD-4.4, so the placeholder has no directory-preservation function.

Other zero-byte files in the repository are implementation/test placeholders and are outside DR-8 documentation hygiene scope; they are not treated as `.gitkeep` equivalents.

## 5. Clarification Tracking

The new active clarification register is navigation only. It does not change clarification authority, lifecycle automatically, or create a new normative level. It makes current clarification state discoverable without reconstructing it from assurance/history.

## 6. Acceptance

No product requirement, architecture, DD contract, `FR-*`, `IS-*`, provider decision or runtime decision changes in DR-8.

**PASS — all named DR-8 candidates classified; one redundant placeholder removed; clarification tracking improved; compatibility files retained where current references still justify them.**