import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import { Box, IconButton, Stack, SvgIcon, useMediaQuery, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AccountButton } from '../account-button';
// import { ContactsButton } from '../contacts-button';
import { LanguageSwitch } from '../language-switch';
import { NotificationsButton } from '../notifications-button';
import { SearchButton } from '../search-button';
import { usePathname } from 'next/navigation';

const TOP_NAV_HEIGHT = 64;
const SIDE_NAV_WIDTH = 280;

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const TopNav = (props: any) => {
  const { onMobileNavOpen, ...other } = props;
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

  return (
    <Box
      component="header"
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
        position: 'sticky',
        left: {
          lg: `${SIDE_NAV_WIDTH}px`
        },
        top: 0,
        width: {
          lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
        },
        zIndex: (theme) => theme.zIndex.appBar
      }}
      {...other}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {!lgUp && (
            <IconButton onClick={onMobileNavOpen}>
              <SvgIcon>
                <Menu01Icon />
              </SvgIcon>
            </IconButton>
          )}

          <div>
            <Typography variant="h5" sx={{ml:2}}>
              {capitalizeFirstLetter(usePathname().replace('/',''))}
            </Typography>
          </div>

        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <SearchButton />
          <LanguageSwitch />
          <NotificationsButton />
          <AccountButton />
        </Stack>
      </Stack>
    </Box>
  );
};

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func
};
