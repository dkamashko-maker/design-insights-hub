import { useMemo } from "react";
import { Line, Text } from "react-konva";
import { GRID_SIZE_PX } from "@/constants/planner";

interface Props {
  width: number;
  height: number;
  scale: number;
}

const GridLayer = ({ width, height, scale }: Props) => {
  const elements = useMemo(() => {
    const lines: JSX.Element[] = [];
    const vw = width / scale + 2000;
    const vh = height / scale + 2000;
    const startX = -1000;
    const startY = -1000;

    for (let x = Math.floor(startX / GRID_SIZE_PX) * GRID_SIZE_PX; x < startX + vw; x += GRID_SIZE_PX) {
      const isMajor = x % (GRID_SIZE_PX * 5) === 0;
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, startY, x, startY + vh]}
          stroke={isMajor ? "rgba(0,128,128,0.2)" : "rgba(0,128,128,0.08)"}
          strokeWidth={isMajor ? 1 : 0.5}
          listening={false}
        />
      );
      if (isMajor && x > 0) {
        lines.push(
          <Text key={`vt-${x}`} x={x + 2} y={2} text={`${Math.round(x / 3)}`} fontSize={10} fill="rgba(0,128,128,0.5)" listening={false} />
        );
      }
    }

    for (let y = Math.floor(startY / GRID_SIZE_PX) * GRID_SIZE_PX; y < startY + vh; y += GRID_SIZE_PX) {
      const isMajor = y % (GRID_SIZE_PX * 5) === 0;
      lines.push(
        <Line
          key={`h-${y}`}
          points={[startX, y, startX + vw, y]}
          stroke={isMajor ? "rgba(0,128,128,0.2)" : "rgba(0,128,128,0.08)"}
          strokeWidth={isMajor ? 1 : 0.5}
          listening={false}
        />
      );
      if (isMajor && y > 0) {
        lines.push(
          <Text key={`ht-${y}`} x={2} y={y + 2} text={`${Math.round(y / 3)}`} fontSize={10} fill="rgba(0,128,128,0.5)" listening={false} />
        );
      }
    }
    return lines;
  }, [width, height, scale]);

  return <>{elements}</>;
};

export default GridLayer;
