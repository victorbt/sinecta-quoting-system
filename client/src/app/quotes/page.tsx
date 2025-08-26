'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import FilterFunnel01Icon from '@untitled-ui/icons-react/build/esm/FilterFunnel01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Box, Button, Divider, Stack, SvgIcon, Typography, useMediaQuery } from '@mui/material';
// import { quotesApi } from '../../../api/quotes';
import { useMounted } from '../../hooks/use-mounted';
import { ProcessListContainer } from '../../components/quotes/process-list-container';
import { ProcessListSidebar } from '../../components/quotes/process-list-sidebar';
// import { ProcessListSummary } from '../../components/quotes/process-list-summary';
import { ProcessListTable } from '../../components/quotes/process-list-table';

import { quotingsystem } from '../../api/quotingsystem'

import { addDays, subDays, subHours } from 'date-fns';
import { paths } from '../../paths';

import { STORAGE_KEY } from '../../contexts/auth/jwt-context'

const accessToken = globalThis.localStorage.getItem(STORAGE_KEY);

let quotingSystemClient = new quotingsystem(
  {
    BASE: 'http://localhost:3000',
    HEADERS: {
      "Authorization": `Bearer ${accessToken}`
    }
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
    rowsPerPage: 10
  });

  return {
    search,
    updateSearch: setSearch
  }
}

const useQuotes = (search: any) => {
  console.log(search)
  const isMounted = useMounted();
  const [state, setState] = useState({
    quotes: [],
    quotesCount: 0
  })

  const getQuotes = useCallback(async () => {
    try {
      let quotes = await quotingSystemClient.quotes.list(search.page + 1, search.rowsPerPage)
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
                processes={quotes}
                processesCount={quotesCount}
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
