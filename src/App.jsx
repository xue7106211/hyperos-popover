import { usePopoverCalculation } from '@/hooks/usePopoverCalculation';
import { Canvas } from '@/components/Canvas';
import { ControlPanel } from '@/components/ControlPanel';

function App() {
  const {
    anchorRect,
    popoverSize,
    safeRect,
    edgeMargin,
    anchorGap,
    result,
    calculationText,
    setAnchorRect,
    setSafeRect,
    setEdgeMargin,
    setAnchorGap,
  } = usePopoverCalculation();

  const handleAnchorClick = ({ x, y }) => {
    setAnchorRect({ ...anchorRect, x, y });
  };

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 min-h-0 flex gap-6 flex-col lg:flex-row">
        <div className="flex-1 min-h-0">
          <Canvas
            anchorRect={anchorRect}
            popoverSize={popoverSize}
            safeRect={safeRect}
            result={result}
            onAnchorClick={handleAnchorClick}
            onSafeRectChange={setSafeRect}
          />
        </div>
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

