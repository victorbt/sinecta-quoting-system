import { ThemeOptions } from '@mui/material';
import { createComponents } from './create-components';
import { createPalette } from './create-palette';
import { createShadows } from './create-shadows';

export const createOptions = (config: any): any => {
  const { colorPreset, contrast } = config;
  const palette = createPalette({ colorPreset, contrast });
  const components = createComponents({ palette });
  const shadows = createShadows();

  return {
    components,
    palette,
    shadows
  };
};
