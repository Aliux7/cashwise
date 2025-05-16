import { useWindowDimensions, View } from "react-native";
import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Canvas, SkFont, Text } from "@shopify/react-native-skia";

type Props = {
  selectedIncome: SharedValue<number>;
  selectedExpenses: SharedValue<number>;
  selectedLabel: SharedValue<string>;
  font: SkFont;
};

const AnimatedText = ({
  selectedIncome,
  selectedExpenses,
  selectedLabel,
  font,
}: Props) => {
  const { width } = useWindowDimensions();
  const MARGIN_VERTICAL = 10;

  const fontSize = font?.measureText("0");

  const animatedIncomeText = useDerivedValue(() => {
    return `Rp. ${Math.round(selectedIncome.value).toLocaleString()} - `;
  });

  const animatedExpensesText = useDerivedValue(() => {
    return `Rp. ${Math.round(selectedExpenses.value).toLocaleString()}`;
  });

  const animatedLabelText = useDerivedValue(() => {
    return selectedLabel.value;
  });

  const incomeX = useDerivedValue(() => {
    const size = font?.measureText(animatedIncomeText.value);
    const expensesSize = font?.measureText(animatedExpensesText.value);
    return width - 50 - size!.width - expensesSize!.width - 10;
  });

  const expensesX = useDerivedValue(() => {
    const size = font?.measureText(animatedExpensesText.value);
    return width - 50 - size!.width;
  });

  const labelX = useDerivedValue(() => {
    const size = font?.measureText(animatedLabelText.value);
    return width - 50 - size!.width;
  });

  return (
    <View className="flex w-full mt-5">
      <Canvas style={{ height: fontSize!.height * 3.5 + MARGIN_VERTICAL * 3 }}>
        {/* Label */}
        <Text
          text={animatedLabelText}
          font={font}
          color="#555555"
          x={labelX}
          y={fontSize!.height + MARGIN_VERTICAL / 2}
        />

        <Text
          text={animatedIncomeText}
          font={font}
          color="#16a34a"
          x={incomeX}  
          y={fontSize!.height * 2 + MARGIN_VERTICAL}
        />
 
        <Text
          text={animatedExpensesText}
          font={font}
          color="#dc2626"
          x={expensesX}  
          y={fontSize!.height * 2 + MARGIN_VERTICAL}
        />
      </Canvas>
    </View>
  );
};

export default AnimatedText;
