import { useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function Canvas({ anchorRect, popoverSize, safeRect, result, onAnchorClick, onSafeRectChange }) {
  const canvasRef = useRef(null);
  const anchorRef = useRef(null);

  // 监听画布尺寸变化，自动更新安全区域
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSafeRect = () => {
      const rect = canvas.getBoundingClientRect();
      const newSafeRect = {
        x: 0,
        y: 0,
        width: rect.width,
        height: rect.height,
      };
      onSafeRectChange?.(newSafeRect);
    };

    // 初始设置
    updateSafeRect();

    // 使用 ResizeObserver 监听尺寸变化
    const resizeObserver = new ResizeObserver(updateSafeRect);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onSafeRectChange]);

  const handleCanvasClick = useCallback(
    (e) => {
      if (e.target === anchorRef.current || e.target.closest('[data-anchor]')) {
        return;
      }
      if (e.target.id === 'popover' || e.target.id === 'safeRect') {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const clickX = e.clientX - canvasRect.left;
      const clickY = e.clientY - canvasRect.top;

      const newX = clickX - anchorRect.width / 2;
      const newY = clickY - anchorRect.height / 2;

      onAnchorClick({ x: Math.round(newX), y: Math.round(newY) });
    },
    [anchorRect.width, anchorRect.height, onAnchorClick]
  );

  const handleAnchorClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div className="h-full">
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 min-h-0 p-6">
          <div
            ref={canvasRef}
            className="relative w-full h-full bg-muted/30 border border-border rounded-md cursor-crosshair"
            onClick={handleCanvasClick}
          >
        {/* Safe Rect */}
        <div
          id="safeRect"
          className="absolute bg-muted/20 border-2 border-dashed border-border pointer-events-none"
          style={{
            left: `${safeRect.x}px`,
            top: `${safeRect.y}px`,
            width: `${safeRect.width}px`,
            height: `${safeRect.height}px`,
          }}
        />

        {/* Anchor Rect */}
        <div
          ref={anchorRef}
          data-anchor
          className="absolute bg-transparent border-2 border-black cursor-move transition-all rounded-[12px]"
          style={{
            left: `${anchorRect.x}px`,
            top: `${anchorRect.y}px`,
            width: `${anchorRect.width}px`,
            height: `${anchorRect.height}px`,
          }}
          onClick={handleAnchorClick}
        >
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-black pointer-events-none">
            锚
          </span>
        </div>

        {/* Popover */}
        <div
          id="popover"
          className={`absolute bg-popover border-2 rounded-lg shadow-lg pointer-events-none transition-all ${
            result.fits
              ? 'border-green-500 dark:border-green-600'
              : 'border-destructive bg-destructive/10'
          }`}
          style={{
            left: `${result.x}px`,
            top: `${result.y}px`,
            width: `${popoverSize.width}px`,
            height: `${popoverSize.height}px`,
          }}
        >
          <span className="absolute top-2 left-2 text-xs text-popover-foreground font-medium">
            Popover
          </span>
          {!result.fits && (
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-destructive whitespace-nowrap">
              超出安全区域
            </span>
          )}
        </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

