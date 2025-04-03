import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Theme configuration for the NSS App
const theme = {
  // Color palette
  colors: {
    primary: '#4361ee',        // Main brand color
    secondary: '#3f37c9',      // Secondary brand color
    accent: '#4895ef',         // Accent color for highlights
    success: '#4cc9f0',        // Success messages/actions
    danger: '#f72585',         // Danger/error messages
    warning: '#f8961e',        // Warning messages
    info: '#90e0ef',           // Information messages
    black: '#212529',          // Black text
    darkGray: '#495057',       // Dark gray text
    mediumGray: '#6c757d',     // Medium gray text
    lightGray: '#adb5bd',      // Light gray text
    ultraLightGray: '#e9ecef', // Ultra light gray backgrounds
    white: '#ffffff',          // White
    background: '#f8f9fa',     // App background
    card: '#ffffff',           // Card background
    border: '#e0e0e0',         // Border color
  },

  // Typography
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800',
    },
  },

  // Spacing scale (for margins, paddings)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },

  // Shadows
  shadows: {
    small: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    medium: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    large: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
  },

  // Screen dimensions
  dimensions: {
    width,
    height,
    headerHeight: 60,
    footerHeight: 70,
  },

  // Common layout styles
  layout: {
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    contentContainer: {
      padding: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      ...{
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
  },
};

export default theme; 