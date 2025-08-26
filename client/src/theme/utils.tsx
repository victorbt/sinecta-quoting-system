import { blue, green,yellow, indigo, purple } from './colors';

export const getPrimary = (preset:any) => {
  switch (preset) {
    case 'blue':
      return blue;
    case 'green':
      return green;
    case 'indigo':
      return indigo;
    case 'purple':
      return purple;
    case 'yellow':
        return yellow;
    default:
      console.error('Invalid color preset, accepted values: "blue", "green", "indigo" or "purple"".');
      return blue;
  }
};
