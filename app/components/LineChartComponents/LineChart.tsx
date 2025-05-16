import React, { useEffect, useMemo, useState } from "react";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { curveBasis, line, scaleLinear, scalePoint } from "d3";
import Animated, {
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
  selectedIncome: SharedValue<number>;
  selectedExpenses: SharedValue<number>;
  selectedLabel: SharedValue<string>;
};

const LineChart = ({
  chartHeight,
  chartMargin,
  chartWidth,
  datasets,
  setSelectedDate,
  selectedIncome,
  selectedExpenses,
  selectedLabel,
}: Props) => {
  const fallbackData: MultiDataSet = {
    label: "Placeholder",
    color: "#ccc",
    data: Array.from({ length: 6 }, (_, i) => ({
      label: `Month ${i + 1}`,
      date: `2024-${(i + 1).toString().padStart(2, "0")}-01`,
      value: 0,
    })),
  };

  const safeDatasets =
    !datasets || datasets.length === 0 || !datasets[0]?.data
      ? [fallbackData]
      : datasets;

  const [showCursor, setShowCursor] = useState(false);
  const animationLine = useSharedValue(0);
  const animationGradient = useSharedValue({ x: 0, y: 0 });
  const cx = useSharedValue(20);

  const incomeData = safeDatasets[0].data;
  const expenseData = safeDatasets[1]?.data ?? [];

  const totalIncome = incomeData.reduce((acc, cur) => acc + cur.value, 0);
  const totalExpenses = expenseData.reduce((acc, cur) => acc + cur.value, 0);

  useEffect(() => {
    animationLine.value = withTiming(1, { duration: 1000 });
    animationGradient.value = withDelay(
      1000,
      withTiming({ x: 0, y: chartHeight }, { duration: 500 })
    );
    selectedIncome.value = withTiming(totalIncome);
    selectedExpenses.value = withTiming(totalExpenses);
    selectedLabel.value = "Total Last 6 Months";
  }, [chartHeight, totalIncome, totalExpenses]);

  const allLabels = incomeData.map((d) => d.label);
  const allValues = safeDatasets.flatMap((ds) => ds.data.map((d) => d.value));

  const x = useMemo(
    () =>
      scalePoint()
        .domain(allLabels)
        .range([chartMargin, chartWidth - chartMargin])
        .padding(0),
    [allLabels, chartMargin, chartWidth]
  );

  const y = useMemo(
    () =>
      scaleLinear()
        .domain([Math.min(...allValues) * 0.9, Math.max(...allValues) * 1.1])
        .range([chartHeight, 0]),
    [allValues, chartHeight]
  );

  const stepX = x.step();

  const curvedLines = safeDatasets.map(({ data }) =>
    line<DataType>()
      .x((d) => x(d.label)!)
      .y((d) => y(d.value))
      .curve(curveBasis)(data)
  );

  const filteredCurvedLines = curvedLines.filter(
    (l): l is string => l !== null
  );

  const linePaths = curvedLines.map((d) => Skia.Path.MakeFromSVGString(d!));
  const parsedPaths = linePaths.map((p) => parse(p!.toSVGString()));

  const maxPaths = 2;
  const filledPaths: ((typeof parsedPaths)[0] | null)[] = [...parsedPaths];
  while (filledPaths.length < maxPaths) {
    filledPaths.push(null);
  }

  const cyList = [
    useDerivedValue(() => {
      const path = filledPaths[0];
      if (!path) return 0;
      const y = getYForX(path, Math.floor(cx.value));
      return y ?? 0;
    }),
    useDerivedValue(() => {
      const path = filledPaths[1];
      if (!path) return 0;
      const y = getYForX(path, Math.floor(cx.value));
      return y ?? 0;
    }),
  ];

  const handleGestureEvent = (e: PanGestureHandlerEventPayload) => {
    "worklet";
    const localX = e.x - chartMargin;
    const index = Math.floor(localX / stepX);
    const clampedIndex = Math.max(0, Math.min(index, incomeData.length - 1));

    const incomePoint = incomeData[clampedIndex];
    const expensePoint = expenseData[clampedIndex] ?? { value: 0 };

    runOnJS(setSelectedDate)(incomePoint.date);
    selectedLabel.value = incomePoint.label;

    const clampValue = clamp(
      clampedIndex * stepX + chartMargin,
      chartMargin,
      chartWidth - chartMargin
    );

    selectedIncome.value = withTiming(incomePoint.value);
    selectedExpenses.value = withTiming(expensePoint.value);
    cx.value = clampValue;
  };

  const pan = Gesture.Pan()
    .onTouchesDown(() => {
      runOnJS(setShowCursor)(true);
    })
    .onTouchesUp(() => {
      runOnJS(setShowCursor)(false);
      selectedIncome.value = withTiming(totalIncome);
      selectedExpenses.value = withTiming(totalExpenses);
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
            color={safeDatasets[idx].color}
            end={animationLine}
            start={0}
            strokeCap={"round"}
          />
        ))}

        {showCursor &&
          cyList.map((cy, i) => (
            <Cursor
              key={`cursor-${i}`}
              cx={cx}
              cy={cy}
              chartHeight={chartHeight}
              color={safeDatasets[i].color}
            />
          ))}
      </Canvas>
    </GestureDetector>
  );
};

export default LineChart;
