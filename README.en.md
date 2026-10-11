<div align="center">

<img src="./public/bead-paw.png" alt="Bead Atelier four-color bead paw" width="116" />

# ✳ Bead Atelier

### A Little World, Bead by Bead.

**A calm, immersive pixel-bead studio with precise 2D editing and tactile 3D previews.**

Create colorful little artworks, right in your browser. No installation or account required.

[**🎨 Launch the studio**](https://tera-dark.github.io/Bead-Atelier/) · [简体中文](./README.md) · [Report an issue](https://github.com/Tera-Dark/Bead-Atelier/issues)

![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-242424?style=flat-square&logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)

[简体中文](./README.md) · **English**

</div>

---

## ✨ What is Bead Atelier?

**Bead Atelier** is an experimental, design-led workspace for fuse-bead / Perler-style creations. Paint precisely on a 2D bead board, then switch to an illuminated 3D model to enjoy your work from different angles.

The goal is a creative tool that feels **delightful, focused and tactile**, rather than just another grid converter. The project is under active development.

## 🪄 Current features

| Area | Available now |
| --- | --- |
| Board and navigation | 24×24, 29×29 and 52×52 boards; drag-to-pan 2D canvas, 75%–300% bounded zoom, centered at the pointer with direct mouse-wheel input, interactive minimap |
| Personal layout | Independently show or hide navigation, tools, palette, favorites, minimap, animation and status bars |
| Drawing tools | Brush, eraser, flood fill, picker, hand/pan, undo and redo |
| Visual modes | Solid pixels, hollow fuse beads, candy dots, or numbered color chart |
| Quick palette | 16 demonstration colors with a persistent favorite-color tray |
| Image conversion | Original/converted preview, board dimensions, 2–16 colors, approximate Lab matching, optional dithering, crop and alpha support |
| Beginner projects | Eight handcrafted animal pixel patterns (six 29×29 and two 52×52), translucent tracing guides and color-specific progress |
| 3D mode | Instanced bead meshes, 3D pegboard, lighting and visual-only fused-bead simulation |
| Printable patterns | Coordinates, numbered cells, five-cell guides, quantities, SVG, CSV, print/PDF |
| Files | PNG image, editable JSON project import/export, automatic browser-local storage |
| Ambience | Opt-in synthesized background melody, soft placement sounds and assembly playback |

> **Current limitations:** The 16-color palette is a **demonstration palette**, not verified physical bead-brand color data. You may add your own pattern color labels, but should check them against real supplies. The fused-bead view is a visual approximation, not a physical heat simulation. Music must be enabled by the user. **The app UI is currently in Chinese**; English localization is planned.

## 🎮 Getting started

1. Open the [live studio](https://tera-dark.github.io/Bead-Atelier/). First-time visitors can opt into a six-step interactive walkthrough, or skip it.
2. Select **New canvas**, choose 24×24, 29×29 or 52×52 and configure 5/10-cell guide lines and coordinates. Back up an existing project before replacing it.
3. Paint with the tools and palette, import an image or pick an animal template. A dragged brush stroke can be undone in one step.
4. Switch to **3D preview** or open **Pattern sheet** for numbered cells and material quantities.
5. Export a **PNG** for sharing or **JSON** to continue later.

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `B` | Brush |
| `E` | Eraser |
| `G` | Flood fill |
| `I` | Color picker |
| `H` or `Space` + drag | Pan the bounded 2D canvas |
| Mouse wheel (2D) | Zoom toward the cursor, 75%–300% |
| Right drag (2D) | Pan the canvas |
| `Ctrl / Cmd + N` | New canvas |
| `Ctrl / Cmd + S` | Download a JSON project backup |
| `Ctrl / Cmd + Z` | Undo one complete brush stroke |
| `Ctrl / Cmd + Shift + Z` or `Ctrl / Cmd + Y` | Redo |
| Right drag (3D) | Orbit camera |
| Mouse wheel (3D) | Zoom camera |

## 🛠 Local development

Use **Node.js 22** or a compatible version, with npm.

```bash
git clone https://github.com/Tera-Dark/Bead-Atelier.git
cd Bead-Atelier
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

Stack: **React 19, TypeScript, Vite, Three.js, React Three Fiber, Drei, and the Web Audio API**. No paid API, backend service or database is required.

### Deployment

Commits pushed to `main` trigger GitHub Actions and publish to GitHub Pages.

- Live site: <https://tera-dark.github.io/Bead-Atelier/>
- Workflow: [`deploy.yml`](./.github/workflows/deploy.yml)
- Runs: [GitHub Actions](https://github.com/Tera-Dark/Bead-Atelier/actions)

Select **GitHub Actions** as the source under **Settings → Pages → Build and deployment**.

## 🧭 Roadmap

- [x] Multiple board sizes and canvas navigation
- [x] Approximate Lab matching, dithering and image-conversion previews
- [x] Printable patterns and material quantities
- [x] Instanced 3D beads, automatic assembly and tactile feedback
- [ ] Modular pegboards, calibrated physical-brand palettes and inventory
- [ ] More complete mobile gestures and accessibility
- [ ] English language switching in the application

## 💾 Privacy and storage

Your project is currently saved in the **localStorage of your current browser**. Image conversion and drawing run locally without account registration or cloud uploads. Clearing browser storage, switching devices or using private browsing may erase local work. **Export JSON backups** regularly.

## 🤝 Feedback and contributions

Ideas and bug reports are welcome in [Issues](https://github.com/Tera-Dark/Bead-Atelier/issues). This is an early-stage project and **a formal open-source license has not yet been selected**. Please do not assume unrestricted reuse or redistribution.

---

<div align="center">

*Bead Atelier · A Little World, Bead by Bead.*

[Live Demo](https://tera-dark.github.io/Bead-Atelier/) · [简体中文](./README.md) · [GitHub](https://github.com/Tera-Dark/Bead-Atelier)

</div>
