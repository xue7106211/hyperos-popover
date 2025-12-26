/**
 * ControlPanel 组件
 * 
 * Popover 位置计算工具的控制面板组件，提供以下功能：
 * 1. 实时显示详细的计算过程和公式
 * 2. 允许用户调整锚点区域（anchorRect）的位置和尺寸
 * 3. 允许用户调整间距参数（边缘留白和锚点间距）
 * 4. 显示 Popover 的最终计算位置和适配状态
 * 
 * 使用 Framer Motion 实现优雅的进入动画效果
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { fadeInUp, stagger } from "@/lib/animations";

/**
 * ControlPanel 组件
 * 
 * @param {Object} props - 组件属性
 * @param {Object} props.anchorRect - 锚点矩形区域
 *   @param {number} props.anchorRect.x - 锚点 X 坐标（相对于画布的左上角）
 *   @param {number} props.anchorRect.y - 锚点 Y 坐标（相对于画布的左上角）
 *   @param {number} props.anchorRect.width - 锚点宽度（像素）
 *   @param {number} props.anchorRect.height - 锚点高度（像素）
 * @param {Object} props.popoverSize - Popover 尺寸（只读，用于显示）
 *   @param {number} props.popoverSize.width - Popover 宽度（像素）
 *   @param {number} props.popoverSize.height - Popover 高度（像素）
 * @param {Object} props.safeRect - 安全区域矩形（只读，用于显示）
 *   @param {number} props.safeRect.x - 安全区域 X 坐标
 *   @param {number} props.safeRect.y - 安全区域 Y 坐标
 *   @param {number} props.safeRect.width - 安全区域宽度
 *   @param {number} props.safeRect.height - 安全区域高度
 * @param {number} props.edgeMargin - 边缘留白（Popover 距离安全区域边缘的最小距离，单位：像素）
 * @param {number} props.anchorGap - 锚点间距（Popover 与锚点之间的最小距离，单位：像素）
 * @param {Object} props.result - 计算结果对象
 *   @param {number} props.result.x - Popover 最终 X 坐标
 *   @param {number} props.result.y - Popover 最终 Y 坐标
 *   @param {boolean} props.result.fits - 是否完全适配在安全区域内
 * @param {string} props.calculationText - 详细的计算过程文本（包含公式和步骤）
 * @param {Function} props.setAnchorRect - 更新锚点区域的函数
 * @param {Function} props.setEdgeMargin - 更新边缘留白的函数
 * @param {Function} props.setAnchorGap - 更新锚点间距的函数
 */
