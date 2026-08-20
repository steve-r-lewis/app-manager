/**
* ================================================================================
*
* @project:    app-manager
* @file:       ~/docs/.vitepress/theme/Layout.vue
* @version:    1.0.1
* @createDate: 2025 Dec 22
* @createTime: 16:46
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
* V1.0.0, 20251222-16:46
* Initial creation and release of Layout.vue
*
* ================================================================================
*/

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import RepoMeta from './components/RepoMeta.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <RepoMeta />
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
/* TODO: Add component-specific styles for LayoutDevelopment if utility classes are insufficient. */
</style>