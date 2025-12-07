export { siteConfig, type SiteConfig } from './site.config'
export { themeConfig, type ThemeConfig } from './theme.config'

import { siteConfig } from './site.config'
import { themeConfig } from './theme.config'

// ═══════════════════════════════════════════════════════════
// HELPER FUNKCIE
// ═══════════════════════════════════════════════════════════

/**
 * Získa farbu z theme config
 */
export function getColor(colorName: keyof typeof themeConfig.colors, shade: number = 500): string {
  const colorPalette = themeConfig.colors[colorName] as Record<number, string>
  return colorPalette?.[shade] || colorPalette?.[500] || '#000000'
}

/**
 * Získa gradient class z theme config
 */
export function getGradient(name: keyof typeof themeConfig.gradients): string {
  return themeConfig.gradients[name]
}

/**
 * Formátuje copyright text
 */
export function formatCopyright(): string {
  const { content, company } = siteConfig
  return content.footer.copyright
    .replace('{year}', new Date().getFullYear().toString())
    .replace('{company}', company.legalName)
}

/**
 * Získa social linky (len tie ktoré sú definované)
 */
export function getSocialLinks() {
  return Object.entries(siteConfig.social)
    .filter(([_, url]) => url !== null)
    .map(([platform, url]) => ({ platform, url: url as string }))
}

/**
 * Kontrola či je feature zapnutá
 */
export function isFeatureEnabled(feature: keyof typeof siteConfig.features): boolean {
  return siteConfig.features[feature]
}

