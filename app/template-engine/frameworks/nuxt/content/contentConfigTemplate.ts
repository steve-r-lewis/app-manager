/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/templates/contentConfigTemplate.ts
 * @version:    1.0.0
 * @createDate: 2026 Feb 26
 * @createTime: 00:12
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
 * V1.0.0, 20260226-00:12
 * Initial creation and release of contentConfigTemplate.ts
 *
 * ================================================================================
 */

export function getContentConfigTemplate(): string {
	return `import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().optional()
      })
    })
  }
})
`;
}