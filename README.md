# iPadOS Popover 位置计算 Demo

这个 Web Demo 演示 iPadOS Popover 在不同锚点位置下往哪边弹、落在哪里。

## 技术栈

React 18、Vite、shadcn/ui、Tailwind CSS。

## 功能说明

Demo 按 iPadOS Popover 的位置计算规则实现，用到 5 个参数：

1. `anchorRect`：锚点在屏幕坐标系中的矩形（触发控件或点击命中区域）
2. `popoverSize`：Popover 最终渲染尺寸
3. `safeRect`：可用显示区域
4. `edgeMargin`：Popover 距离 safeRect 边缘的最小留白（默认 0dp）
5. `anchorGap`：Popover 与 anchorRect 的最小间距（默认 8dp）

## 位置计算规则

四个方向用同一条规则：主轴决定 Popover 在锚点哪一侧，副轴用 clamp 限制在 safeRect 内，Popover 不会被裁掉。

### 向右弹出（Popover 在锚点右侧）

```
x = anchorRect.maxX + anchorGap
y = clamp(anchorRect.centerY - popoverH/2, safeRect.minY + edgeMargin, safeRect.maxY - edgeMargin - popoverH)
```

放得下的条件：`x + popoverW <= safeRect.maxX - edgeMargin`

### 向左弹出

```
x = anchorRect.minX - anchorGap - popoverW
y = clamp(anchorRect.centerY - popoverH/2, safeRect.minY + edgeMargin, safeRect.maxY - edgeMargin - popoverH)
```

放得下的条件：`x >= safeRect.minX + edgeMargin`

### 向下弹出

```
y = anchorRect.maxY + anchorGap
x = clamp(anchorRect.centerX - popoverW/2, safeRect.minX + edgeMargin, safeRect.maxX - edgeMargin - popoverW)
```

放得下的条件：`y + popoverH <= safeRect.maxY - edgeMargin`

### 向上弹出

```
y = anchorRect.minY - anchorGap - popoverH
x = clamp(anchorRect.centerX - popoverW/2, safeRect.minX + edgeMargin, safeRect.maxX - edgeMargin - popoverW)
```

放得下的条件：`y >= safeRect.minY + edgeMargin`

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用方法

1. 启动开发服务器后，在浏览器中打开应用
2. 在右侧控制面板中调整各项参数：
   - 锚点区域的位置和尺寸
   - Popover 的尺寸
   - 安全区域的位置和尺寸
   - 边缘留白和锚点间距
   - 弹出方向（右/左/下/上）或启用自动适应
3. 右侧面板会同步显示计算结果和每一步公式
4. 点击画布任意位置可快速定位锚点
5. 当 Popover 超出安全区域时，会显示红色边框和警告提示

## 项目结构

```
hyperos-popover/
├── src/
│   ├── components/          # React 组件
│   │   ├── ui/              # shadcn/ui 组件
│   │   ├── Canvas.jsx       # 画布可视化组件
│   │   └── ControlPanel.jsx # 控制面板组件
│   ├── hooks/               # React Hooks
│   │   └── usePopoverCalculation.js
│   ├── lib/                 # 工具函数
│   │   ├── calculations.js  # 计算逻辑
│   │   └── utils.js         # 通用工具
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── components.json          # shadcn/ui 配置
```

## 研发使用

研发实现时可以直接照抄 `src/lib/calculations.js` 里的（`calculateRight`, `calculateLeft`, `calculateDown`, `calculateUp`）。

## 特性

- 改参数后画布和结果立即更新
- 自动模式优先选放得下的方向，再在其中挑剩余空间最大的一侧
- 点画布任意位置移动锚点
- 右侧面板列出每一步的计算公式和代入值
- 窄屏时控制面板移到画布下方
