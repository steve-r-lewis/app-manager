/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/envTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 25
 * @createTime: 23:39
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20260225-23:39
 * Initial creation and release of envTemplate.ts
 *
 * ================================================================================
 */

export function getEnvExampleTemplate(): string {
	return `# DEFAULT API START
API_MODEL_DEFAULT=OLLAMA
# DEFAULT API END

# AI MODEL API START
API_KEY_CLAUDE=NULL
API_KEY_DEEPSEEK=sk-000Xxx0xx0x0xXXXXXXxxxxXX000XX0x
API_KEY_GEMINI=XxxXXXxx000xxx0x0xx0XXXX00xx00xXXXX0xx0
API_KEY_GROK=NULL
API_KEY_KIMI=sk-or-v1-xX0XxxX0000X0x0xX0XXXXXxxxx0xxx0x0000xxXxxx0XXXXxxxxXX0000XX0xxx
API_KEY_META=NULL
# AI MODEL API END

# AI HUB START
API_KEY_OLLAMA=00xx0x000xxxx00XX0XXxX000X00xxxxXXXX0xxxxx0000XXX000xxxXX
API_KEY_OPENROUTER=NULL
API_KEY_HUGGINGFACE=NULL
# AI HUB END

# GITHUB START
# For accessing GitHub private repositories a "fine grained Personal Access Token" is required.
GITHUB_TOKEN=github_pat_00XX0XXX0X0000xxxxXXX000XXX00000XXXXXX00000XX0000xxxx000xx00X0xXX0xx00X00000XxXXXX
# GITHUB END

# GITLAB START
GITLAB_TOKEN=NULL
# GITLAB END

# Default Author / Maintainer Details
AUTHOR_NAME="Steve R Lewis"
AUTHOR_EMAIL="me@steve-lewis.uk"
AUTHOR_URL="https://www.steve-lewis.uk"

# Repository Defaults
REPO_URL="https://github.com/steve-r-lewis/nuxt4-monorepo-base-app.git"
BUGS_URL="https://github.com/steve-r-lewis/nuxt4-monorepo-base-app/issues"
LICENSE_TYPE="MIT"

# Funding (Optional)
FUNDING_TYPE="individual"
FUNDING_URL="patreon.com/TheModuleFactory"
`;
}