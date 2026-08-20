/**
* ================================================================================
*
* @project:    app-manager
* @file:       ~/docs/.vitepress/theme/components/LayerBadge.vue
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
* Initial creation and release of LayerBadge.vue
*
* ================================================================================
*/

<template>
  <span class="layer-badge">
    <slot />
  </span>
</template>

<style scoped>
.layer-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  background: rgba(65, 184, 131, 0.15);
  color: #41b883;
  font-weight: 600;
}
</style>