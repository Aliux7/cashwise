import React, { useEffect, useState } from "react";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { curveBasis, line, scaleLinear, scalePoint } from "d3";
import {
  SharedValue,
  clamp,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { getYForX, parse } from "react-native-redash";
import Cursor from "./Cursor";
import Gradient from "./Gradient";

export type DataType = {
  label: string;
  date: string;
  value: number;
};

export type MultiDataSet = {
  label: string;
  color: string;
  data: DataType[];
};

type Props = {
  chartWidth: number;
  chartHeight: number;
  chartMargin: number;
  datasets: MultiDataSet[];
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedValue: SharedValue<number>;
  selectedLabel: SharedValue<string>;
};

const LineChart = ({
  chartHeight,
  chartMargin,
  chartWidth,
  datasets,
  setSelectedDate,
  selectedValue,
  selectedLabel,
}: Props) => {
  const [showCursor, setShowCursor] = useState(false);
  const animationLine = useSharedValue(0);
  const animationGradient = useSharedValue({ x: 0, y: 0 });
  const cx = useSharedValue(20);
  const cy = useSharedValue(0);

  const primaryData = datasets[0].data;
  const totalValue = primaryData.reduce((acc, cur) => acc + cur.value, 0);

  useEffect(() => {
    animationLine.value = withTiming(1, { duration: 1000 });
    animationGradient.value = withDelay(
      1000,
      withTiming({ x: 0, y: chartHeight }, { duration: 500 })
    );
    selectedValue.value = withTiming(totalValue);
    selectedLabel.value = "Total Last 6 Months";
  }, []);

  const allLabels = primaryData.map((d) => d.label);
  const allValues = datasets.flatMap((ds) => ds.data.map((d) => d.value));

  const x = scalePoint()
    .domain(allLabels)
    .range([chartMargin, chartWidth - chartMargin])
    .padding(0);

  const y = scaleLinear()
    .domain([Math.min(...allValues) * 0.9, Math.max(...allValues) * 1.1])
    .range([chartHeight, 0]);

  const stepX = x.step();

  const curvedLines = datasets.map(({ data }) =>
    line<DataType>()
      .x((d) => x(d.label)!)
      .y((d) => y(d.value))
      .curve(curveBasis)(data)
  );

  const filteredCurvedLines = curvedLines.filter(
    (line): line is string => line !== null
  );

  const linePaths = curvedLines.map((d) => Skia.Path.MakeFromSVGString(d!));

  const parsedPaths = linePaths.map((p) => parse(p!.toSVGString()));

  // 🟢 Always define derived Y values (one per line)
  const cyList = parsedPaths.map((path) =>
    useDerivedValue(() => getYForX(path, Math.floor(cx.value)) ?? 0)
  );

  const handleGestureEvent = (e: PanGestureHandlerEventPayload) => {
    "worklet";
    const index = Math.floor(e.absoluteX / stepX);
    const clampedIndex = Math.max(0, Math.min(index, primaryData.length - 1));
    const point = primaryData[clampedIndex];

    runOnJS(setSelectedDate)(point.date);
    selectedLabel.value = point.label;

    const clampValue = clamp(
      clampedIndex * stepX + chartMargin,
      chartMargin,
      chartWidth - chartMargin
    );

    // Use first dataset for label/value
    selectedValue.value = withTiming(primaryData[clampedIndex].value);
    cx.value = clampValue;
  };

  const pan = Gesture.Pan()
    .onTouchesDown(() => {
      runOnJS(setShowCursor)(true);
    })
    .onTouchesUp(() => {
      runOnJS(setShowCursor)(false);
      selectedValue.value = withTiming(totalValue);
      selectedLabel.value = "Total Last 6 Months";
      runOnJS(setSelectedDate)("Total");
    })
    .onBegin(handleGestureEvent)
    .onChange(handleGestureEvent);

  return (
    <GestureDetector gesture={pan}>
      <Canvas
        style={{
          width: chartWidth,
          height: chartHeight,
        }}
      >
        <Gradient
          chartHeight={chartHeight}
          chartWidth={chartWidth}
          chartMargin={chartMargin}
          animationGradient={animationGradient}
          curvedLines={filteredCurvedLines}
        />

        {linePaths.map((path, idx) => (
          <Path
            key={`line-${idx}`}
            style="stroke"
            path={path!}
            strokeWidth={2}
            color={datasets[idx].color}
            end={animationLine}
            start={0}
            strokeCap={"round"}
          />
        ))}

        {/* 🟢 Show 1 cursor per dataset */}
        {showCursor &&
          cyList.map((cy, i) => (
            <Cursor
              key={`cursor-${i}`}
              cx={cx}
              cy={cy}
              chartHeight={chartHeight}
              color={datasets[i].color}
            />
          ))}
      </Canvas>
    </GestureDetector>
  );
};

export default LineChart;
