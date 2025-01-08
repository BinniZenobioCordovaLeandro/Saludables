import type React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useThemeColor } from "@/hooks/useThemeColor";

type ThemedIconProps = {
    name: React.ComponentProps<typeof MaterialIcons>["name"];
    size?: number;
    color?: string;
    onPress?: React.ComponentProps<typeof MaterialIcons>["onPress"];
    lightColor?: string;
    darkColor?: string;
};

export const ThemedIcon: React.FC<ThemedIconProps> = ({
    name,
    size = 24,
    onPress,
    lightColor,
    darkColor,
    color,
}) => {
    const colorTheme = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text",
    );

    return (
        <MaterialIcons
            name={name}
            size={size}
            color={color ?? colorTheme}
            onPress={onPress}
        />
    );
};
