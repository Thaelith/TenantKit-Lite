---
name: TenantKit Lite Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 40px
  gutter: 20px
---

## Brand & Style
This design system is engineered for professional B2B property management, prioritizing clarity, efficiency, and a "quiet" aesthetic that allows complex data to remain the focal point. The brand personality is institutional yet modern—evoking trust through precision rather than decorative elements.

The design style follows a refined **Minimalist** approach with a focus on high-quality white space and subtle structural definition. It avoids all trends that compromise legibility (such as glassmorphism or high-saturation gradients) in favor of a stable, serious environment. The emotional response should be one of "effortless control," where the UI feels like a high-performance tool rather than a consumer app.

## Colors
The palette is rooted in a "Slate & Snow" philosophy. The primary color is a deep Slate Blue (#1E293B), used for typography, primary actions, and navigational anchors to provide a heavy "ink" feel that contrasts sharply against white surfaces.

The neutral palette utilizes cool-toned greys to differentiate surface areas without introducing visual clutter. Backgrounds use a pure White (#FFFFFF) for cards and a very soft Ghost White (#F8FAFC) for the canvas to create a subtle layered effect. Border colors are strictly controlled at #E2E8F0 to ensure they define boundaries without drawing the eye.

## Typography
Inter is utilized for its exceptional legibility in data-dense environments. This design system relies on a strict scale where weight and color contrast do the heavy lifting for hierarchy rather than large jumps in font size.

- **Headlines:** Reserved for page titles and major section headers, using semi-bold weights and slight negative letter-spacing for a "tight" professional look.
- **Body Text:** Set at 14px for standard readability, with 13px used for secondary information or sidebar metadata.
- **Labels:** Small, uppercase labels with increased letter-spacing are used for table headers and non-interactive metadata to distinguish them from actionable content.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum widths for content readability. A 12-column grid is used for the main dashboard area, while the navigation is housed in a persistent left-hand sidebar (240px width).

Spacing is based on a 4px baseline grid. For B2B data density, we utilize "Comfortable" spacing for high-level overviews (24px margins) and "Compact" spacing for data tables and property lists (12px-16px internal padding). Visual breathing room is prioritized around key performance indicators (KPIs) to prevent cognitive overload.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**. Instead of heavy dropshadows, this design system uses 1px borders in a soft slate-grey to define elements.

- **Level 0 (Canvas):** #F8FAFC (The background upon which everything sits).
- **Level 1 (Cards):** #FFFFFF (The primary container for content), featuring a 1px border and a very soft, diffused shadow (0px 4px 6px rgba(0,0,0,0.02)) to provide a subtle lift.
- **Level 2 (Modals/Popovers):** Pure White with a slightly more pronounced shadow (0px 10px 15px rgba(0,0,0,0.05)) to indicate focus and interactivity.
- **Interactive States:** Hovering over a card or list item should result in a subtle shift in border color rather than a significant increase in elevation.

## Shapes
The shape language is disciplined and consistent. A "Soft" approach is adopted to mitigate the coldness of a data-heavy interface while maintaining a serious tone.

- **Standard Elements (Buttons, Inputs):** 6px (0.375rem) radius.
- **Primary Containers (Cards):** 8px to 12px radius, depending on size. 8px is preferred for smaller dashboard widgets, while 12px is used for the main central content area.
- **Inner Elements:** Nested elements (like status chips inside a table) should have a smaller radius (4px) to maintain visual harmony with their parent container.

## Components
- **Buttons:** Primary buttons use a solid #1E293B background with white text. Secondary buttons use a white background with a #E2E8F0 border. No gradients; state changes (hover/active) are managed through subtle opacity shifts or slight darkening of the hex value.
- **Cards:** The foundational unit of the dashboard. Each card should have a 1px border (#E2E8F0), no heavy shadows, and consistent 24px internal padding.
- **Data Tables:** Highly minimalist. No vertical borders; only horizontal 1px dividers. Header rows use `label-caps` typography and a soft grey background (#F8FAFC).
- **Inputs:** Clean fields with 1px borders. Focus states use a 1px solid #1E293B border—never a glow or shadow—to maintain the "serious" B2B aesthetic.
- **Status Chips:** Small, low-saturation backgrounds with high-contrast text. For example, a "Paid" status uses a very pale green background with a dark green text, avoiding vibrant "neon" colors.
- **Property List Items:** Compact rows with a subtle hover state (#F1F5F9) and clear 16px spacing between metadata columns.