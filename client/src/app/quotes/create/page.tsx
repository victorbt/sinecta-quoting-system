'use client'

import * as React from 'react';
import type { Metadata } from 'next';
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

import { useCallback, useEffect, useRef, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

// import type { File } from '@/components/core/file-dropzone';
// import { FileDropzone } from '@/components/core/file-dropzone';
// import { FileIcon } from '@/components/core/file-icon';

import Grid from '@mui/material/Grid';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

//import { DeviatedVehicles } from '@/components/processes/overview/deviated-vehicles';
// import { LateVehicles } from '@/components/processes/overview/late-vehicles';
// import { OnRouteVehicles } from '@/components/processes/overview/on-route-vehicles';
// import { VehiclesCondition } from '@/components/processes/overview/vehicles-condition';
// import { VehiclesOverview } from '@/components/processes/overview/vehicles-overview';
import { VehiclesTable } from '@/components/quotes/overview/vehicles-table';
// import { VehiclesWithErrors } from '@/components/processes/overview/vehicles-with-errors';

// import { HotTable } from '@handsontable/react';

// import { textRenderer, registerRenderer } from 'handsontable/renderers';
// import 'handsontable/dist/handsontable.full.min.css';

// import axios from 'axios'

import { quotingsystem } from '../../../api/quotingsystem'

// export const metadata = { title: `Create | Invoices | Dashboard | ${config.site.name}` } satisfies Metadata;

const steps = ['Basic Details', 'Select Area', 'Overview'];

function bytesToSize(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface UploaderProps {
  onClose?: () => void;
  open?: boolean;
}

export default function Page(): React.JSX.Element {
  // registerRenderer('customStylesRenderer', (hotInstance, TD, ...rest) => {
  //   textRenderer(hotInstance, TD, ...rest);

  //   TD.style.fontWeight = 'bold !important';
  //   TD.style.color = 'green !important';
  //   TD.style.background = '#d7f1e1 !important';
  // })

  const router = useRouter()

  let priceStockClient = new quotingsystem(
    {
      BASE: 'http://localhost:3000'
    }
  )

  const [files, setFiles] = React.useState<File[]>([]);

  const [tasksPreview, setTasksPreview] = React.useState<Array<any>>([]);

  const [fileHeaders, setFileHeaders] = React.useState<Array<string>>([]);
  const [fileData, setFileData] = React.useState<Array<Object>>([]);

  const [processID, setprocessID] = React.useState<string>('');

  const [fileKey, setFileKey] = React.useState<string>('');


  useEffect(() => {
    setFiles([]);
    setTasksPreview(
      [
        {
          id: 'SHOPIFY',
          productsFound: 0,
          productsNotFound: 0,
          status: 'warning',
          temperatureLabel: 'Very Good',
          warning: 'Shopify updates are off in main configs',
        },
        {
          id: 'MELI CENTRO',
          productsFound: 0,
          productsNotFound: 0,
          status: 'success',
          temperatureLabel: 'Very Good',
        },
        {
          id: 'MELI TOP',
          productsFound: 0,
          productsNotFound: 0,
          status: 'warning',
          temperatureLabel: 'Bad',
          warning: 'Meli Top updates are off in main configs',
        },
        {
          id: 'WALMART',
          productsFound: 0,
          productsNotFound: 0,
          status: 'success',
          temperatureLabel: 'Very Good',
        },
        {
          id: 'ELEKTRA',
          productsFound: 0,
          productsNotFound: 0,
          status: 'success',
          temperatureLabel: 'Very Good',
        },
        {
          id: 'COPPEL',
          productsFound: 0,
          productsNotFound: 0,
          status: 'error',
          temperatureLabel: 'Meli Top updates are off in main configs',
        },
        {
          id: 'CLAROSHOP',
          productsFound: 0,
          productsNotFound: 0,
          status: 'error',
          temperatureLabel: 'Very Good',
        },

      ]

    )
  }, []);

  // const execute = async (file: any) => {
  //   setLoadingText('Sending Process Execution')
  //   setOpen(true)
  //   let executeProcess = await priceStockClient.postExecuteProcess.executeProcess({
  //     fileName: fileKey,
  //     processID,
  //     execute: true
  //   })

  //   if (executeProcess) {

  //   }

  //   handleClose()
  //   router.push(`/processes/overview/${processID}`)

  // }

  // const fetchData = async (fileName: string) => {
  //   setOpen(true)
  //   let fileData = await priceStockClient.postDataFile.fileData({ fileName })

  //   let executePreview = await priceStockClient.postExecuteProcess.executeProcess({
  //     fileName,
  //     processID,
  //     execute: false
  //   })

  //   handleClose()

  //   // // this.hotSettings.colHeaders = Object.keys(response.data[0])
  //   let data = []
  //   setFileHeaders(Object.keys(fileData.data.data[0]))

  //   for (let obj of fileData.data.data) {
  //     let rowData = Object.values(obj)
  //     // console.log(rowData)
  //     // rowData[0] = 'Miscellaneous Billing'
  //     // if (rowData[20]) {
  //     //   let num = Number(rowData[20])
  //     //   let result = this.intervalTree.search(num, num)
  //     //   console.log(result)
  //     // }

  //     data.push(rowData)
  //     // for (let obj of response.data) {
  //     //   for (let col of columnsComments) {

  //     //   }
  //     // }
  //   }

  //   // setFileData(data as any)
  //   // console.log(fileData.data.data)

  //   setTasksPreview(
  //     [
  //       {
  //         id: 'SHOPIFY',
  //         productsFound: executePreview.data.stats.marketplaces['shopify'].productsFound,
  //         productsNotFound: executePreview.data.stats.marketplaces['shopify'].productsNotFound,
  //         status: 'success',
  //         temperatureLabel: 'Very Good',
  //         // warning: 'Very Good',
  //       },
  //       {
  //         id: 'MELI CENTRO',
  //         productsFound: executePreview.data.stats.marketplaces['meli-centro'].productsFound,
  //         productsNotFound: executePreview.data.stats.marketplaces['meli-centro'].productsNotFound,
  //         status: 'success',
  //         temperatureLabel: 'Very Good',
  //         // warning: 'Very Good',
  //       },
  //       {
  //         id: 'MELI TOP',
  //         productsFound: executePreview.data.stats.marketplaces['meli-top'].productsFound,
  //         productsNotFound: executePreview.data.stats.marketplaces['meli-top'].productsNotFound,
  //         status: 'warning',
  //         warning: 'Meli Top updates are off in main configs',
  //       },
  //       {
  //         id: 'WALMART',
  //         productsFound: executePreview.data.stats.marketplaces['walmart'].productsFound,
  //         productsNotFound: executePreview.data.stats.marketplaces['walmart'].productsNotFound,
  //         status: 'success',
  //         temperatureLabel: 'Very Good',
  //       },
  //       {
  //         id: 'ELEKTRA',
  //         productsFound: executePreview.data.stats.marketplaces['elektra'].productsFound,
  //         productsNotFound: executePreview.data.stats.marketplaces['elektra'].productsNotFound,
  //         status: 'warning',
  //         warning: 'Elektra updates are off in main configs',
  //       },
  //       {
  //         id: 'COPPEL',
  //         productsFound: executePreview.data.stats.marketplaces['coppel'].productsFound,
  //         productsNotFound: executePreview.data.stats.marketplaces['coppel'].productsNotFound,
  //         status: 'warning',
  //         warning: 'Coppel updates are off in main configs',
  //       },
  //       {
  //         id: 'CLAROSHOP',
  //         productsFound: executePreview.data.stats.marketplaces['claroshop'].productsFound,
  //         productsNotFound: executePreview.data.stats.marketplaces['claroshop'].productsNotFound,
  //         status: 'warning',
  //         warning: 'Claroshop updates are off in main configs',
  //       },
  //     ]
  //   )
  // }

  // const handleDrop = React.useCallback((newFiles: File[]) => {
  //   setFiles((prevFiles) => {
  //     return [...prevFiles, ...newFiles];
  //   });
  // }, []);

  // const handleRemove = React.useCallback((file: File) => {
  //   setFiles((prevFiles) => {
  //     return prevFiles.filter((_file: any) => _file.path !== file.path);
  //   });
  // }, []);

  // const handleRemoveAll = React.useCallback(() => {
  //   setFiles([]);
  // }, []);

  const [activeStep, setActiveStep] = useState(0);

  const handleSubmit = (data: any) => {
    if (data && data.data && data.data._id) {
      setprocessID(data.data._id)
      handleNext()
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const upload = (file: any) => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('name', '');

  //   axios.post('http://localhost:3018/upload', formData)
  //     .then(async (response) => {
  //       console.log(response);

  //       setFileKey(response.data.data.Key)

  //       let update = await priceStockClient.postRecuperarProceso.updateProcess({
  //         _id: processID,
  //         file: response.data.data.Key,
  //         status: 'upload'
  //       })

  //       if (update) {
  //         fetchData(response.data.data.Key)
  //         handleNext()
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     // You probably want to guard against something like this,
  //     // it should never occur unless someone's actively trying to break something.
  //     throw new Error("You can't skip a step that isn't optional.");
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  // const useStyles = makeStyles((theme) => ({
  //   backdrop: {
  //     zIndex: theme.zIndex.drawer + 1,
  //     color: '#fff',
  //   },
  // }));

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
              <Typography variant="h4">Create Process</Typography>
            </div>
          </Stack>

          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                // if (isStepOptional(index)) {
                //   labelProps.optional = (
                //     <Typography variant="caption">Optional</Typography>
                //   );
                // }
                // if (isStepSkipped(index)) {
                //   stepProps.completed = false;
                // }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length - 1 ? (
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
                        <Typography variant="h4">Overview</Typography>
                      </Box>
                      <div>
                        <Button
                          // startIcon={<PlusIcon />} 
                          // onClick={execute}
                          variant="contained">
                          Execute
                        </Button>
                      </div>
                    </Stack>
                    <Grid container spacing={4}>

                      <Grid size={{ md: 3, xs: 12 }}>

                        {/* <DeviatedVehicles amount={fileData.length} /> */}
                      </Grid>

                      {/*

                    <Grid md={3} xs={12}>
                      <OnRouteVehicles amount={38} />
                    </Grid>

                    <Grid md={3} xs={12}>
                      <VehiclesWithErrors amount={2} />
                    </Grid>

                    <Grid md={3} xs={12}>
                      <LateVehicles amount={2} />
                    </Grid> */}

                      {/* <Grid lg={6} xs={12}>
                      <VehiclesOverview
                        data={[
                          { name: 'Available', value: 38, fill: 'var(--mui-palette-primary-main)' },
                          { name: 'Out of service', value: 50, fill: 'var(--mui-palette-warning-main)' },
                          { name: 'On route', value: 12, fill: 'var(--mui-palette-info-main)' },
                        ]}
                      />
                    </Grid>
                    <Grid lg={6} xs={12}>
                      <VehiclesCondition bad={12} excellent={181} good={24} />
                    </Grid> */}

                      <Grid size={{ xs: 12 }} >
                        <VehiclesTable
                          rows={tasksPreview}
                        />
                      </Grid>
                    </Grid>

                    {/* <HotTable
                      data={fileData}
                      //stretchH='all'
                      //readOnly={true}


                      height="auto"
                      autoWrapRow={true}
                      autoWrapCol={true}

                      cell={[
                        {
                          row: 1,
                          col: 2,
                          className: 'customStylesRenderer',
                          activeHeaderClassName: 'customStylesRenderer',
                          readOnlyCellClassName: 'customStylesRenderer',
                          tableClassName: 'customStylesRenderer',
                          placeholderCellClassName: 'customStylesRenderer'
                        }
                        // {
                        //   row: 1,
                        //   col: 2,
                        //   className: 'customStylesRenderer',
                        // },

                        // {
                        //   row: 2,
                        //   col: 2,
                        //   className: 'customStylesRenderer',
                        // },
                      ]}
                      colHeaders={fileHeaders}
                      //nestedHeaders={true}
                      rowHeaders={false}
                      licenseKey="non-commercial-and-evaluation" // for non-commercial use only
                    /> */}
                  </Stack>
                </Box>
                {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box> */}
              </React.Fragment>
            ) : activeStep === 0 ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  <InvoiceCreateForm submit={handleSubmit} />
                </Typography>
                {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
             
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box> */}
              </React.Fragment>
            ) : (
              <React.Fragment>

                <Stack spacing={3}>
                  map
                </Stack>
                {/* 
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box> */}
              </React.Fragment>
            )}
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
