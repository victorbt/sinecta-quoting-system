import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CenteredLayout } from './centered-layout';

export const metadata: Metadata = { title: `Sinecta Sign In` };

export default function Page(): React.JSX.Element {
  return (
    <CenteredLayout>
      <Stack spacing={4}>
        <Card>
          <CardHeader
            subheader={
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? <Link variant="subtitle2">Sign up</Link>
              </Typography>
            }
            title="Sign in"
          />
          <CardContent>
            <Stack spacing={2}>
              <Stack spacing={2}>
                <FormControl>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput name="email" type="email" />
                </FormControl>
                <FormControl>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput name="password" type="password" />
                </FormControl>
                <Button type="submit" variant="contained">
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </CenteredLayout>
  );
}
