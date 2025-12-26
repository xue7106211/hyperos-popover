import { useState, useEffect, useMemo } from 'react';
import {
  calculatePosition,
  autoSelectDirection,
  generateCalculationText,
} from '@/lib/calculations';

export function usePopoverCalculation() {
  const [anchorRect, setAnchorRect] = useState({ x: 100, y: 100, width: 44, height: 44 });
  const [popoverSize] = useState({ width: 240, height: 360 });
  const [safeRect, setSafeRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [edgeMargin, setEdgeMargin] = useState(24);
  const [anchorGap, setAnchorGap] = useState(8);
  const [direction, setDirection] = useState('right');
  const [autoAdapt, setAutoAdapt] = useState(true);
  const [selectedPadSize, setSelectedPadSize] = useState(null);

  // 自动选择方向
  useEffect(() => {
    if (autoAdapt) {
      const bestDirection = autoSelectDirection(
        anchorRect,
        popoverSize,
        safeRect,
        edgeMargin,
        anchorGap
      );
      setDirection(bestDirection);
    }
  }, [autoAdapt, anchorRect, popoverSize, safeRect, edgeMargin, anchorGap]);

  // 计算位置
  const result = useMemo(() => {
    return calculatePosition({
      anchorRect,
      popoverSize,
      safeRect,
      edgeMargin,
      anchorGap,
      direction,
    });
  }, [anchorRect, popoverSize, safeRect, edgeMargin, anchorGap, direction]);

  // 生成计算过程文本
  const calculationText = useMemo(() => {
    return generateCalculationText(
      {
        anchorRect,
        popoverSize,
        safeRect,
        edgeMargin,
        anchorGap,
        direction,
      },
      result,
      autoAdapt
    );
  }, [anchorRect, popoverSize, safeRect, edgeMargin, anchorGap, direction, result, autoAdapt]);

  const handleDirectionChange = (newDirection) => {
    setAutoAdapt(false);
    setDirection(newDirection);
  };

  // Handle Pad size selection
  // Note: safeRect will be updated by Canvas component based on scaled dimensions
  const handlePadSizeChange = (padSizeKey) => {
    setSelectedPadSize(padSizeKey);
  };

  return {
    // 状态
    anchorRect,
    popoverSize,
    safeRect,
    edgeMargin,
    anchorGap,
    result,
    calculationText,
    selectedPadSize,
    // 更新函数
    setAnchorRect,
    setSafeRect,
    setEdgeMargin,
    setAnchorGap,
    setSelectedPadSize: handlePadSizeChange,
  };
}

