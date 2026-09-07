---
name: GymApp Design System
description: Clean, high-precision athletic interface for structured training and tracking.
colors:
  primary: "#173B57"
  accent: "#4DA8FF"
  accent-soft: "#E9ECEF"
  background: "#F4F5F6"
  surface: "#FFFFFF"
  text-primary: "#14181D"
  text-secondary: "#454C54"
  text-muted: "#68717B"
  border: "#D5D9DD"
  danger: "#D94A5A"
  success: "#34D399"
  warning: "#FBBF24"
typography:
  display:
    fontFamily: "'Figtree', 'DM Sans', system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 800
  headline:
    fontFamily: "'Figtree', 'DM Sans', system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
  title:
    fontFamily: "'Figtree', 'DM Sans', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 750
  body:
    fontFamily: "'DM Sans', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: "normal"
    lineHeight: "24px"
  label:
    fontFamily: "'Roboto Mono', ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  space-1: "6px"
  space-2: "12px"
  space-3: "18px"
  space-4: "24px"
  space-5: "30px"
  space-6: "36px"
  space-7: "48px"
  space-8: "60px"
  space-9: "72px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, {colors.primary} 88%, white)"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "#141821"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-accent-hover:
    backgroundColor: "color-mix(in srgb, {colors.accent} 90%, black)"
---

# Design System: GymApp

## Overview

**Creative North Star: "The Athletic Precision Lab"**

The Athletic Precision Lab represents a clean, high-performance visual system designed for focused physical training. It avoids unnecessary graphical fluff, placing absolute priority on readability, structural separation, and clear temporal progression. The interface feels clean, modern, and fresh—bringing together deep structural contrast and athletic simplicity. It supports 15 vibrantly tailored color themes that can be hot-swapped dynamically via custom CSS variables without ever breaking the underlying page state.

**Key Characteristics:**
- **Absolute Readout Focus**: Monospace numbers and clear labels prevent visual drift and layout shifting during high-intensity training tracking.
- **Dynamic Color Personalization**: Comprehensive variable mapping allowing all 15 aesthetic themes to adapt seamlessly.
- **Tactile Simplicity**: Use of crisp, structural shadows and outlines to elevate active panels, routine cards, and timers over the canvas.

## Colors

The color palette is designed around high-contrast athletic energy, grouping tones strictly by structural roles.

### Primary
- **Deep Abyss Navy** (`#173B57`): Used for primary headers, solid fills, and establishing the dominant brand anchor across standard active screens.

### Secondary
- **Electric Neon Cyan** (`#4DA8FF`): The high-voltage interactive accent, driving the eye toward primary action buttons, progress indicators, active state rings, and focus indicators.

### Neutral
- **Slate Mist Background** (`#F4F5F6`): Low-fatigue background color, keeping workouts distraction-free and highly visible.
- **Pure White Surface** (`#FFFFFF`): Standard container surface for workout cards, filters, list panels, and dialog bases.
- **Ink Dark Text** (`#14181D`): Deepest neutral tone utilized for razor-sharp readability of titles and main labels.
- **Muted Slate Text** (`#454C54`): Mid-level secondary neutral used for subtitles, inactive tabs, meta-tags, and captions.
- **Ice Gray Border** (`#D5D9DD`): High-precision division lines separating active blocks, routine segments, and form outlines.

### Named Rules
**The 15-Hues Rule.** Color variables must be declared exclusively as CSS custom properties (`--color-*`) linked to the current root `[data-theme]` attribute, enabling real-time hot-swapping across all 15 user-selected styles without DOM restructuring.

**The Focus Ring Rule.** Interacted elements must draw an accessible, glowing outline using `color-mix(in srgb, var(--color-accent) 62%, transparent)` to ensure complete visual feedback for athletes with active or sweaty fingers.

## Typography

**Display Font:** Figtree (with 'DM Sans', system-ui, sans-serif fallback)  
**Body Font:** DM Sans (with system-ui, sans-serif fallback)  
**Label/Mono Font:** Roboto Mono (with ui-monospace, monospace fallback)  

**Character:** Figtree provides a robust, athletic geometric weight for large displays, while DM Sans delivers warm, highly legible sans-serif curves for fast reading. Roboto Mono establishes monospace accuracy for numerical metrics.

### Hierarchy
- **Display** (800 weight, `32px`, line-height `1`): Big display metrics, giant workout timer digits.
- **Headline** (800 weight, `24px`, line-height `1.2`): Page titles, modal headers.
- **Title** (750 weight, `20px`, line-height `1.35`): Section sub-headings, routine block headers.
- **Body** (normal weight, `15px` / `17px` for large, line-height `24px`): Descriptive paragraphs, exercise instructions, metadata keys.
- **Label** (500 weight, `11px` / `13px` for small, letter-spacing `0.08em`, uppercase/monospace): Technical tags, elapsed metrics, difficulty labels, and overline indicators.

### Named Rules
**The High-Performance Readout Rule.** Timers, elapsed seconds, reps, and workout percentages must utilize the monospace `--font-mono` family to eliminate jarring layout shifts as active digits tick forward.

