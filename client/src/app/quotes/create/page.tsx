'use client'

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

// import { config } from '../../../config';
import { paths } from '@/paths';
import { InvoiceCreateForm } from '../../../components/quotes/invoice-create-form'

import { useState,useCallback } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



export interface UploaderProps {
  onClose?: () => void;
  open?: boolean;
}

export default function Page(): React.JSX.Element {



  const handleSubmit = (data: any) => {
    if (data && data.data && data.data._id) {
      //handleNext()
    }
  };


  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [loadingText, setLoadingText] = useState('Searching Products In Marketplaces');

  return (

    <>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Stack spacing={3}>
            <div>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.quotes.index}
                sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
                variant="subtitle2"
              >
                <ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
                Quotes List
              </Link>
            </div>
            <div>
              <Typography variant="h4">Create Quote</Typography>
            </div>
          </Stack>

          <Box sx={{ width: '100%' }}>

            <Typography sx={{ mt: 2, mb: 1 }}>
              <InvoiceCreateForm submit={handleSubmit} />
            </Typography>

          </Box>

        </Stack>
      </Box>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      //onClick={handleClose}
      >
        <GradientCircularProgress loadingText={loadingText} />
      </Backdrop>

    </>
  );
}


function GradientCircularProgress({ loadingText }: { loadingText: string }) {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />

      <Typography variant="h6" component="h6" style={{ marginLeft: 12 }}>
        {loadingText}
      </Typography>
    </React.Fragment>
  );
}
