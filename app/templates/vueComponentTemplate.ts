/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/vueComponentTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Jan 06
 * @createTime: 23:58
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
 * V1.0.0, 20260106-23:58
 * Initial creation and release of vueComponentTemplate.ts
 *
 * ================================================================================
 */

import type { BaseTemplateContext, TemplateFunction } from '../types/index.js';

export const vueComponentTemplate: TemplateFunction<VueComponentContext, string> = (ctx) => {
	const dateStr = new Date().toISOString().split('T')[0];
	const timeStr = new Date().toTimeString().split(' ')[0].substring(0, 5); // HH:MM
	const year = ctx.year || new Date().getFullYear();
	const author = ctx.author || 'Maintainer';
	
	// Note: We deliberately place script first, with the header INSIDE it.
	return `<script setup lang="ts">
/**
 * ================================================================================
 *
 * @project:    ${ctx.projectName}
 * @file:       ~/components/${ctx.name}.vue
 * @version:    1.0.0
 * @createDate: ${dateStr}
 * @createTime: ${timeStr}
 * @author:     ${author}
 *
 * ================================================================================
 *
 * @description:
 * ${ctx.description || 'TODO: Create description here'}
 *
 * ================================================================================
 *
 * @notes: Revision History
 * * V1.0.0, ${dateStr}-${timeStr}
 * Initial creation and release of ${ctx.name}.vue
 *
 * ================================================================================
 */

/**
 * TODO: TypeScript code for the component goes here with suitable DocBlock type comments as necessary
 * for new/changed logic.
 */
</script>

<template>
  <div class="${ctx.name.toLowerCase()}">
    <h2>${ctx.name}.vue</h2>
  </div>
</template>

<style scoped>
/* TODO: Add component-specific styles if utility classes are insufficient. */
</style>
`;
};