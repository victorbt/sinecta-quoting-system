'use client'


import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useParams } from 'next/navigation'

import { config } from '@/config';
import { dayjs } from '@/libs/dayjs';
import { OrderModal } from '@/components/overview/order-modal';
import { OrdersFilters } from '@/components/overview/orders-filters';
import type { Filters } from '@/components/overview/orders-filters';
import { OrdersPagination } from '@/components/overview/orders-pagination';
import { OrdersSelectionProvider } from '@/components/overview/orders-selection-context';
import { OrdersTable } from '@/components/overview/orders-table';
import type { Order } from '@/components/overview/orders-table';

import { useMounted } from '../../../../hooks/use-mounted';

import { quotingsystem } from '../../../../api/quotingsystem';

let priceStockClient = new quotingsystem(
  {
    BASE: 'http://localhost:5028'
  }
)

const useProcessDetail = (processID: string) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    process: {
      name: '',
      processes: []
    },
    completedCount: 0,
    pendingCount: 0
  })

  const getProcesses = useCallback(async () => {
    try {
      let [process, completedTasks] = await Promise.all([priceStockClient.postDetalleProceso.findProcess({ processID }), priceStockClient.postRecuperarProcesos.listTasks({ processID })])


      let pending = 0
      let completed = 0

      let i = 0;
      if (process) {
        for (let p of process.data.data.processes) {
          let taskFound = completedTasks.data.data.find((task: any) => task.processID == p.name)
          console.log(taskFound)
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
          completedCount: completed,
          pendingCount: pending
        });
      }

    } catch (err) {
      console.error(err)
    }
  }, [processID, isMounted])

  useEffect(() => {
    setInterval(() => {
      getProcesses();
    }, 1800)
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [processID])

  return state
};


interface PageProps {
  searchParams: { marketplace?: string; sku?: string; id?: string; previewId?: string; sortDir?: 'asc' | 'desc'; status?: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { marketplace, id, sku, previewId, sortDir, status } = searchParams;

  let { processId } = useParams()
  let { process,completedCount,pendingCount } = useProcessDetail(processId as string)

  const sortedOrders = applySort(process.processes, sortDir);
  const filteredOrders = applyFilters(sortedOrders, { marketplace, id, status, sku });

  return (
    <React.Fragment>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">Processes</Typography>
            </Box>
            {/* <div>
              <Button startIcon={<PlusIcon />} variant="contained">
                Add
              </Button>
            </div> */}
          </Stack>
          <OrdersSelectionProvider orders={filteredOrders}>
            <Card>
              <OrdersFilters
                filters={{ marketplace, id, status }}
                sortDir={sortDir}
                totalCount={process.processes.length}
                pendingCount={pendingCount}
                completedCount={completedCount}
              />
              <Divider />
              <Box sx={{ overflowX: 'auto' }}>
                <OrdersTable rows={filteredOrders} />
              </Box>
              <Divider />
              <OrdersPagination count={filteredOrders.length} page={0} />
            </Card>
          </OrdersSelectionProvider>
        </Stack>
      </Box>
      <OrderModal open={Boolean(previewId)} />
    </React.Fragment>
  );
}

// Sorting and filtering has to be done on the server.

function applySort(row: Order[], sortDir: 'asc' | 'desc' | undefined): Order[] {
  return row
  // .sort((a, b) => {
  //   // if (sortDir === 'asc') {
  //   //   return a.createdAt.getTime() - b.createdAt.getTime();
  //   // }

  //   return b.createdAt.getTime() - a.createdAt.getTime();
  // });
}

function applyFilters(row: Order[], { marketplace, id, sku, status }: Filters): Order[] {

  return row.filter((item) => {
    console.log(row, marketplace)
    if (marketplace) {
      if (!item.marketplace?.toLowerCase().includes(marketplace.toLowerCase())) {
        return false;
      }
    }

    if (sku) {
      if (!item.sku?.toLowerCase().includes(sku.toLowerCase())) {
        return false;
      }
    }

    if (id) {
      if (!item.id?.toLowerCase().includes(id.toLowerCase())) {
        return false;
      }
    }

    if (status) {
      if (item.status !== status) {
        return false;
      }
    }

    return true;
  });
}
