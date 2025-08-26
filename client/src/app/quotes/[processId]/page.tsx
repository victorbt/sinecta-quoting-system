'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
// import type { Metadata } from 'next';
// import RouterLink from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
// import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
// import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
// import { House as HouseIcon } from '@phosphor-icons/react/dist/ssr/House';
import { PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
// import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { ShieldWarningIcon } from '@phosphor-icons/react/dist/ssr/ShieldWarning';
// import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { useMounted } from '../../../hooks/use-mounted';

import { useParams } from 'next/navigation';

import { quotingsystem } from '../../../api/quotingsystem'
// const lineItems = [
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 },
//   { id: 'LI-001', name: 'Pro Subscription', quantity: 1, currency: 'USD', unitAmount: 14.99, totalAmount: 14.99 }
// ]


// import { config } from '@/config';
// import { paths } from '@/paths';
import { dayjs } from '@/libs/dayjs';
import { PropertyItem } from '@/components/core/property-item';
import { PropertyList } from '@/components/core/property-list';
import { Notifications } from '@/components/processes/detail/notifications';
import { Payments } from '@/components/processes/detail/payments';
import { ProcessListSidebar } from '@/components/processes/process-list-sidebar';
// import { useEffect } from 'react';
// import type { Address } from '@/components/processes/detail/shipping-address';
// import { ShippingAddress } from '@/components/processes/detail/shipping-address';

// export const metadata = { title: `Details | Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

let priceStockClient = new quotingsystem(
  {
    BASE: 'http://localhost:3000'
  }
)


const useProcessDetail = (processID: string) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    process: {
      name: '',
      status: 'pending',
      _createdAt: ''
    },
    processesCount: 0,
    completedProcessesCount: 0,
    pendingProcessesCount: 0,
    shopifyProcesses: [0, 0],
    meliCentroProcesses: [0, 0],
    meliTopProcesses: [0, 0],
    liverpoolProcesses: [0, 0],
    walmartProcesses: [0, 0],
    elektraProcesses: [0, 0],
    coppelProcesses: [0, 0]
  })

  const getProcesses = useCallback(async () => {
    try {

      let [process, completedTasks] = await Promise.all([priceStockClient.postDetalleProceso.findProcess({ processID }), priceStockClient.postRecuperarProcesos.listTasks({ processID })])

      let completed = 0
      let pending = 0

      let meliCentroProcesses = [process.data.data.processes.filter((p: any) => p.marketplace == 'meli-centro').length, completedTasks.data.data.filter((task: any) => task.marketplace == 'meli-centro' && task.responseCode && task.responseCode == 200).length]
      let meliTopProcesses = [process.data.data.processes.filter((p: any) => p.marketplace == 'meli-top').length, completedTasks.data.data.filter((task: any) => task.marketplace == 'meli-top' && task.responseCode && task.responseCode == 200).length]
      let shopifyProcesses = [process.data.data.processes.filter((p: any) => p.marketplace == 'shopify').length, completedTasks.data.data.filter((task: any) => task.marketplace == 'shopify' && task.responseCode && task.responseCode == 200).length]
      let liverpoolProcesses = [process.data.data.processes.filter((p: any) => p.marketplace == 'liverpool').length, completedTasks.data.data.filter((task: any) => task.marketplace == 'liverpool' && task.responseCode && task.responseCode == 200).length]
      let walmartProcesses = [process.data.data.processes.filter((p: any) => p.marketplace == 'walmart').length, completedTasks.data.data.filter((task: any) => task.marketplace == 'walmart' && task.responseCode && task.responseCode == 200).length]
      let elektraProcesses = [process.data.data.processes.filter((p: any) => p.marketplace == 'elektra').length, completedTasks.data.data.filter((task: any) => task.marketplace == 'elektra' && task.responseCode && task.responseCode == 200).length]
      let coppelProcesses = [process.data.data.processes.filter((p: any) => p.marketplace == 'coppel').length, completedTasks.data.data.filter((task: any) => task.marketplace == 'coppel' && task.responseCode && task.responseCode == 200).length]

      let i = 0;
      if (process) {
        for (let p of process.data.data.processes) {
          let taskFound = completedTasks.data.data.find((task: any) => task.processID == p.name)
          if (taskFound && taskFound.responseCode && taskFound.responseCode == 200) {
            process.data.data.processes[i].status = "completed"
            completed++
          } else {
            process.data.data.processes[i].status = "pending"
            pending++
          }

          i++
        }
      }

      if (isMounted()) {
        setState({
          process: process.data.data,
          processesCount: process.data.data.processes.length,
          completedProcessesCount: completed,
          pendingProcessesCount: pending,
          meliCentroProcesses,
          meliTopProcesses,
          shopifyProcesses,
          liverpoolProcesses,
          walmartProcesses,
          elektraProcesses,
          coppelProcesses
        });
      }

    } catch (err) {
      console.error(err)
    }
  }, [processID, isMounted])

  useEffect(() => {
    getProcesses();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [processID])

  return state
};

