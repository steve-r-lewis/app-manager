/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/docs/.vitepress/theme/index.ts
 * @version:    1.0.1
 * @createDate: 2025 Dec 14
 * @createTime: 23:46
 * @author:     Steve R Lewis
@author:     steve-r-lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 * V1.0.1, 20251226-1913
 * Updated project details.
 *
 * V1.0.0, 20251214-23:46
 * Initial creation and release of index.ts
 *
 * ================================================================================
 */

// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

import './styles/vars.css'
import './styles/base.css'
import './styles/code.css'
import './styles/layers.css'

export default {
	extends: DefaultTheme,
	Layout
}