import React from "react";
import { LinearGradient, Path, Skia } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

type Props = {
  chartHeight: number;
  chartWidth: number;
  chartMargin: number;
  curvedLines: string[]; // ✅ now supports multiple
  animationGradient: SharedValue<{ x: number; y: number }>;
};

const Gradient = ({
  chartHeight,
  chartWidth,
  chartMargin,
  curvedLines,
  animationGradient,
}: Props) => {
  const getGradientArea = (chartLine: string) => {
    const path = Skia.Path.MakeFromSVGString(chartLine);
    if (!path) return null;

    const firstPoint = path.getPoint(0);

    return path
      .lineTo(chartWidth - chartMargin, chartHeight)
      .lineTo(chartMargin, chartHeight)
      .lineTo(chartMargin, firstPoint.y);
  };
 
  const gradientColors = [ 
    ["#86efac", "#f0fdf4"], // Line 2
    ["#fca5a5", "#fef2f2"], // Line 3
  ];

  return (
    <>
      {curvedLines.map((line, idx) => {
        const gradientPath = getGradientArea(line);
        if (!gradientPath) return null;

        return (
          <Path key={`gradient-${idx}`} path={gradientPath}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={animationGradient}
              colors={gradientColors[idx]}
            />
          </Path>
        );
      })}
    </>
  );
};

export default Gradient;