export default function Page(): React.JSX.Element {
  let { processId } = useParams()
  const {
    process,
    meliCentroProcesses,
    meliTopProcesses,
    shopifyProcesses,
    elektraProcesses,
    coppelProcesses,
    walmartProcesses,
    liverpoolProcesses,
    processesCount,
    completedProcessesCount,
    pendingProcessesCount,
  } = useProcessDetail(processId as string)

  console.log((shopifyProcesses[0]) * 100 / shopifyProcesses[1])

  const [allProcesses, setAllProcesses] = React.useState<Array<Object>>([]);
  const [completedProcesses, setcompletedProcesses] = React.useState<Array<Object>>([]);

  return (
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

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
              {/* <Avatar src="/assets/avatar-1.png" sx={{ '--Avatar-size': '64px' }}>
                MV
              </Avatar> */}
              <div>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="h4">{process.name}</Typography>
                  <Chip
                    icon={<CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />}
                    label="Completed"
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                {/* <Typography color="text.secondary" variant="body1">
                  miron.vitold@domain.com
                </Typography> */}
              </div>
            </Stack>
            <div>
              <Button endIcon={<CaretDownIcon />} variant="contained">
                Action
              </Button>
            </div>
          </Stack>
        </Stack>
        <Grid container spacing={4}>
          <Grid lg={4} xs={12}>
            <Stack spacing={4}>
              <Card>
                <CardHeader
                  action={
                    <IconButton>
                      <PencilSimpleIcon />
                    </IconButton>
                  }
                  // avatar={
                  //   <Avatar>
                  //     <UserIcon fontSize="var(--Icon-fontSize)" />
                  //   </Avatar>
                  // }
                  title="Basic details"
                />
                <PropertyList
                  divider={<Divider />}
                  orientation="vertical"
                  sx={{ '--PropertyItem-padding': '12px 24px' }}
                >
                  {(
                    [
                      // { key: 'Customer ID', value: <Chip label="USR-001" size="small" variant="outlined" /> },
                      { key: 'Name', value: process.name },
                      { key: 'Status', value: process.status },
                      { key: 'Start Date', value: process._createdAt },
                      { key: 'End Date', value: '' },
                      // { key: 'Email', value: 'miron.vitold@domain.com' },
                      // { key: 'Phone', value: '(425) 434-5535' },
                      // { key: 'Company', value: 'Devias IO' },
                      {
                        key: 'Progress',
                        value: (
                          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                            <LinearProgress sx={{ flex: '1 1 auto' }} value={(processesCount * 100) / completedProcessesCount} variant="determinate" />
                            <Typography color="text.secondary" variant="body2">
                              {(processesCount * 100) / completedProcessesCount}%
                            </Typography>
                          </Stack>
                        ),
                      },
                    ] satisfies { key: string; value: React.ReactNode }[]
                  ).map(
                    (item): React.JSX.Element => (
                      <PropertyItem key={item.key} name={item.key} value={item.value} />
                    )
                  )}
                </PropertyList>
              </Card>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar>
                      <ShieldWarningIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title="Security"
                />
                <CardContent>
                  <Stack spacing={1}>
                    <div>
                      <Button color="error" variant="contained">
                        Stop Process
                      </Button>
                    </div>
                    <Typography color="text.secondary" variant="body2">
                      A deleted customer cannot be restored. All data will be permanently removed.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid lg={8} xs={12}>
            <Stack spacing={4}>
              <Payments
                totalTasks={processesCount}
                pendingTasks={pendingProcessesCount}
                completedTasks={completedProcessesCount}
                errorTasks={0}
                payments={[
                  {
                    name: 'SHOPIFY',
                    currency: 'USD',
                    progress: (shopifyProcesses[0] * 100) / shopifyProcesses[1],
                    total: shopifyProcesses[0],
                    completed: shopifyProcesses[1],
                    pending: shopifyProcesses[0] - shopifyProcesses[1],
                    error: 0,
                    invoiceId: 'INV-003',
                    status: 'completed',
                    createdAt: dayjs().subtract(7, 'minute').subtract(3, 'hour').toDate(),
                  },
                  {
                    name: 'MELI CENTRO',
                    currency: 'USD',
                    progress: (meliCentroProcesses[0] * 100) / meliCentroProcesses[1],
                    total: meliCentroProcesses[0],
                    completed: meliCentroProcesses[1],
                    pending: meliCentroProcesses[0] - meliCentroProcesses[1],
                    error: 0,
                    invoiceId: 'INV-005',
                    status: 'completed',
                    createdAt: dayjs().subtract(5, 'minute').subtract(1, 'hour').toDate(),
                  },
                  {
                    name: 'MELI TOP',
                    currency: 'USD',
                    total: meliTopProcesses[0],
                    completed: meliTopProcesses[1],
                    pending: meliTopProcesses[0] - meliTopProcesses[1],
                    error: 0,
                    progress: (meliTopProcesses[0] * 100) / meliTopProcesses[1],
                    invoiceId: 'INV-004',
                    status: 'error',
                    createdAt: dayjs().subtract(21, 'minute').subtract(2, 'hour').toDate(),
                  },
                  {
                    name: 'LIVERPOOL',
                    currency: 'USD',
                    total: liverpoolProcesses[0],
                    completed: liverpoolProcesses[1],
                    pending: liverpoolProcesses[0] - liverpoolProcesses[1],
                    error: 0,
                    progress: (liverpoolProcesses[0] * 100) / liverpoolProcesses[1],
                    invoiceId: 'INV-002',
                    status: 'pending',
                    createdAt: dayjs().subtract(48, 'minute').subtract(4, 'hour').toDate(),
                  },
                  {
                    name: 'WALMART',
                    currency: 'USD',
                    total: walmartProcesses[0],
                    completed: walmartProcesses[1],
                    pending: walmartProcesses[0] - walmartProcesses[1],
                    error: 0,
                    progress: (walmartProcesses[0] * 100) / walmartProcesses[1],
                    invoiceId: 'INV-001',
                    status: 'pending',
                    createdAt: dayjs().subtract(31, 'minute').subtract(5, 'hour').toDate(),
                  },
                  {
                    name: 'COPPEL',
                    currency: 'USD',
                    total: coppelProcesses[0],
                    completed: coppelProcesses[1],
                    pending: coppelProcesses[0] - coppelProcesses[1],
                    error: 0,
                    progress: (coppelProcesses[0] * 100) / coppelProcesses[1],
                    invoiceId: 'INV-001',
                    status: 'pending',
                    createdAt: dayjs().subtract(31, 'minute').subtract(5, 'hour').toDate(),
                  },
                  {
                    // 50 x min
                    name: 'ELEKTRA',
                    currency: 'USD',
                    total: elektraProcesses[0],
                    completed: elektraProcesses[1],
                    pending: elektraProcesses[0] - elektraProcesses[1],
                    error: 0,
                    progress: (elektraProcesses[0] * 100) / elektraProcesses[1],
                    invoiceId: 'INV-001',
                    status: 'pending',
                    createdAt: dayjs().subtract(31, 'minute').subtract(5, 'hour').toDate(),
                  },
                ]}

              />
              {/* <Card>
                <CardHeader
                  action={
                    <Button color="secondary" startIcon={<PencilSimpleIcon />}>
                      Edit
                    </Button>
                  }
                  avatar={
                    <Avatar>
                      <CreditCardIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title="Billing details"
                />
                <CardContent>
                  <Card sx={{ borderRadius: 1 }} variant="outlined">
                    <PropertyList divider={<Divider />} sx={{ '--PropertyItem-padding': '16px' }}>
                      {(
                        [
                          { key: 'Credit card', value: '**** 4142' },
                          { key: 'Country', value: 'United States' },
                          { key: 'State', value: 'Michigan' },
                          { key: 'City', value: 'Southfield' },
                          { key: 'Address', value: '1721 Bartlett Avenue, 48034' },
                          { key: 'Tax ID', value: 'EU87956621' },
                        ] satisfies { key: string; value: React.ReactNode }[]
                      ).map(
                        (item): React.JSX.Element => (
                          <PropertyItem key={item.key} name={item.key} value={item.value} />
                        )
                      )}
                    </PropertyList>
                  </Card>
                </CardContent>
              </Card> */}
              {/* <Card>
                <CardHeader
                  action={
                    <Button color="secondary" startIcon={<PlusIcon />}>
                      Add
                    </Button>
                  }
                  avatar={
                    <Avatar>
                      <HouseIcon fontSize="var(--Icon-fontSize)" />
                    </Avatar>
                  }
                  title="Shipping addresses"
                />
                <CardContent>
                  <Grid container spacing={3}>
                    {(
                      [
                        {
                          id: 'ADR-001',
                          country: 'United States',
                          state: 'Michigan',
                          city: 'Lansing',
                          zipCode: '48933',
                          street: '480 Haven Lane',
                          primary: true,
                        },
                        {
                          id: 'ADR-002',
                          country: 'United States',
                          state: 'Missouri',
                          city: 'Springfield',
                          zipCode: '65804',
                          street: '4807 Lighthouse Drive',
                        },
                      ] satisfies Address[]
                    ).map((address) => (
                      <Grid key={address.id} md={6} xs={12}>
                        <ShippingAddress address={address} />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card> */}
              {/* <Notifications
                notifications={[
                  {
                    id: 'EV-002',
                    type: 'Refund request approved',
                    status: 'pending',
                    createdAt: dayjs().subtract(34, 'minute').subtract(5, 'hour').subtract(3, 'day').toDate(),
                  },
                  {
                    id: 'EV-001',
                    type: 'Order confirmation',
                    status: 'delivered',
                    createdAt: dayjs().subtract(49, 'minute').subtract(11, 'hour').subtract(4, 'day').toDate(),
                  },
                ]}
              /> */}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}




