import React from "react";
import { Circle, Group, Path, Skia } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

type Props = {
  cx: SharedValue<number>;
  cy: SharedValue<number>;
  chartHeight: number;
  color: string;  
};

const Cursor = ({ cx, cy, chartHeight, color }: Props) => {
  const path = useDerivedValue(() => {
    const dottedLine = Skia.Path.Make().moveTo(0, 0).lineTo(0, chartHeight - cy.value);

    dottedLine.dash(5, 5, 0);

    const matrix = Skia.Matrix();
    matrix.translate(cx.value, cy.value);
    dottedLine.transform(matrix);

    return dottedLine;
  });

  return (
    <Group>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeJoin="round"
        strokeWidth={2}
      />
      <Circle
        r={5}
        cx={cx}
        cy={cy}
        strokeWidth={5}
        color={color}
        style={"stroke"}
      />
      <Circle r={5} cx={cx} cy={cy} color={"#bfdbfe"} style={"fill"} />
    </Group>
  );
};

export default Cursor;
