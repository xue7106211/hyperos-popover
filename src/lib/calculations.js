// 工具函数：限制值在范围内
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// 计算辅助属性
export function getRectProperties(rect) {
  return {
    minX: rect.x,
    minY: rect.y,
    maxX: rect.x + rect.width,
    maxY: rect.y + rect.height,
    centerX: rect.x + rect.width / 2,
    centerY: rect.y + rect.height / 2,
    width: rect.width,
    height: rect.height,
  };
}

// 计算箭头在 Popover 边缘的位置（相对于 Popover 的坐标）
// arrowPosition: 箭头指向的锚点坐标（全局坐标）
// popoverRect: Popover 的矩形（全局坐标）
// direction: 弹出方向
function calculateArrowPosition(arrowPosition, popoverRect, direction) {
  const arrowX = arrowPosition.x;
  const arrowY = arrowPosition.y;

  // 箭头位置相对于 Popover 的坐标
  let relativeX = 0;
  let relativeY = 0;

  switch (direction) {
    case 'right':
      // 箭头在左侧边缘，指向锚点中心
      relativeX = 0;
      relativeY = clamp(
        arrowY - popoverRect.y,
        8, // 最小距离边缘 8px（箭头大小）
        popoverRect.height - 8
      );
      break;
    case 'left':
      // 箭头在右侧边缘，指向锚点中心
      relativeX = popoverRect.width;
      relativeY = clamp(
        arrowY - popoverRect.y,
        8,
        popoverRect.height - 8
      );
      break;
    case 'down':
      // 箭头在上边缘，指向锚点中心
      relativeX = clamp(
        arrowX - popoverRect.x,
        8,
        popoverRect.width - 8
      );
      relativeY = 0;
      break;
    case 'up':
      // 箭头在下边缘，指向锚点中心
      relativeX = clamp(
        arrowX - popoverRect.x,
        8,
        popoverRect.width - 8
      );
      relativeY = popoverRect.height;
      break;
  }

  return { x: relativeX, y: relativeY };
}

// 计算方向的可用空间和评分
function calculateDirectionScore(direction, anchorRect, popoverSize, safeRect, edgeMargin, anchorGap) {
  const anchor = getRectProperties(anchorRect);
  const safe = getRectProperties(safeRect);

  let availableSpace = 0;
  let fits = false;
  let position = { x: 0, y: 0 };

  switch (direction) {
    case 'right': {
      const idealX = anchor.maxX + anchorGap;
      const idealY = anchor.centerY - popoverSize.height / 2;
      
      const x = idealX;
      const y = clamp(
        idealY,
        safe.minY + edgeMargin,
        safe.maxY - edgeMargin - popoverSize.height
      );
      
      const maxX = safe.maxX - edgeMargin;
      const availableWidth = Math.max(0, maxX - x);
      const availableHeight = Math.min(
        popoverSize.height,
        safe.maxY - edgeMargin - y,
        y + popoverSize.height - (safe.minY + edgeMargin)
      );
      
      availableSpace = availableWidth * availableHeight;
      fits = x + popoverSize.width <= maxX;
      position = { x, y };
      break;
    }
    case 'left': {
      const idealX = anchor.minX - anchorGap - popoverSize.width;
      const idealY = anchor.centerY - popoverSize.height / 2;
      
      const x = idealX;
      const y = clamp(
        idealY,
        safe.minY + edgeMargin,
        safe.maxY - edgeMargin - popoverSize.height
      );
      
      const minX = safe.minX + edgeMargin;
      const availableWidth = Math.max(0, x - minX + popoverSize.width);
      const availableHeight = Math.min(
        popoverSize.height,
        safe.maxY - edgeMargin - y,
        y + popoverSize.height - (safe.minY + edgeMargin)
      );
      
      availableSpace = availableWidth * availableHeight;
      fits = x >= minX;
      position = { x, y };
      break;
    }
    case 'down': {
      const idealX = anchor.centerX - popoverSize.width / 2;
      const idealY = anchor.maxY + anchorGap;
      
      const x = clamp(
        idealX,
        safe.minX + edgeMargin,
        safe.maxX - edgeMargin - popoverSize.width
      );
      const y = idealY;
      
      const maxY = safe.maxY - edgeMargin;
      const availableWidth = Math.min(
        popoverSize.width,
        safe.maxX - edgeMargin - x,
        x + popoverSize.width - (safe.minX + edgeMargin)
      );
      const availableHeight = Math.max(0, maxY - y);
      
      availableSpace = availableWidth * availableHeight;
      fits = y + popoverSize.height <= maxY;
      position = { x, y };
      break;
    }
    case 'up': {
      const idealX = anchor.centerX - popoverSize.width / 2;
      const idealY = anchor.minY - anchorGap - popoverSize.height;
      
      const x = clamp(
        idealX,
        safe.minX + edgeMargin,
        safe.maxX - edgeMargin - popoverSize.width
      );
      const y = idealY;
      
      const minY = safe.minY + edgeMargin;
      const availableWidth = Math.min(
        popoverSize.width,
        safe.maxX - edgeMargin - x,
        x + popoverSize.width - (safe.minX + edgeMargin)
      );
      const availableHeight = Math.max(0, y - minY + popoverSize.height);
      
      availableSpace = availableWidth * availableHeight;
      fits = y >= minY;
      position = { x, y };
      break;
    }
  }

  return {
    score: fits ? availableSpace + 1000000 : availableSpace, // 完全适配的方向给予高分奖励
    fits,
    position,
  };
}

