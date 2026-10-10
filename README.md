<div align="center">

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
| 平面编辑 | 默认使用 2D 拼豆画板，点击或拖动绘制 |
| 立体预览 | Three.js 3D 拼豆、底板、光照与相机视角 |
| 绘图工具 | 画笔、橡皮擦、区域填充、吸管、撤销与重做 |
| 色板 | 内置 16 色示例色板 |
| 图片转拼豆 | 上传图片，居中裁切并转换为 24 × 24 拼豆图案 |
| 创作辅助 | 平面网格开关、缩放与快捷键 |
| 作品管理 | 自动保存到浏览器、JSON 项目导入和导出 |
| 成品导出 | PNG 图片导出，统计已用拼豆数量与颜色数 |
| 氛围体验 | 可自主开启的轻柔程序合成音乐、可调音量 |
| 界面 | 默认简体中文，兼顾电脑及移动端布局 |

> **当前版本说明：** 画板暂时固定为 **24 × 24**；16 色属于演示色板，尚未对齐任何真实拼豆品牌的色号；图片转换目前是基础 RGB 最近色匹配，并非专业色彩校准。首次使用背景音乐需要用户主动开启。

## 🎮 如何使用

1. 点击 **[在线工作室](https://tera-dark.github.io/Bead-Atelier/)**，无需登录。
2. 选择颜色与画笔，在默认的 **平面编辑** 模式中绘制；也可以导入图片生成初始图案。
3. 切换到 **3D 预览**，从不同角度欣赏拼豆。
4. 导出 **PNG** 分享作品，或保存 **JSON** 以便日后继续修改。

### 快捷键

| 快捷键 | 操作 |
| --- | --- |
| `B` | 画笔 |
| `E` | 橡皮擦 |
| `G` | 区域填充 |
| `I` | 吸管取色 |
| `Ctrl / Cmd + Z` | 撤销 |
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

- [ ] 支持不同尺寸与可拼接底板
- [ ] 真实拼豆品牌色板、色号与库存管理
- [ ] 更精确的颜色匹配、抖动算法与转换预览
- [ ] 按颜色分步拼豆、区域进度标记与材料统计
- [ ] 提升 3D 大画板性能、材质表现与动效手感
- [ ] 可打印拼豆图纸与更多导出选项
- [ ] 更完整的移动端手势与无障碍支持
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
