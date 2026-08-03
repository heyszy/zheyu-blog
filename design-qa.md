# Design QA

## Findings

- No actionable P0, P1, or P2 differences remain.
- The signature uses OFL-licensed La Belle Aurore instead of the reference site's commercially licensed Biro Script. This is an intentional legal constraint, and the replacement preserves the handwritten scale, weight, and visual role.
- App-specific copy is intentionally Chinese and describes Zheyu Shen rather than copying the reference site's identity or article content.

## Evidence

- Source visual truth:
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/01-home-desktop.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/02-article-desktop.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/03-home-mobile.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/04-article-mobile.png`
- Browser-rendered Worker implementation:
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/implementation-home-desktop-final.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/implementation-article-desktop-final.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/live-article-desktop-sidebar-correction.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/implementation-home-mobile-final.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/implementation-article-mobile-final.png`
- Full-view side-by-side comparisons:
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/comparison-home-desktop-final.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/comparison-article-desktop-final.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/comparison-home-mobile-final.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/comparison-article-mobile-final.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/comparison-home-desktop-layout-correction.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/comparison-home-desktop-grid-shadow-v2.png`
  - `/Users/shenzheyu/.codex/visualizations/2026/08/02/019fc306-1bab-7d42-9de0-981af671cbaf/comparison-home-desktop-body-flow-root.png`
- Viewports and normalization: desktop 1280 x 720 CSS px and mobile 390 x 844 CSS px, device scale factor 1. Source and implementation captures have identical pixel and CSS dimensions. Combined desktop evidence is 2560 x 720; combined mobile evidence is 780 x 844.
- State: homepage at top; article at top with desktop navigation visible and mobile menu closed.
- Focused regions were not needed because the signature, typography, navigation, dotted leaders, and article headings are large and readable in the 1:1 full-view comparisons.

## Fidelity Surfaces

- Fonts and typography: Inter body text and Libre Caslon Text display text match the reference hierarchy; La Belle Aurore is the closest suitable open-source signature replacement. Weights, wrapping, line heights, and small navigation text were checked at both viewports.
- Spacing and layout rhythm: desktop paper is 840 px wide with a 560 px reading column; mobile uses 24 px side margins. Paper offset, intro spacing, dotted article rows, article rhythm, and responsive navigation follow the source.
- Colors and tokens: warm white paper, faint gray grid, charcoal text, muted metadata, and dotted rules match the source's restrained neutral palette.
- Image and asset quality: the source has no content imagery. Phosphor icons replace control glyphs with crisp library SVGs; no hotlinked or copied proprietary assets are used.
- Copy and content: all identity and article copy is original Chinese content for Zheyu Shen; route labels and metadata agree with the rendered article.

## Comparison History

1. Initial comparison found a P2 vertical-rhythm mismatch: the homepage article list began too high relative to the reference. The intro-to-list gap was increased and the revised captures align the list region.
2. Initial interaction pass found a P2 route-state mismatch: entering the article could preserve the homepage scroll position. The homepage link now disables scroll restoration, and the article opens at its intended paper-top position.
3. Worker runtime verification found the generated dynamic route returning 404 under OpenNext. The single first-release article was changed to an explicit static App Router route; the Worker preview now returns 200 for the article and all expected metadata endpoints.
4. Post-deployment review found a P2 desktop canvas mismatch: the implementation centered an 840 px paper and exposed grid on both sides, while the reference starts a viewport-width sheet after a responsive 220–280 px left rail and lets it overflow to the right. The paper now uses the reference site's measured responsive rail formula, full viewport width, 560 px content offset, two-scale grid, and two-axis fading mask. Revised 1280 x 720 side-by-side evidence shows white paper across the entire lower-right canvas; the 390 x 844 check confirms no mobile overflow.
5. A second post-deployment review found a P2 depth mismatch: the top grid was too faint at normal Chrome scaling and the sheet lacked the reference site's inset edge plus 30/60 px drop shadow. The top mask now reaches full opacity sooner, grid lines have slightly stronger neutral alpha, and the paper uses the measured reference shadow. The final 1280 x 720 comparison shows visible fading grid above the sheet and a clear paper edge without changing mobile rendering.
6. A third review exposed a P1 structural regression that the white background had previously hidden: the paper's 100 px top margin collapsed through `body`, moving the body-relative grid canvas down and creating an apparently blank top region. Making `body` a flow root prevents margin collapse. Browser measurements now show body `y=0`, paper `x=220`, `y=100`, `width=1280`, `right=1500`, and document `scrollWidth=1280`; the final side-by-side capture restores the reference's top grid and continuous lower-right sheet.
7. Article review found a P2 navigation mismatch: the desktop table of contents was positioned relative to the paper rail, used oversized vertical gaps, and showed “返回顶部” at initial load. The navigation is now a full-height viewport rail with its content anchored 56 px from the left and 232 px from the top, 31 px section rows, active-section contrast, and a bottom-anchored return control that appears only after scrolling.
8. Motion review replaced the previous single-sheet route transition with a stacked-paper transition: opening an article preserves a non-interactive clone of the homepage paper beneath the incoming article paper; returning home animates the article paper away before replacing the clone with the live homepage. Desktop and 390 px browser checks confirmed two papers during both transition phases, no mobile overflow, cleanup after navigation, and no console warnings.

## Primary Interactions

- Homepage article link opens `/posts/why-this-blog`.
- Desktop article navigation links to home and all three section anchors.
- Mobile menu opens and closes, exposes the same navigation, closes after an anchor selection, and supports Escape.
- `这里会写什么` aligns near the top after anchor navigation.
- `返回顶部` reaches scroll position 0 after the smooth scroll completes.
- Keyboard focus styles are present; the page includes a skip link.
- Worker runtime logs show no application errors after the static-route fix.

## Implementation Checklist

- [x] Desktop and mobile visual comparison
- [x] Fonts, layout, colors, assets, and copy reviewed
- [x] Primary interactions verified in a real browser
- [x] Worker runtime routes verified
- [x] P0/P1/P2 findings resolved

## Follow-up Polish

- P3: add social profile links when the final public URLs are supplied.

final result: passed
