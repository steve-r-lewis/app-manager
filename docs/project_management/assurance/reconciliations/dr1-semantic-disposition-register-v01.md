# DR-1 Semantic Disposition Register

> **Status:** Complete on branch
>
> **Role:** Semantic accounting for DR-1
>
> **Source baseline:** `fe30f5ad883ce2abeca2e495dd4d7036eef09da6`

| ID | Baseline proposition/finding | Classification | Disposition | Final owner / follow-forward |
|---|---|---|---|---|
| DR1-01-A | IS-1 request carries interaction capabilities | valid | RETAIN | IS-1; five-field canonical request contract |
| DR1-01-B | IS-22 adapter exposes host/presentation capabilities | valid but misnamed | CORRECT | adapter-local `AdapterCapabilities` |
| DR1-01-C | adapter capabilities map into application request capabilities | previously ambiguous | CORRECT | active Level 4 interaction-capabilities clarification; fold into IS-22 in DR-7 |
| DR1-01-D | capability declaration does not grant application authority | valid | RETAIN | IS-1/IS-22 authority boundary |
| DR1-02-A | Version 1 Nuxt has canonical inspection intent | valid | RETAIN | DD-3.3 + active Nuxt operation-identity clarification |
| DR1-02-B | `inspect_layer_state` is a ninth independently invocable identity | stale/incorrect primary text | CORRECT | active clarification already removes ninth identity; fold into DD-3.3 in DR-5 |
| DR1-02-C | layer lifecycle/integration state remains required structured evidence | valid | RETAIN | Nuxt Functional + clarification + IS-16 |
| DR1-03-A | root-application creation may include Nuxt configuration artefact class | valid | RETAIN | FR-APP-072 |
| DR1-03-B | App owns inclusion of artefact classes in root-creation plan | valid | RETAIN | DD-APP-045 |
| DR1-03-C | Nuxt-specific configuration/scaffold content semantics remain Nuxt-owned | valid | RETAIN | DD-APP-045 / Nuxt authorities |

No DR-1 proposition receives `REMOVE`. The package corrects ambiguity/inconsistency while preserving all valid semantic obligations.
