'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import FilterFunnel01Icon from '@untitled-ui/icons-react/build/esm/FilterFunnel01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Box, Button, Divider, Stack, SvgIcon, Typography, useMediaQuery } from '@mui/material';
// import { quotesApi } from '../../../api/quotes';
import { useMounted } from '../../hooks/use-mounted';
// import { usePageView } from '../../hooks/use-page-view';
// import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { ProcessListContainer } from '../../components/quotes/process-list-container';
import { ProcessListSidebar } from '../../components/quotes/process-list-sidebar';
// import { ProcessListSummary } from '../../components/quotes/process-list-summary';
import { ProcessListTable } from '../../components/quotes/process-list-table';

import { quotingsystem } from '../../api/quotingsystem'

import { addDays, subDays, subHours } from 'date-fns';
import { paths } from '../../paths';

let quotingSystemClient = new quotingsystem(
  {
    BASE: 'http://localhost:3000'
  }
)

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      customers: [],
      endDate: undefined,
      query: '',
      startDate: undefined
    },
    page: 0,
    rowsPerPage: 5
  });

  return {
    search,
    updateSearch: setSearch
  }
}

const useQuotes = (search: any) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    quotes: [],
    quotesCount: 0
  })

  const getQuotes = useCallback(async () => {
    try {

      let quotes = await quotingSystemClient.quotes.list()
      console.log(quotes)

      if (isMounted()) {
        setState({
          quotes: quotes.data as any,
          quotesCount: quotes.data.length
        });
      }

    } catch (err) {
      console.error(err)
    }
  }, [search, isMounted])

  useEffect(() => {
    getQuotes();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search])

  return state
};