// 计算 Popover 位置（包含箭头位置）
function calculatePositionWithArrow(direction, anchorRect, popoverSize, safeRect, edgeMargin, anchorGap) {
  const anchor = getRectProperties(anchorRect);
  const safe = getRectProperties(safeRect);

  // 计算理想位置（箭头指向锚点中心）
  let idealX, idealY;
  let finalX, finalY;

  switch (direction) {
    case 'right': {
      idealX = anchor.maxX + anchorGap;
      idealY = anchor.centerY - popoverSize.height / 2;
      
      // 应用边界约束
      finalX = idealX;
      finalY = clamp(
        idealY,
        safe.minY + edgeMargin,
        safe.maxY - edgeMargin - popoverSize.height
      );
      break;
    }
    case 'left': {
      idealX = anchor.minX - anchorGap - popoverSize.width;
      idealY = anchor.centerY - popoverSize.height / 2;
      
      finalX = idealX;
      finalY = clamp(
        idealY,
        safe.minY + edgeMargin,
        safe.maxY - edgeMargin - popoverSize.height
      );
      break;
    }
    case 'down': {
      idealX = anchor.centerX - popoverSize.width / 2;
      idealY = anchor.maxY + anchorGap;
      
      finalX = clamp(
        idealX,
        safe.minX + edgeMargin,
        safe.maxX - edgeMargin - popoverSize.width
      );
      finalY = idealY;
      break;
    }
    case 'up': {
      idealX = anchor.centerX - popoverSize.width / 2;
      idealY = anchor.minY - anchorGap - popoverSize.height;
      
      finalX = clamp(
        idealX,
        safe.minX + edgeMargin,
        safe.maxX - edgeMargin - popoverSize.width
      );
      finalY = idealY;
      break;
    }
  }

  // 检查是否完全适配
  const fits =
    finalX >= safe.minX + edgeMargin &&
    finalY >= safe.minY + edgeMargin &&
    finalX + popoverSize.width <= safe.maxX - edgeMargin &&
    finalY + popoverSize.height <= safe.maxY - edgeMargin;

  // 计算箭头位置
  const popoverRect = {
    x: finalX,
    y: finalY,
    width: popoverSize.width,
    height: popoverSize.height,
  };
  const arrowPosition = calculateArrowPosition(
    { x: anchor.centerX, y: anchor.centerY },
    popoverRect,
    direction
  );

  return {
    x: finalX,
    y: finalY,
    arrowX: arrowPosition.x,
    arrowY: arrowPosition.y,
    fits,
  };
}

