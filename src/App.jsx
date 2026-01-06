// App.jsx 入口组件，包含主容器与核心逻辑
import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { usePopoverCalculation } from '@/hooks/usePopoverCalculation';
import { useTheme } from '@/hooks/useTheme';
import { Canvas } from '@/components/Canvas';
import { ControlPanel } from '@/components/ControlPanel';

function App() {
  // 主题管理
  const { toggleTheme } = useTheme();

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

  // 快捷键监听：按 D 键切换主题
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 检查是否按下 D 键（不区分大小写）
      if (e.key === 'd' || e.key === 'D') {
        // 检查是否在输入框中，避免在输入时误触发
        const target = e.target;
        const isInputElement = 
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.isContentEditable;
        
        // 如果不在输入框中，则切换主题
        if (!isInputElement) {
          toggleTheme();
        }
      }
    };

    // 添加全局键盘事件监听器
    window.addEventListener('keydown', handleKeyDown);

    // 清理函数：组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme]);

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
      <SpeedInsights />
    </div>
  );
}

export default App;
