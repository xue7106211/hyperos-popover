// App.jsx 入口组件，包含主容器与核心逻辑
import { usePopoverCalculation } from '@/hooks/usePopoverCalculation';
import { Canvas } from '@/components/Canvas';
import { ControlPanel } from '@/components/ControlPanel';

function App() {
  // 解构自定义 Hook 的状态与方法
  const {
    anchorRect,        // 锚点矩形
    popoverSize,       // 弹窗尺寸
    safeRect,          // 可用显示区域
    edgeMargin,        // 边缘最小留白
    anchorGap,         // 锚点与弹窗的最小间距
    result,            // 位置计算结果
    calculationText,   // 计算公式文案
    selectedPadSize,   // 选中的 Pad 尺寸
    setAnchorRect,     // 设置锚点
    setSafeRect,       // 设置可用区域
    setEdgeMargin,     // 设置边缘留白
    setAnchorGap,      // 设置锚点弹窗间距
    setSelectedPadSize, // 设置 Pad 尺寸
  } = usePopoverCalculation();

  // 处理点击画布设置锚点位置
  const handleAnchorClick = ({ x, y }) => {
    setAnchorRect({ ...anchorRect, x, y });
  };

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col relative z-10">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6 flex-1 min-h-0 flex gap-6 flex-col lg:flex-row">
        {/* 可视化区域 */}
        <div className="flex-1 min-h-0">
          <Canvas
            anchorRect={anchorRect}
            popoverSize={popoverSize}
            safeRect={safeRect}
            result={result}
            onAnchorClick={handleAnchorClick}
            onSafeRectChange={setSafeRect}
            selectedPadSize={selectedPadSize}
            setSelectedPadSize={setSelectedPadSize}
          />
        </div>
        {/* 控制面板区域 */}
        <div className="lg:w-[400px] min-h-0">
          <ControlPanel
            anchorRect={anchorRect}
            popoverSize={popoverSize}
            safeRect={safeRect}
            edgeMargin={edgeMargin}
            anchorGap={anchorGap}
            result={result}
            calculationText={calculationText}
            setAnchorRect={setAnchorRect}
            setEdgeMargin={setEdgeMargin}
            setAnchorGap={setAnchorGap}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
