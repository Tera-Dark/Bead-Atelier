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
| 2D editor | Default 2D board with click-and-drag bead placement |
| 3D preview | Three.js pegboard, hollow beads, lights and orbit camera |
| Tools | Brush, eraser, connected-area fill, color picker, undo and redo |
| Palette | 16 built-in demonstration colors |
| Image conversion | Center-crop an image into a 24 × 24 bead pattern |
| Editor controls | Grid visibility, zoom, keyboard shortcuts |
| Projects | Browser-local autosave plus JSON import / export |
| Export | PNG image and bead / color usage counts |
| Ambience | Optional softly synthesized background audio with volume control |
| Interface | Simplified Chinese by default, responsive desktop/mobile layouts |

> **Early version limitations:** The board is fixed at **24 × 24**. The built-in palette is illustrative, not calibrated to a real-world bead brand. Image conversion uses basic nearest-RGB matching, not advanced color science. Music starts only after the user opts in. The **app UI is currently Chinese-only**; this English translation applies to the README.

## 🎮 Getting started

1. Open the [live studio](https://tera-dark.github.io/Bead-Atelier/).
2. Choose a color and paint on the default **2D editor**, or import an image.
3. Switch to **3D preview** to explore your artwork.
4. Export a **PNG** or save a **JSON project** to continue editing later.

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `B` | Brush |
| `E` | Eraser |
| `G` | Flood fill |
| `I` | Color picker |
| `Ctrl / Cmd + Z` | Undo |
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

- [ ] Multiple board dimensions and modular boards
- [ ] Real bead-brand palettes, codes and inventory controls
- [ ] Improved image matching, dithering and conversion previews
- [ ] Color-by-color build guidance, progress tracking and quantities
- [ ] Faster 3D rendering, refined materials and tactile animations
- [ ] Printable bead patterns and more export formats
- [ ] Improved mobile gestures and accessibility
- [ ] English language switch for the application itself

## 💾 Privacy and storage

Your project is currently saved in the **localStorage of your current browser**. Image conversion and drawing run locally without account registration or cloud uploads. Clearing browser storage, switching devices or using private browsing may erase local work. **Export JSON backups** regularly.

## 🤝 Feedback and contributions

Ideas and bug reports are welcome in [Issues](https://github.com/Tera-Dark/Bead-Atelier/issues). This is an early-stage project and **a formal open-source license has not yet been selected**. Please do not assume unrestricted reuse or redistribution.

---

<div align="center">

*Bead Atelier · A Little World, Bead by Bead.*

[Live Demo](https://tera-dark.github.io/Bead-Atelier/) · [简体中文](./README.md) · [GitHub](https://github.com/Tera-Dark/Bead-Atelier)

</div>