export function ControlPanel({
  anchorRect,
  popoverSize,
  safeRect,
  edgeMargin,
  anchorGap,
  result,
  calculationText,
  setAnchorRect,
  setEdgeMargin,
  setAnchorGap,
}) {
  const [activeTab, setActiveTab] = useState("calculation");

  return (
    // 外层容器：全高度、flex 布局、右侧内边距
    <div className="h-full flex flex-col pr-2">
      {/* 
        动画容器：使用 stagger 动画效果，让子元素依次出现
        initial="hidden" - 初始状态为隐藏
        animate="visible" - 动画到可见状态
        variants={stagger} - 使用交错动画变体，子元素会依次延迟出现
      */}
      <motion.div
        className="flex-1 min-h-0 flex flex-col"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Tabs 容器 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col gap-4">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="calculation">Process</TabsTrigger>
            <TabsTrigger value="anchor">Anchor</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>
          {/* 
            ========== 计算过程展示区域 ==========
            显示 Popover 位置计算的详细步骤和公式
          */}
          <TabsContent value="calculation" className="flex-1 min-h-0 mt-0">
            <motion.div variants={fadeInUp} className="h-full flex flex-col">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="font-mono">Calculation Process</CardTitle>
                  <CardDescription className="font-mono">
                    Detailed position calculation steps and formulas
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                  {/* 
                    计算过程文本容器：
                    - bg-muted: 使用静音背景色
                    - h-full: 填充剩余高度
                    - overflow-y-auto: 垂直方向超出时显示滚动条
                    - font-mono: 等宽字体，适合显示代码和公式
                    - whitespace-pre-wrap: 保留空白字符和换行
                    - break-words: 长单词自动换行
                  */}
                  <div className="bg-muted border border-border p-4 h-full overflow-y-auto rounded-lg scrollbar-subtle">
                    <pre className="font-mono text-xs text-foreground whitespace-pre-wrap break-words m-0 leading-relaxed">
                      {calculationText}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* 
            ========== 锚点区域配置 ==========
            允许用户调整锚点矩形的位置和尺寸
            锚点区域是 Popover 的触发控件或点击命中区域
          */}
          <TabsContent value="anchor" className="flex-1 min-h-0 mt-0">
            <motion.div variants={fadeInUp} className="h-full flex flex-col">
              <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Anchor Rect</CardTitle>
              <CardDescription>
                anchorRect - trigger control or click hit area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 
                第一行：X 和 Y 坐标输入
                grid grid-cols-2: 两列网格布局
              */}
              <div className="grid grid-cols-2 gap-3">
                {/* X 坐标输入 */}
                <div className="space-y-2">
                  <Label htmlFor="anchorX">X</Label>
                  <Input
                    id="anchorX"
                    type="number"
                    value={anchorRect.x}
                    onChange={(e) =>
                      // 更新锚点 X 坐标，保持其他属性不变
                      // parseFloat 转换输入值，无效值默认为 0
                      setAnchorRect({
                        ...anchorRect,
                        x: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="1"
                  />
                </div>
                {/* Y 坐标输入 */}
                <div className="space-y-2">
                  <Label htmlFor="anchorY">Y</Label>
                  <Input
                    id="anchorY"
                    type="number"
                    value={anchorRect.y}
                    onChange={(e) =>
                      // 更新锚点 Y 坐标，保持其他属性不变
                      setAnchorRect({
                        ...anchorRect,
                        y: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="1"
                  />
                </div>
              </div>
              {/* 
                第二行：宽度和高度输入
              */}
              <div className="grid grid-cols-2 gap-3">
                {/* 宽度输入 */}
                <div className="space-y-2">
                  <Label htmlFor="anchorWidth">Width</Label>
                  <Input
                    id="anchorWidth"
                    type="number"
                    value={anchorRect.width}
                    onChange={(e) =>
                      // 更新锚点宽度，保持其他属性不变
                      setAnchorRect({
                        ...anchorRect,
                        width: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="1"
                  />
                </div>
                {/* 高度输入 */}
                <div className="space-y-2">
                  <Label htmlFor="anchorHeight">Height</Label>
                  <Input
                    id="anchorHeight"
                    type="number"
                    value={anchorRect.height}
                    onChange={(e) =>
                      // 更新锚点高度，保持其他属性不变
                      setAnchorRect({
                        ...anchorRect,
                        height: parseFloat(e.target.value) || 0,
                      })
                    }
                    step="1"
                  />
                </div>
              </div>
            </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* 
            ========== 间距参数配置 ==========
            控制 Popover 与安全区域边缘、与锚点之间的间距
          */}
          <TabsContent value="spacing" className="flex-1 min-h-0 mt-0">
            <motion.div variants={fadeInUp} className="h-full flex flex-col">
              <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Spacing Params</CardTitle>
              <CardDescription>
                Edge margin and anchor gap settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 边缘留白设置 */}
              <div className="space-y-2">
                <Label htmlFor="edgeMargin">Edge Margin</Label>
                <Input
                  id="edgeMargin"
                  type="number"
                  value={edgeMargin}
                  onChange={(e) =>
                    // 更新边缘留白值
                    // 边缘留白：Popover 距离安全区域边缘的最小距离
                    // 用于确保 Popover 不会紧贴屏幕边缘
                    setEdgeMargin(parseFloat(e.target.value) || 0)
                  }
                  step="1"
                  min="0"
                />
              </div>
              {/* 锚点间距设置 */}
              <div className="space-y-2">
                <Label htmlFor="anchorGap">Anchor Gap</Label>
                <Input
                  id="anchorGap"
                  type="number"
                  value={anchorGap}
                  onChange={(e) =>
                    // 更新锚点间距值
                    // 锚点间距：Popover 与锚点之间的最小距离
                    // 用于确保 Popover 不会与触发控件重叠
                    setAnchorGap(parseFloat(e.target.value) || 0)
                  }
                  step="1"
                  min="0"
                />
              </div>
            </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* 
            ========== 计算结果展示 ==========
            显示 Popover 的最终计算位置和适配状态
          */}
          <TabsContent value="result" className="flex-1 min-h-0 mt-0">
            <motion.div variants={fadeInUp} className="h-full flex flex-col">
              <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Calculation Result</CardTitle>
              <CardDescription>
                Popover final position and fit status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 结果展示容器 */}
              <div className="bg-muted border border-border p-4 space-y-2 rounded-lg">
                {/* X 坐标显示 */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">X:</span>
                  <span className="font-semibold text-foreground">
                    {/* 保留两位小数显示 X 坐标 */}
                    {result.x.toFixed(2)}
                  </span>
                </div>
                {/* Y 坐标显示 */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Y:</span>
                  <span className="font-semibold text-foreground">
                    {/* 保留两位小数显示 Y 坐标 */}
                    {result.y.toFixed(2)}
                  </span>
                </div>
                {/* 适配状态显示 */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Status:
                  </span>
                  <span
                    className={`font-semibold ${
                      // 根据适配状态显示不同颜色：
                      // fits = true: 使用 accent 颜色（蓝色）显示 "OK"
                      // fits = false: 使用 error 颜色（红色）显示 "ERR"
                      result.fits ? "text-accent" : "text-error"
                    }`}
                  >
                    {result.fits ? "OK" : "ERR"}
                  </span>
                </div>
              </div>
            </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
