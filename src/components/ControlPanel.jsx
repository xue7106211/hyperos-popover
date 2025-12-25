import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      <div className="space-y-4">
        {/* 计算过程 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">计算过程</CardTitle>
            <CardDescription>详细的位置计算步骤和公式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-3 max-h-[750px] overflow-y-auto">
              <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap break-words m-0 leading-relaxed">
                {calculationText}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* 锚点区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">锚点区域</CardTitle>
            <CardDescription>anchorRect - 触发控件或点击命中区域</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="anchorX">X</Label>
                <Input
                  id="anchorX"
                  type="number"
                  value={anchorRect.x}
                  onChange={(e) =>
                    setAnchorRect({ ...anchorRect, x: parseFloat(e.target.value) || 0 })
                  }
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anchorY">Y</Label>
                <Input
                  id="anchorY"
                  type="number"
                  value={anchorRect.y}
                  onChange={(e) =>
                    setAnchorRect({ ...anchorRect, y: parseFloat(e.target.value) || 0 })
                  }
                  step="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="anchorWidth">宽度</Label>
                <Input
                  id="anchorWidth"
                  type="number"
                  value={anchorRect.width}
                  onChange={(e) =>
                    setAnchorRect({ ...anchorRect, width: parseFloat(e.target.value) || 0 })
                  }
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anchorHeight">高度</Label>
                <Input
                  id="anchorHeight"
                  type="number"
                  value={anchorRect.height}
                  onChange={(e) =>
                    setAnchorRect({ ...anchorRect, height: parseFloat(e.target.value) || 0 })
                  }
                  step="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 间距参数 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">间距参数</CardTitle>
            <CardDescription>边缘留白和锚点间距设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="edgeMargin">边缘留白 (edgeMargin)</Label>
              <Input
                id="edgeMargin"
                type="number"
                value={edgeMargin}
                onChange={(e) => setEdgeMargin(parseFloat(e.target.value) || 0)}
                step="1"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anchorGap">锚点间距 (anchorGap)</Label>
              <Input
                id="anchorGap"
                type="number"
                value={anchorGap}
                onChange={(e) => setAnchorGap(parseFloat(e.target.value) || 0)}
                step="1"
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* 计算结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">计算结果</CardTitle>
            <CardDescription>Popover 的最终位置和适配状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">X:</span>
                <span className="font-mono font-semibold text-foreground">{result.x.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Y:</span>
                <span className="font-mono font-semibold text-foreground">{result.y.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">是否适配:</span>
                <span
                  className={`font-semibold ${
                    result.fits ? 'text-green-500 dark:text-green-400' : 'text-destructive'
                  }`}
                >
                  {result.fits ? '是' : '否'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

