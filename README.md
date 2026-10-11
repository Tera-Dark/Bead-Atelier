<div align="center">

<img src="./public/bead-paw.png" alt="Bead Atelier 四色拼豆爪爪" width="116" />

# ✳ Bead Atelier

### 一颗一颗，拼出小美好。

**一款拥有平面编辑与沉浸式 3D 预览的在线拼豆创作工作室。**

无需安装，无需注册。打开浏览器，把喜欢的颜色留在画板上。

[**🎨 立即在线体验**](https://tera-dark.github.io/Bead-Atelier/) · [English](./README.en.md) · [反馈问题](https://github.com/Tera-Dark/Bead-Atelier/issues)

![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-242424?style=flat-square&logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/部署-GitHub%20Pages-3e725b?style=flat-square&logo=github&logoColor=white)

**简体中文** · [English](./README.en.md)

</div>

---

## ✨ 项目简介

**Bead Atelier（拼豆工作室）** 希望让拼豆设计不再局限于枯燥的像素网格。你可以在柔和、简洁的工作空间中自由创作，用平面画板精确摆放每一颗拼豆，再切换到拥有光照、阴影和立体材质的 3D 场景欣赏作品。

这是一个以 **创作体验、视觉质感和操作手感** 为核心的浏览器应用，当前仍在积极开发中。

## 🪄 已有功能

| 模块 | 当前支持 |
| --- | --- |
| 画板与导航 | 24 × 24、29 × 29、52 × 52 底板；2D 画布平移、75%–300% 有界缩放（鼠标位置为中心，滚轮直接缩放）、右上角缩略图 |
| 自定义界面 | 主导航、色板、常用颜色、工具栏、自动拼豆栏、缩略图和状态栏独立显隐 |
| 绘图工具 | 画笔、橡皮、区域填色、吸管、手形平移、撤销与重做 |
| 画板视觉 | 像素色块、拼豆圆环、糖果圆点、色号方格四种显示方式 |
| 常用颜色 | 内置 16 色演示色板；收藏常用颜色，在画布左下角快捷选取 |
| 图片转拼豆 | 原图/效果预览、尺寸选择、2–16 色限制、Lab 近似色差、可选抖动、裁切与透明背景 |
| 模板与跟拼 | 八款原创像素动物图案（六款 29×29 入门 + 两款 52×52 进阶）；半透明参考图、逐色完成计数与跟拼引导 |
| 立体预览 | 基于实例化渲染的 3D 拼豆、底板与光照；熨烫后外观视觉模拟 |
| 图纸工作区 | 坐标、格内编号、每五格辅助线、颜色用量、SVG 图纸、CSV 材料表、打印/PDF |
| 导出和存档 | PNG 成品、JSON 项目备份/导入，以及本机浏览器自动保存 |
| 氛围与反馈 | 可主动开启的合成背景音乐、轻柔落位音效、弹性放置与自动拼豆动画 |

> **当前限制：** 现阶段色板仍是 **16 色示例色板**，并非真实品牌的官方色彩校准数据。可自行填写图纸色号，但必须核对实物颜色。熨烫后预览为视觉效果模拟，并非真实物理模拟。背景音乐需主动开启；界面英文版尚在计划中。

## 🎮 如何使用

1. 打开 **[在线工作室](https://tera-dark.github.io/Bead-Atelier/)**。首次访问可选择进入六步动态教程，随时可以跳过。
2. 点击 **新建画布**，选择 24×24、29×29 或 52×52，设置每 5/10 格分区线和坐标；已有作品建议先备份 JSON。
3. 选择画笔、色板和显示样式创作，也可以使用模板馆或图片转换。连续拖动是一笔，可一次撤销。
4. 切换 **3D 预览** 欣赏成品，或打开 **图纸** 查看色号、分区线及材料数量。
5. 导出 **PNG** 分享作品，或保存 **JSON** 以便下次继续。

### 快捷键

| 快捷键 | 操作 |
| --- | --- |
| `B` | 画笔 |
| `E` | 橡皮擦 |
| `G` | 区域填充 |
| `I` | 吸管取色 |
| `H` / `Space` + 拖动 | 有界平移画布 |
| 2D 画板滚轮 | 鼠标位置为中心缩放（75%–300%） |
| 2D 画板右键拖动 | 平移画布 |
| `Ctrl / Cmd + N` | 新建画布 |
| `Ctrl / Cmd + S` | 下载 JSON 项目备份 |
| `Ctrl / Cmd + Z` | 撤销整笔绘制 |
| `Ctrl / Cmd + Shift + Z` 或 `Ctrl / Cmd + Y` | 重做 |
| 3D 模式右键拖动 | 旋转视角 |
| 3D 模式滚轮 | 缩放视角 |

## 🛠 本地开发

需要 **Node.js 22** 或兼容版本，以及 npm。

```bash
git clone https://github.com/Tera-Dark/Bead-Atelier.git
cd Bead-Atelier
npm install
npm run dev
```

按终端显示的本地地址打开工作室。

```bash
npm run build
npm run preview
```

主要技术：**React 19 · TypeScript · Vite · Three.js · React Three Fiber · Drei · Web Audio API**。静态站点无需后端、数据库或付费 API。

### 自动部署

每次向 `main` 分支推送代码，GitHub Actions 将构建并部署至 GitHub Pages。

- 网站：<https://tera-dark.github.io/Bead-Atelier/>
- 部署工作流：[`deploy.yml`](./.github/workflows/deploy.yml)
- 运行记录：[GitHub Actions](https://github.com/Tera-Dark/Bead-Atelier/actions)

在仓库 **Settings → Pages → Build and deployment** 中将来源设置为 **GitHub Actions**。

## 🧭 后续计划

- [x] 多尺寸底板与画布导航
- [x] 限色、Lab 近似色差、抖动和图片转换预览
- [x] 可打印图纸、色号与材料数量
- [x] 3D 实例化渲染、自动摆放、基础触觉反馈
- [ ] 可拼接底板、专业色彩校准与真实品牌库存
- [ ] 更完善的移动端手势、笔刷交互和无障碍支持
- [ ] 应用界面英文切换

## 💾 数据与隐私

目前作品默认保存在 **当前浏览器的 LocalStorage** 中，图片转换与绘制在本地进行，不需要账号或云端上传。浏览器清理数据、更换设备或使用无痕模式可能导致本地作品不可恢复，建议定期**导出 JSON 项目文件**备份。

## 🤝 反馈与贡献

欢迎通过 [Issues](https://github.com/Tera-Dark/Bead-Atelier/issues) 提交 Bug、功能想法与体验建议。项目仍处于早期迭代阶段，仓库尚未添加正式开源许可证；在许可证确定前请勿默认将代码视为可任意再分发。

---

<div align="center">

*Bead Atelier · A Little World, Bead by Bead.*

[在线体验](https://tera-dark.github.io/Bead-Atelier/) · [English README](./README.en.md) · [GitHub 仓库](https://github.com/Tera-Dark/Bead-Atelier)

</div>
