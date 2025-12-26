import { useRef, useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PAD_SIZES, PAD_SIZE_KEYS } from '@/lib/constants';

export function Canvas({ anchorRect, popoverSize, safeRect, result, onAnchorClick, onSafeRectChange, selectedPadSize, setSelectedPadSize }) {
  const canvasRef = useRef(null);
  const anchorRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // 计算缩放比例和更新安全区域
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateScaleAndSafeRect = () => {
      if (selectedPadSize !== null) {
        // Pad 尺寸模式：计算缩放比例
        const padSize = PAD_SIZES[selectedPadSize];
        const containerRect = container.getBoundingClientRect();
        const availableWidth = containerRect.width;
        const availableHeight = containerRect.height;

        // 计算缩放比例，保持宽高比
        const scaleX = availableWidth / padSize.width;
        const scaleY = availableHeight / padSize.height;
        const newScale = Math.min(scaleX, scaleY, 1); // 不放大，只缩小

        // 计算缩放后的实际尺寸
        const scaledWidth = padSize.width * newScale;
        const scaledHeight = padSize.height * newScale;

        // 计算居中偏移
        const offsetX = (availableWidth - scaledWidth) / 2;
        const offsetY = (availableHeight - scaledHeight) / 2;

        setScale(newScale);
        setCanvasOffset({ x: offsetX, y: offsetY });

        // 更新安全区域为缩放后的尺寸
        onSafeRectChange?.({
          x: 0,
          y: 0,
          width: scaledWidth,
          height: scaledHeight,
        });
      } else {
        // 自动模式：使用实际尺寸
        setScale(1);
        setCanvasOffset({ x: 0, y: 0 });

        const rect = canvas.getBoundingClientRect();
        onSafeRectChange?.({
          x: 0,
          y: 0,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // 初始设置
    updateScaleAndSafeRect();

    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(updateScaleAndSafeRect);
    resizeObserver.observe(container);
    if (selectedPadSize === null) {
      resizeObserver.observe(canvas);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [onSafeRectChange, selectedPadSize]);

  const handleCanvasClick = useCallback(
    (e) => {
      if (e.target === anchorRef.current || e.target.closest('[data-anchor]')) {
        return;
      }
      if (e.target.id === 'popover' || e.target.id === 'safeRect') {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      // 计算相对于容器的点击位置
      const clickX = e.clientX - containerRect.left - canvasOffset.x;
      const clickY = e.clientY - containerRect.top - canvasOffset.y;

      // 如果使用了缩放，需要将坐标转换回原始尺寸
      const scaledX = selectedPadSize ? clickX / scale : clickX;
      const scaledY = selectedPadSize ? clickY / scale : clickY;

      const newX = scaledX - anchorRect.width / 2;
      const newY = scaledY - anchorRect.height / 2;

      onAnchorClick({ x: Math.round(newX), y: Math.round(newY) });
    },
    [anchorRect.width, anchorRect.height, onAnchorClick, scale, canvasOffset, selectedPadSize]
  );

  const handleAnchorClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Get current Pad size dimensions if selected
  const padSize = selectedPadSize ? PAD_SIZES[selectedPadSize] : null;
  
  // Canvas style based on mode
  const canvasStyle = padSize
    ? {
        width: `${padSize.width}px`,
        height: `${padSize.height}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'absolute',
        left: `${canvasOffset.x}px`,
        top: `${canvasOffset.y}px`,
      }
    : {
        width: '100%',
        height: '100%',
      };

  return (
    <div className="h-full">
      <Card className="h-full flex flex-col rounded-[28px]">
        {/* Pad Size Selector */}
        <div className="px-4 pt-4 pb-0 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground uppercase">Pad Size:</span>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setSelectedPadSize(null)}
                className={`px-3 py-1.5 text-xs font-mono uppercase rounded-md transition-all ${
                  selectedPadSize === null
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Auto
              </button>
              {PAD_SIZE_KEYS.map((key) => {
                const pad = PAD_SIZES[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPadSize(key)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase rounded-md transition-all ${
                      selectedPadSize === key
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    title={`${pad.width} × ${pad.height}px`}
                  >
                    {pad.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <CardContent className="flex-1 min-h-0 p-4">
          <div
            ref={containerRef}
            className="relative w-full h-full"
            onClick={handleCanvasClick}
          >
            <div
              ref={canvasRef}
              className="relative bg-[var(--background)] border border-[var(--border)] cursor-crosshair font-mono concentric-rounded"
              style={{
                ...canvasStyle,
                backgroundImage: `
                  linear-gradient(rgba(133, 235, 255, 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(133, 235, 255, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            >
        {/* Safe Rect */}
        <div
          id="safeRect"
          className="absolute bg-transparent border border-dashed border-[var(--muted)] pointer-events-none"
          style={{
            left: `${safeRect.x}px`,
            top: `${safeRect.y}px`,
            width: `${safeRect.width}px`,
            height: `${safeRect.height}px`,
          }}
        >
          <span className="absolute -top-5 left-0 text-xs text-[var(--muted-foreground)] font-mono uppercase">
            SAFE_RECT
          </span>
        </div>

        {/* Anchor Rect */}
        <div
          ref={anchorRef}
          data-anchor
          className="absolute bg-[var(--card)] border-2 border-[var(--foreground)] cursor-move transition-all duration-200 ease-out rounded-[8px]"
          style={{
            left: `${anchorRect.x}px`,
            top: `${anchorRect.y}px`,
            width: `${anchorRect.width}px`,
            height: `${anchorRect.height}px`,
            boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
            borderColor: 'rgba(133, 235, 255, 1)',
          }}
          onClick={handleAnchorClick}
        >
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-mono font-medium text-[var(--foreground)] uppercase pointer-events-none text-glow" style={{ fontSize: '9px', color: 'rgba(133, 235, 255, 1)' }}>
            ANCHOR
          </span>
        </div>

        {/* Popover */}
        <div
          id="popover"
          className={`absolute bg-[var(--popover)] border-2 pointer-events-none transition-all duration-200 ease-out rounded-[12px] ${
            result.fits
              ? 'border-[var(--foreground)]'
              : 'border-[var(--error)]'
          }`}
          style={{
            left: `${result.x}px`,
            top: `${result.y}px`,
            width: `${popoverSize.width}px`,
            height: `${popoverSize.height}px`,
            boxShadow: '0px 7px 16px 0px rgba(0, 0, 0, 0.15)',
            borderColor: 'rgba(133, 235, 255, 1)',
          }}
        >
          <span className="absolute top-2 left-2 text-xs text-[var(--popover-foreground)] font-mono font-medium uppercase text-glow" style={{ color: 'rgba(133, 235, 255, 1)' }}>
            POPOVER
          </span>
          <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono uppercase whitespace-nowrap ${
            result.fits ? 'text-[var(--foreground)]' : 'text-[var(--error)]'
          }`}>
            {result.fits ? '[OK]' : '[ERR] OUT_OF_BOUNDS'}
          </span>
        </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

