/**
* ================================================================================
*
* @project:    app-manager
* @file:       ~/docs/.vitepress/theme/components/CommandBlock.vue
* @version:    1.0.1
* @createDate: 2025 Dec 22
* @createTime: 16:51
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
 * Refactored logic.
*
* V1.0.0, 20251222-16:51
* Initial creation and release of CommandBlock.vue
*
* ================================================================================
*/

<template>
  <div class="command-block">
    <pre><code>$ <slot /></code></pre>
  </div>
</template>

<style scoped>
.command-block {
  background: #0b0e14;
  border-left: 4px solid var(--vp-c-brand-1);
  padding: 0.75rem 1rem;
}
</style>
