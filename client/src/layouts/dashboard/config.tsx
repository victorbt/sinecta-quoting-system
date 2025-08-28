import { Chip, SvgIcon } from '@mui/material';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import { tokens } from '../../locales/tokens';
import { paths } from '../../paths';

export const getSections = (t: any) => [
  {
    items: [
      {
        title: t(tokens.nav.overview),
        path: paths.index,
        icon: (
          <SvgIcon fontSize="small">
            <HomeSmileIcon />
          </SvgIcon>
        )
      }
    ]
  },
];
