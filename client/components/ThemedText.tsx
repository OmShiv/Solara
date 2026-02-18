import { Text, type TextProps } from 'react-native';
import { Typography } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'link' | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body',
  ...rest
}: ThemedTextProps) {
  const getColor = () => {
    if (darkColor) {
      return darkColor;
    }
    if (type === 'link') {
      return '#F7B801';
    }
    return '#FFFFFF';
  };

  const getTypeStyle = () => {
    switch (type) {
      case 'h1':
        return Typography.h1;
      case 'h2':
        return Typography.h2;
      case 'h3':
        return Typography.h3;
      case 'h4':
        return Typography.h4;
      case 'body':
        return Typography.body;
      case 'small':
        return Typography.small;
      case 'caption':
        return Typography.caption;
      case 'link':
        return Typography.link;
      default:
        return Typography.body;
    }
  };

  return (
    <Text style={[{ color: getColor() }, getTypeStyle(), style]} {...rest} />
  );
}
