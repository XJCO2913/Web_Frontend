// src/theme/index.js
 
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { componentsOverrides } from './overrides';
 
export default function ThemeProvider({ children }) {
  const memoizedValue = useMemo(
    () => ({
      palette: palette('light'), // or palette('dark')
      shadows: shadows('light'), // or shadows('dark')
      customShadows: customShadows('light'), // or customShadows('dark')
      shape: { borderRadius: 8 },
      typography,
    }),
    []
  );
 
  const theme = createTheme(memoizedValue);
 
  theme.components = componentsOverrides(theme);
 
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
 
ThemeProvider.propTypes = {
  children: PropTypes.node,
};