## Layout

GymApp is designed around a single-page app container that scales dynamically from high-aspect ratio mobile notches to wide desktop viewports.

- **Rhythm scale**: Utilizes a strict 6px-based spacing scale (`--space-1: 6px` to `--space-9: 72px`) for padding, margin, and layout gaps to maintain a cohesive horizontal and vertical rhythm.
- **Grids**: Responsive card grids expand from a single column on compact screens, to two columns (`1fr 1fr` at `<480px`), and three columns (`repeat(3, 1fr)` at `>700px`) on desktop viewports.
- **Notch Protection**: Layout boundaries enforce safe-area-insets using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to protect vital workout elements from being obscured by hardware notches or navigation bars.

## Elevation & Depth

Depth in GymApp is structured around crisp, layered elevation. Instead of flat modern minimalism, the application leverages physical depth layers to let athletes instantly isolate active training widgets from secondary settings.

### Shadow Vocabulary
- **Subtle** (`0 1px 3px rgb(0 0 0/.06)`): Applied on small filters panel and embedded tags to separate them from surface containers.
- **Medium** (`0 4px 12px rgb(0 0 0/.08)`): Applied on card resting states and the fixed bottom navigation drawer.
- **Large** (`0 8px 24px rgb(0 0 0/.12)`): Applied on modal overlay sheets, workout execution cards, and elevated timer containers.
- **Overlay** (`0 16px 48px rgb(0 0 0/.18)`): Applied on active bottom sheets and dialog wrappers.

### Named Rules
**The Elevation Separator Rule.** The active live workout timer card must be elevated using the `Large` shadow vocabulary over the background gradient, establishing a dominant visual anchor for hands-free reading.

## Shapes

Shapes utilize athletic, geometric curves that balance friendly ergonomics with industrial structure.

- **Scale**:
  - `--radius-sm` (`8px`): Small buttons, inline checkboxes, tag badges.
  - `--radius-md` (`12px`): Selection fields, in-editor blocks, date cards.
  - `--radius-lg` (`16px`): Dialog overlays, routine editor block containers.
  - `--radius-xl` (`24px`): Full card shells, bottom sheets, mobile-first overlay containers.
  - `--radius-full` (`9999px`): Fully rounded pills, floating timer controllers, close/back circular buttons.

## Components

### Buttons
- **Shape:** Softly curved corners (`12px` / `--radius-md` for standard buttons, `50%` / `--radius-full` for circular icons).
- **Primary:** `background: var(--color-primary)` (Deep Abyss Navy), `color: var(--color-surface)`, padding `12px 24px`. Active scale `scale(0.96)`.
- **Accent Action:** `background: var(--color-accent)` (Electric Neon Cyan), `color: var(--color-primary-dark)`. Highly visible primary workout triggers.
- **Player Controls:** Rounded circular buttons (`58px` x `58px` at rest, `52px` x `52px` on mobile), using `background: linear-gradient(145deg, var(--color-surface), var(--color-surface-secondary))` and structural borders.

### Cards / Containers
- **Corner Style:** Rounded boundaries (`18px` or `20px` radius).
- **Background:** `background: var(--color-surface)`.
- **Borders:** Thin separating outlines (`1px solid var(--color-surface-secondary)` or `color-mix(in srgb, var(--color-primary) 9%, var(--color-border))`).
- **Shadow Strategy:** Resting `Medium` shadow, transitioning with a smooth lift on hover (`transform: translateY(-2px)`, increased `Large` shadow).

### Inputs / Fields
- **Style:** Outlined search fields (`.search`) with `14px` border radius, using `background: var(--color-surface)` and a subtle ambient shadow.
- **Focus:** Border transitions to `var(--color-primary)` with a glowing, semi-transparent ring outline.

### Navigation
- **Fixed Bottom Nav:** Fixed navigation (`72px` height + safe-area insets). Active tab highlights using an absolute neon indicator pill (`content: ""; position: absolute; top: 2px; width: 22px; height: 3px; border-radius: 99px; background: var(--lime);`).

## Do's and Don'ts

### Do:
- **Do** use `var(--font-mono)` for all workout timer values, elapsed seconds, reps, and set counts to prevent numerical character width layout shifting.
- **Do** bind all hover and active states to theme-agnostic `color-mix()` formulas (e.g. `--color-primary-hover`) to keep the visual identity completely hot-swappable across all 15 themes.
- **Do** utilize structural shadows (`--shadow-large` / `--shadow-overlay`) on full-screen timer and console cards to separate workout execution states from background clutter.

### Don't:
- **Don't** hardcode raw HEX or RGB color codes directly into UI component styling classes; all colors must reference semantic theme-swappable custom properties.
- **Don't** introduce heavy decorative background images, icons, or complex illustration patterns; the design must prioritize maximum readability and direct athlete focus.
- **Don't** bypass standard CSS touch-action properties (`touch-action: manipulation`) on workout control buttons, avoiding standard tap delays during fast high-intensity training.
