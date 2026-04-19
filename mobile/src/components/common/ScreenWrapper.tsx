import React from 'react';
import { type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  /** Which safe-area edges to respect (default: top only) */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Root wrapper for every screen — applies safe-area insets and a
 * consistent white background.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  edges = ['top'],
  className,
  ...props
}) => {
  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 bg-white ${className ?? ''}`}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
};
