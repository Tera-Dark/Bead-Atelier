# Bead Atelier ✳

**An immersive 3D pixel-bead studio.** A little world, bead by bead.

Original workspace interface, realistic 3D pegboard and hollow beads, studio light, interactive placement, orbit controls, 16-color palette, image-to-bead import, undo/redo and autosaving.

## Run

```bash
npm install
npm run dev
```

Open the localhost URL shown by Vite. Use `npm run build` for production.

## Controls

- Left click or drag: place / erase beads
- Right drag: orbit; scroll: zoom
- B: brush; E: eraser
- Ctrl/Cmd+Z: undo; Ctrl/Cmd+Shift+Z: redo
- Import image: 24×24 nearest-RGB color approximation
- Export: JSON project
- Save: automatic in current browser localStorage

## Technology

React + TypeScript + Vite; Three.js + React Three Fiber + Drei. Inspired by high-end minimal creative workspaces. No server, API key or paid service needed.

## Status

This is a **v0.1 foundation**. Not yet a production-grade bead pattern generator. Planned: accessible controls, accurate CIEDE2000 and brand palettes, multiple board sizes, instanced rendering, procedural animation and sound, crop/dither controls, PNG/PDF and printable patterns, fused-bead preview and progress tracking.

## Open-source references

- https://github.com/pmndrs/react-three-fiber
- https://github.com/pmndrs/drei
- https://github.com/motiondivision/motion

Architecture inspiration only; original UI and application code.
