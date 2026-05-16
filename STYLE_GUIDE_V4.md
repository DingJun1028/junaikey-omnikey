# System UI/UX Style Specification: Liquid Glass (Cyan Sovereignty) 💎
**Project**: ESGss JunAiKey Beta | **Document Status**: Active | **Version**: 4.0

## IMPORTANT
**Core Philosophy**: The interface is not just a tool; it is a **Fluid Cognitive Extension**. It must use the "Liquid Glass" aesthetic with "Bento Box Fixed" layouts to create a sovereign, dashboard-like experience that avoids scrolling and maximizes information density without clutter.

---

## 1. Layout Principles 🍱

### The "Sovereign Bento" (Fixed One-Page)
*   **Concept**: All critical information must be visible at a glance. No main window scrolling.
*   **Grid System**: Use a rigid CSS Grid (e.g., `grid-cols-12 grid-rows-6`) that fits exactly into `100vh`.
*   **Compartmentalization**: Each "cell" of the Bento Box is a self-contained "Glass Module".
*   **Responsive Behavior**:
    *   **Desktop**: Fixed aspect ratio dashboard.
    *   **Mobile**: Stacked cards (vertical scroll allowed only here).

### Z-Index Stratification (The 3 Layers)
*   **Layer 0 (Void)**: The deep, animated background (Nebula/Ocean).
*   **Layer 1 (Structure)**: The Glass Modules (Bento Cells).
*   **Layer 2 (Hologram)**: Active cognitive elements (floating stats, critically important notifications).

---

## 2. Aesthetic DNA: "Liquid Glass Cyan" 🧪

### Color Palette (The "Spinach" Spectrum)
A sophisticated, eco-futuristic palette avoiding generic "matrix green".

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `cyan-core` | `#06b6d4` | Primary brand accent, healthy system status. |
| `emerald-soul` | `#10b981` | Success states, growth, "Sovereign Oak" energy. |
| `void-stark` | `#020617` | Deepest background color (Slate-950). |
| `glass-surface` | `rgba(15, 23, 42, 0.6)` | Base background for modules. |
| `glass-frosted` | `rgba(255, 255, 255, 0.05)` | Highlights and borders. |
| `gold-sovereign` | `#ffd700` | Elite status, mastery, "Sovereign Gold". |

### Materiality (The "Glass" Effect)
All UI containers must utilize the `backdrop-filter` property to create depth.

```css
.glass-panel {
  background: rgba(15, 23, 42, 0.6); /* Dark Blue-Grey Tint */
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### Gradients (The "Exquisite" Touch)
Avoid flat colors. Use subtle gradients that mimic light passing through water or crystal.
*   **Active State**: `bg-gradient-to-br from-cyan-500/20 to-emerald-500/20`
*   **Warning State**: `bg-gradient-to-br from-amber-500/20 to-orange-600/20`

---

## 3. Typography & Micro-Interactions 🔡

### Typography
*   **Headings**: Inter (Tight tracking, Bold/Black weight).
*   **Data/Code**: JetBrains Mono or Fira Code (Monospaced, tabular nums).
*   **Body**: Inter or System UI (Clean, readable).

### Animations (The "Fluid" Feel)
*   **Duration**: 300ms is the golden standard.
*   **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Fast out, slow in).
*   **Hover**: Elements should "lift" (`translate-y-[-2px]`) and "glow" (increase border opacity).

---

## 4. Component Standards 🧩

### The "Omni-Card"
Standard unit of the Bento Grid.
*   **Border Radius**: `rounded-2xl` or `rounded-3xl` (Smooth corners).
*   **Inner Padding**: `p-6` (Generous breathing room).
*   **Header**: Flex row with Icon + Title (Uppercase, Tracking-Widest).

### Inputs & Actions
*   **Buttons**:
    *   *Primary*: Glassy background with a strong bottom border ("Crystal Button").
    *   *Secondary*: Ghost style, text only with hover glow.
*   **Cyber-Inputs**: Transparent background, bottom border only, glowing focus state.

---

## 5. Implementation Checklist ✅
- [ ] Ensure 100vh layout on desktop (no scroll).
- [ ] Apply `backdrop-blur-md` or `xl` to all containers.
- [ ] Verify text contrast ratios (Accessibility).
- [ ] Use `framer-motion` for all state transitions (presence/exit).