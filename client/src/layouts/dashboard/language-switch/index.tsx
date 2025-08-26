import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import { LanguagePopover } from './language-popover';

const languages: Record<string, string> = {
  en: '/assets/flags/flag-us.svg',
  es: '/assets/flags/flag-es.svg'
};

export const LanguageSwitch = () => {
  const anchorRef = useRef(null);
  const { i18n } = useTranslation();
  const [openPopover, setOpenPopover] = useState(false);

  const handlePopoverOpen = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setOpenPopover(false);
  }, []);

  const flag = languages[i18n.language];

  return (
    <>
      <Tooltip title="Language">
        <IconButton
          onClick={handlePopoverOpen}
          ref={anchorRef}
        >
          <Box
            sx={{
              width: 28,
              '& img': {
                width: '100%'
              }
            }}
          >
            <img src={flag} />
          </Box>
        </IconButton>
      </Tooltip>
      <LanguagePopover
        anchorEl={anchorRef.current}
        onClose={handlePopoverClose}
        open={openPopover}
      />
    </>
  );
};
