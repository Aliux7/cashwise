import { useWindowDimensions, View } from "react-native";
import React from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Canvas, SkFont, Text } from "@shopify/react-native-skia";

type Props = {
  selectedValue: SharedValue<number>;
  selectedLabel: SharedValue<string>;
  font: SkFont;
};

const AnimatedText = ({ selectedValue, selectedLabel, font }: Props) => {
  const { width } = useWindowDimensions();
  const MARGIN_VERTICAL = 10;

  const animatedValueText = useDerivedValue(() => {
    return `Rp. ${Math.round(selectedValue.value).toLocaleString()}`;
  });

  const animatedLabelText = useDerivedValue(() => {
    return selectedLabel.value;
  });

  const fontSize = font?.measureText("0");

  const valueX = useDerivedValue(() => {
    const size = font?.measureText(animatedValueText.value);
    // return 10;
    return width - 50 - size!.width; // align right with 50px padding
  });

  const labelX = useDerivedValue(() => {
    const size = font?.measureText(animatedLabelText.value);
    // return 10;
    return width - 50 - size!.width;
  });

  return (
    <View className="flex w-full mt-5">
      <Canvas style={{ height: fontSize!.height * 2 + MARGIN_VERTICAL * 2 }}>
        {/* Label on top */}
        <Text
          text={animatedLabelText}
          font={font}
          color={"#555555"}
          x={labelX}
          y={fontSize!.height + MARGIN_VERTICAL / 2}
        />
        {/* Value below */}
        <Text
          text={animatedValueText}
          font={font}
          color={"#000000"}
          x={valueX}
          y={fontSize!.height * 2 + MARGIN_VERTICAL + 5}
        />
      </Canvas>
    </View>
  );
};

export default AnimatedText;
