# iPadOS Popover 位置计算 Demo

这是一个用于演示和说明 iPadOS Popover 在不同锚点位置下的弹出展示逻辑的 Web Demo。

## 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **shadcn/ui** - UI 组件库
- **Tailwind CSS** - 样式框架

## 功能说明

本 Demo 完全对齐 iPadOS Popover 组件的位置计算规则，包含以下核心参数：

1. **anchorRect**: 锚点在屏幕坐标系中的矩形（触发控件或点击命中区域）
2. **popoverSize**: Popover 最终渲染尺寸
3. **safeRect**: 可用显示区域
4. **edgeMargin**: Popover 距离 safeRect 边缘的最小留白（默认 0dp）
5. **anchorGap**: Popover 与 anchorRect 的最小间距（默认 8dp）

## 位置计算规则

统一原则：**主轴决定"在哪一侧"，副轴用 clamp 在 safeRect 内滑动，保证 Popover 完整可见。**

### 向右弹出（Popover 在锚点右侧）

```
x = anchorRect.maxX + anchorGap
y = clamp(anchorRect.centerY - popoverH/2, safeRect.minY + edgeMargin, safeRect.maxY - edgeMargin - popoverH)
```

**fit 条件**: `x + popoverW <= safeRect.maxX - edgeMargin`

### 向左弹出

```
x = anchorRect.minX - anchorGap - popoverW
y = clamp(anchorRect.centerY - popoverH/2, safeRect.minY + edgeMargin, safeRect.maxY - edgeMargin - popoverH)
```

**fit 条件**: `x >= safeRect.minX + edgeMargin`

### 向下弹出

```
y = anchorRect.maxY + anchorGap
x = clamp(anchorRect.centerX - popoverW/2, safeRect.minX + edgeMargin, safeRect.maxX - edgeMargin - popoverW)
```

**fit 条件**: `y + popoverH <= safeRect.maxY - edgeMargin`

### 向上弹出

```
y = anchorRect.minY - anchorGap - popoverH
x = clamp(anchorRect.centerX - popoverW/2, safeRect.minX + edgeMargin, safeRect.maxX - edgeMargin - popoverW)
```

**fit 条件**: `y >= safeRect.minY + edgeMargin`

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
3. 实时查看计算结果和计算过程
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

研发人员可以直接参考 `src/lib/calculations.js` 中的计算函数（`calculateRight`, `calculateLeft`, `calculateDown`, `calculateUp`）来实现 Popover 的位置计算逻辑。

## Speed Insights

This project includes [Vercel Speed Insights](https://vercel.com/docs/speed-insights) for performance monitoring. Speed Insights is automatically integrated into the application and will track Web Vitals and other key performance metrics.

### Setup

Speed Insights has been configured in the project with the following setup:

1. **Package Installation**: The `@vercel/speed-insights` package is installed as a dependency
2. **React Integration**: The `SpeedInsights` component is imported from `@vercel/speed-insights/react` and added to the App component
3. **Auto-Tracking**: The component automatically tracks performance metrics and sends them to Vercel

The component is placed at the root level of the application in `src/App.jsx`:

```jsx
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <div>
      {/* ... your app content ... */}
      <SpeedInsights />
    </div>
  );
}
```

### Deployment

To view Speed Insights data:

1. Deploy your application to [Vercel](https://vercel.com)
2. Speed Insights will automatically start collecting metrics
3. View your performance data in the [Vercel Dashboard](https://vercel.com/dashboard) under the **Speed Insights** tab

For more information, see the [Vercel Speed Insights documentation](https://vercel.com/docs/speed-insights).

## 特性

- ✅ 实时计算和可视化更新
- ✅ 自动方向选择（根据锚点位置自动选择最佳弹出方向）
- ✅ 点击画布定位锚点
- ✅ 详细的计算过程展示
- ✅ 响应式布局设计
- ✅ 使用 shadcn/ui 组件库，界面美观现代
- ✅ Vercel Speed Insights 集成，性能监控