// 根据方向计算位置（保持 API 兼容性）
export function calculatePosition(params) {
  const { anchorRect, popoverSize, safeRect, edgeMargin, anchorGap, direction } = params;
  return calculatePositionWithArrow(direction, anchorRect, popoverSize, safeRect, edgeMargin, anchorGap);
}

// 自动选择最佳弹出方向（基于可用空间评分）
export function autoSelectDirection(anchorRect, popoverSize, safeRect, edgeMargin, anchorGap) {
  const directions = ['right', 'down', 'left', 'up'];
  const scores = [];

  // 计算所有方向的评分
  for (const dir of directions) {
    const scoreResult = calculateDirectionScore(
      dir,
      anchorRect,
      popoverSize,
      safeRect,
      edgeMargin,
      anchorGap
    );
    scores.push({
      direction: dir,
      score: scoreResult.score,
      fits: scoreResult.fits,
    });
  }

  // 优先选择完全适配的方向
  const fitsScores = scores.filter((s) => s.fits);
  if (fitsScores.length > 0) {
    // 在完全适配的方向中，选择评分最高的
    fitsScores.sort((a, b) => b.score - a.score);
    return fitsScores[0].direction;
  }

  // 如果没有完全适配的方向，选择评分最高的
  scores.sort((a, b) => b.score - a.score);
  return scores[0].direction;
}

