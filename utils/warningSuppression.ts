// Suppress known warnings from third-party libraries
export function suppressKnownWarnings() {
  const originalWarn = console.warn;
  
  console.warn = (...args) => {
    const message = args[0];
    
    // Suppress specific warnings that we can't control from libraries
    if (typeof message === 'string') {
      // Suppress react-native-paper deprecation warnings
      if (message.includes('props.pointerEvents is deprecated') ||
          message.includes('"shadow*" style props are deprecated') ||
          message.includes('useNativeDriver') && message.includes('not supported')) {
        return; // Don't log these warnings
      }
    }
    
    // Log all other warnings normally
    originalWarn.apply(console, args);
  };
}

// Call this function early in your app lifecycle
export default suppressKnownWarnings;