const Quotes = () => {

  const rootRef = useRef(null)
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'))

  const [group, setGroup] = useState(true)
  const [openSidebar, setOpenSidebar] = useState(lgUp)
  const { search, updateSearch } = useSearch()
  const { quotes, quotesCount } = useQuotes(search)

  const handleGroupChange = useCallback((event: any) => {
    setGroup(event.target.checked);
  }, []);

  const handleFiltersToggle = useCallback(() => {
    setOpenSidebar((prevState: boolean) => !prevState);
  }, []);

  const handleFiltersChange = useCallback((filters: any) => {
    updateSearch((prevState) => ({
      ...prevState,
      filters,
      page: 0
    }));
  }, [updateSearch]);

  const handleFiltersClose = useCallback(() => {
    setOpenSidebar(false);
  }, []);

  const handlePageChange = useCallback((event: any, page: any) => {
    updateSearch((prevState) => ({
      ...prevState,
      page
    }));
  }, [updateSearch]);

  const handleRowsPerPageChange = useCallback((event: any) => {
    updateSearch((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10)
    }));
  }, [updateSearch]);


  return (
    <>
      <Head>
        <title>
          Dashboard: Process List | Devias Kit PRO
        </title>
      </Head>
      <Divider />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <ProcessListSidebar
            container={rootRef.current}
            filters={search.filters}
            group={group}
            onFiltersChange={handleFiltersChange}
            onClose={handleFiltersClose}
            onGroupChange={handleGroupChange}
            open={openSidebar}
          />
          <ProcessListContainer open={openSidebar}>
            <Stack spacing={4}>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <div>
                  <Typography variant="h4">
                    Quotes
                  </Typography>
                </div>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon>
                        <FilterFunnel01Icon />
                      </SvgIcon>
                    )}
                    onClick={handleFiltersToggle}
                  >
                    Filters
                  </Button>
                  <Button
                    startIcon={(
                      <SvgIcon>
                        <PlusIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                    href={paths.quotes.create}
                  >
                    New
                  </Button>
                </Stack>
              </Stack>
              {/* <ProcessListSummary /> */}
              <ProcessListTable
                group={group}
                quotes={quotes}
                quotesCount={quotesCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={search.page}
                rowsPerPage={search.rowsPerPage}
              />
            </Stack>
          </ProcessListContainer>
        </Box>
      </Box>
    </>
  );
};

export default Quotes;


const now = new Date();

const quotesExamples = [
  {
    id: '5ecb868d0f437390ef3ac62c',
    name: 'shsjdhsj',
    currency: '$',
    customer: {
      email: 'contact@acme.com',
      name: 'ACME SRL'
    },
    dueDate: addDays(now, 5).getTime(),
    issueDate: subHours(now, 1).getTime(),
    number: 'Buen Fin',
    status: 'complete',
    totalAmount: 23
  },
  {
    id: '59d78b0b0e15394130c373ff',
    currency: '$',
    customer: {
      email: 'sales@blind-spots.com',
      name: 'Blind Spots Inc.'
    },
    dueDate: addDays(now, 6).getTime(),
    issueDate: subHours(now, 1).getTime(),
    number: 'Buen Fin',
    status: 'complete',
    totalAmount: 50
  },
  {
    id: '2a05e7f757c35fe823da3c5a',
    currency: '$',
    customer: {
      email: 'sales@beauty-clinic.com',
      name: 'Beauty Clinic SRL'
    },
    dueDate: addDays(now, 9).getTime(),
    issueDate: subHours(now, 1).getTime(),
    number: 'Promos ',
    status: 'complete',
    totalAmount: 20
  },
  {
    id: '5ecb868ada8deedee0638502',
    currency: '$',
    customer: {
      email: 'sales@matt-jason.com',
      name: 'Matt Jason'
    },
    dueDate: addDays(now, 25).getTime(),
    issueDate: subDays(subHours(now, 5), 2).getTime(),
    number: 'JBL',
    status: 'pending',
    totalAmount: 12
  },
  {
    id: '750f519b8bc4d21af9528437',
    currency: '$',
    customer: {
      email: 'sales@matt-jason.com',
      name: 'Matt Jason'
    },
    dueDate: addDays(now, 17).getTime(),
    issueDate: subDays(subHours(now, 4), 2).getTime(),
    number: 'Promos Harman',
    status: 'pending',
    totalAmount: 35
  },
  {
    id: '5ecb868700aba84d0f1c0e48',
    currency: '$',
    customer: {
      email: 'support@terrythomas.io',
      name: 'Terry Thomas'
    },
    dueDate: addDays(now, 11).getTime(),
    issueDate: subDays(subHours(now, 4), 6).getTime(),
    number: 'Week',
    status: 'canceled',
    totalAmount: 78
  },
  {
    id: '5ecb8682038e1rl239438dks1',
    currency: '$',
    customer: {
      email: 'contact@dispatcher.co.uk',
      name: 'Dispatcher Inc.'
    },
    dueDate: addDays(now, 3).getTime(),
    issueDate: subDays(subHours(now, 2), 15).getTime(),
    number: 'Promos Technics',
    status: 'complete',
    totalAmount: 44
  },
  {
    id: '5ecb8682038e1ddf4e868764',
    currency: '$',
    customer: {
      email: 'info@novelty.co.uk',
      name: 'Novelty I.S'
    },
    dueDate: addDays(now, 1).getTime(),
    issueDate: subDays(subHours(now, 2), 15).getTime(),
    number: 'AKG Promo',
    status: 'canceled',
    totalAmount: 23
  }
];

const process = {
  id: '5ecb86785312dcc69b5799ad',
  currency: '$',
  customer: {
    address: '271 Richmond Rd, Grey Lynn, Auckland 1022, New Zealand',
    company: 'Countdown Grey Lynn',
    email: 'contact@acme.com',
    name: 'ACME SRL',
    taxId: '6934656584231'
  },
  dueDate: addDays(now, 5).getTime(),
  issueDate: subHours(now, 1).getTime(),
  items: [
    {
      id: '5ecb8694db1760a701dfbf74',
      currency: '$',
      description: 'Freelancer Subscription (12/05/2019 - 11/06/2019)',
      quantity: 1,
      totalAmount: 55.50,
      unitAmount: 55.50
    }
  ],
  number: 'Black Friday',
  status: 'complete',
  subtotalAmount: 50.00,
  taxAmount: 5.50,
  totalAmount: 55.50
};