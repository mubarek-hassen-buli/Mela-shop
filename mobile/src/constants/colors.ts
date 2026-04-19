/**
 * App-wide color palette
 * Matches the iOS glassmorphism aesthetic with a lime-green accent
 */
export const COLORS = {
  // Brand
  accent: '#C8FF00',
  accentMuted: 'rgba(200, 255, 0, 0.25)',

  // Neutrals
  primary: '#000000',
  white: '#FFFFFF',
  black: '#000000',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  card: '#F3F4F6',

  // Text
  text: {
    primary: '#000000',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Feedback
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
} as const;