// 生成计算过程文本
export function generateCalculationText(params, result, isAutoAdapt) {
  const { anchorRect, popoverSize, safeRect, edgeMargin, anchorGap, direction } = params;
  const anchor = getRectProperties(anchorRect);
  const safe = getRectProperties(safeRect);

  let text = `方向: ${direction === 'right' ? '向右' : direction === 'left' ? '向左' : direction === 'down' ? '向下' : '向上'}`;
  if (isAutoAdapt) {
    text += ` (自动选择)`;
  }
  text += `\n\n`;

  text += `参数:\n`;
  text += `  anchorRect: (${anchorRect.x}, ${anchorRect.y}, ${anchorRect.width}, ${anchorRect.height})\n`;
  text += `  popoverSize: (${popoverSize.width}, ${popoverSize.height})\n`;
  text += `  safeRect: (${safeRect.x}, ${safeRect.y}, ${safeRect.width}, ${safeRect.height})\n`;
  text += `  edgeMargin: ${edgeMargin}\n`;
  text += `  anchorGap: ${anchorGap}\n\n`;

  text += `计算过程:\n`;

  if (direction === 'right') {
    const idealX = anchor.maxX + anchorGap;
    const idealY = anchor.centerY - popoverSize.height / 2;
    
    text += `  理想位置（箭头指向锚点中心）:\n`;
    text += `    idealX = anchorRect.maxX + anchorGap\n`;
    text += `           = ${anchor.maxX} + ${anchorGap}\n`;
    text += `           = ${idealX}\n`;
    text += `    idealY = anchorRect.centerY - popoverH/2\n`;
    text += `           = ${anchor.centerY} - ${popoverSize.height / 2}\n`;
    text += `           = ${idealY}\n\n`;
    
    text += `  应用边界约束:\n`;
    text += `    x = idealX = ${idealX}\n`;
    text += `    y = clamp(idealY, safeRect.minY + edgeMargin, safeRect.maxY - edgeMargin - popoverH)\n`;
    text += `      = clamp(${idealY}, ${safe.minY} + ${edgeMargin}, ${safe.maxY} - ${edgeMargin} - ${popoverSize.height})\n`;
    text += `      = clamp(${idealY}, ${safe.minY + edgeMargin}, ${safe.maxY - edgeMargin - popoverSize.height})\n`;
    text += `      = ${result.y}\n\n`;
    
    text += `  箭头位置（相对于 Popover）:\n`;
    text += `    arrowX = 0 (左侧边缘)\n`;
    text += `    arrowY = clamp(anchorRect.centerY - popoverY, 8, popoverH - 8)\n`;
    text += `           = clamp(${anchor.centerY} - ${result.y}, 8, ${popoverSize.height} - 8)\n`;
    text += `           = clamp(${anchor.centerY - result.y}, 8, ${popoverSize.height - 8})\n`;
    text += `           = ${result.arrowY || 0}\n\n`;
    
    text += `  适配检查:\n`;
    text += `    fits = (x + popoverW <= safeRect.maxX - edgeMargin)\n`;
    text += `        = (${result.x} + ${popoverSize.width} <= ${safe.maxX} - ${edgeMargin})\n`;
    text += `        = (${result.x + popoverSize.width} <= ${safe.maxX - edgeMargin})\n`;
    text += `        = ${result.fits}\n`;
  } else if (direction === 'left') {
    const idealX = anchor.minX - anchorGap - popoverSize.width;
    const idealY = anchor.centerY - popoverSize.height / 2;
    
    text += `  理想位置（箭头指向锚点中心）:\n`;
    text += `    idealX = anchorRect.minX - anchorGap - popoverW\n`;
    text += `           = ${anchor.minX} - ${anchorGap} - ${popoverSize.width}\n`;
    text += `           = ${idealX}\n`;
    text += `    idealY = anchorRect.centerY - popoverH/2\n`;
    text += `           = ${anchor.centerY} - ${popoverSize.height / 2}\n`;
    text += `           = ${idealY}\n\n`;
    
    text += `  应用边界约束:\n`;
    text += `    x = idealX = ${idealX}\n`;
    text += `    y = clamp(idealY, safeRect.minY + edgeMargin, safeRect.maxY - edgeMargin - popoverH)\n`;
    text += `      = clamp(${idealY}, ${safe.minY} + ${edgeMargin}, ${safe.maxY} - ${edgeMargin} - ${popoverSize.height})\n`;
    text += `      = clamp(${idealY}, ${safe.minY + edgeMargin}, ${safe.maxY - edgeMargin - popoverSize.height})\n`;
    text += `      = ${result.y}\n\n`;
    
    text += `  箭头位置（相对于 Popover）:\n`;
    text += `    arrowX = popoverW (右侧边缘)\n`;
    text += `    arrowY = clamp(anchorRect.centerY - popoverY, 8, popoverH - 8)\n`;
    text += `           = clamp(${anchor.centerY} - ${result.y}, 8, ${popoverSize.height} - 8)\n`;
    text += `           = clamp(${anchor.centerY - result.y}, 8, ${popoverSize.height - 8})\n`;
    text += `           = ${result.arrowY || 0}\n\n`;
    
    text += `  适配检查:\n`;
    text += `    fits = (x >= safeRect.minX + edgeMargin)\n`;
    text += `        = (${result.x} >= ${safe.minX} + ${edgeMargin})\n`;
    text += `        = (${result.x} >= ${safe.minX + edgeMargin})\n`;
    text += `        = ${result.fits}\n`;
  } else if (direction === 'down') {
    const idealX = anchor.centerX - popoverSize.width / 2;
    const idealY = anchor.maxY + anchorGap;
    
    text += `  理想位置（箭头指向锚点中心）:\n`;
    text += `    idealX = anchorRect.centerX - popoverW/2\n`;
    text += `           = ${anchor.centerX} - ${popoverSize.width / 2}\n`;
    text += `           = ${idealX}\n`;
    text += `    idealY = anchorRect.maxY + anchorGap\n`;
    text += `           = ${anchor.maxY} + ${anchorGap}\n`;
    text += `           = ${idealY}\n\n`;
    
    text += `  应用边界约束:\n`;
    text += `    x = clamp(idealX, safeRect.minX + edgeMargin, safeRect.maxX - edgeMargin - popoverW)\n`;
    text += `      = clamp(${idealX}, ${safe.minX} + ${edgeMargin}, ${safe.maxX} - ${edgeMargin} - ${popoverSize.width})\n`;
    text += `      = clamp(${idealX}, ${safe.minX + edgeMargin}, ${safe.maxX - edgeMargin - popoverSize.width})\n`;
    text += `      = ${result.x}\n`;
    text += `    y = idealY = ${idealY}\n\n`;
    
    text += `  箭头位置（相对于 Popover）:\n`;
    text += `    arrowX = clamp(anchorRect.centerX - popoverX, 8, popoverW - 8)\n`;
    text += `           = clamp(${anchor.centerX} - ${result.x}, 8, ${popoverSize.width} - 8)\n`;
    text += `           = clamp(${anchor.centerX - result.x}, 8, ${popoverSize.width - 8})\n`;
    text += `           = ${result.arrowX || 0}\n`;
    text += `    arrowY = 0 (上边缘)\n\n`;
    
    text += `  适配检查:\n`;
    text += `    fits = (y + popoverH <= safeRect.maxY - edgeMargin)\n`;
    text += `        = (${result.y} + ${popoverSize.height} <= ${safe.maxY} - ${edgeMargin})\n`;
    text += `        = (${result.y + popoverSize.height} <= ${safe.maxY - edgeMargin})\n`;
    text += `        = ${result.fits}\n`;
  } else if (direction === 'up') {
    const idealX = anchor.centerX - popoverSize.width / 2;
    const idealY = anchor.minY - anchorGap - popoverSize.height;
    
    text += `  理想位置（箭头指向锚点中心）:\n`;
    text += `    idealX = anchorRect.centerX - popoverW/2\n`;
    text += `           = ${anchor.centerX} - ${popoverSize.width / 2}\n`;
    text += `           = ${idealX}\n`;
    text += `    idealY = anchorRect.minY - anchorGap - popoverH\n`;
    text += `           = ${anchor.minY} - ${anchorGap} - ${popoverSize.height}\n`;
    text += `           = ${idealY}\n\n`;
    
    text += `  应用边界约束:\n`;
    text += `    x = clamp(idealX, safeRect.minX + edgeMargin, safeRect.maxX - edgeMargin - popoverW)\n`;
    text += `      = clamp(${idealX}, ${safe.minX} + ${edgeMargin}, ${safe.maxX} - ${edgeMargin} - ${popoverSize.width})\n`;
    text += `      = clamp(${idealX}, ${safe.minX + edgeMargin}, ${safe.maxX - edgeMargin - popoverSize.width})\n`;
    text += `      = ${result.x}\n`;
    text += `    y = idealY = ${idealY}\n\n`;
    
    text += `  箭头位置（相对于 Popover）:\n`;
    text += `    arrowX = clamp(anchorRect.centerX - popoverX, 8, popoverW - 8)\n`;
    text += `           = clamp(${anchor.centerX} - ${result.x}, 8, ${popoverSize.width} - 8)\n`;
    text += `           = clamp(${anchor.centerX - result.x}, 8, ${popoverSize.width - 8})\n`;
    text += `           = ${result.arrowX || 0}\n`;
    text += `    arrowY = popoverH (下边缘)\n\n`;
    
    text += `  适配检查:\n`;
    text += `    fits = (y >= safeRect.minY + edgeMargin)\n`;
    text += `        = (${result.y} >= ${safe.minY} + ${edgeMargin})\n`;
    text += `        = (${result.y} >= ${safe.minY + edgeMargin})\n`;
    text += `        = ${result.fits}\n`;
  }

  return text;
}
