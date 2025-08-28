'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '../../paths';
import { dayjs } from '../../libs/dayjs';
// import { logger } from '@/lib/default-logger';
import { Option } from '../core/option';
import { toast } from '../toaster';
import { useState, useCallback } from 'react';

import Map from 'react-map-gl/mapbox';

import { quotingsystem, _36_Enums_Crop, _36_Enums_MxState } from '../../api/quotingsystem'

const schema = zod
  .object({
    clientName: zod.string().min(1, 'Customer is required').max(255),
    validFrom: zod.date(),
    validTo: zod.date(),
    crop: zod.enum(_36_Enums_Crop),
    state: zod.enum(_36_Enums_MxState),
    insuredAmount: zod
      .number()
      .min(0, 'Discount must be greater than or equal to 0')
      .max(100, 'Discount must be less than or equal to 100'),
  })
  .refine((data) => data.validFrom < data.validTo, {
    message: 'Due date should be greater than issue date',
    path: ['dueDate'],
  });

type Values = zod.infer<typeof schema>;

const defaultValues = {
  clientName: '',
  crop: _36_Enums_Crop.MAIZ,
  state: _36_Enums_MxState.JALISCO,
  insuredAmount: 0,
  validFrom: new Date(),
  validTo: new Date(),
} satisfies Values;

import { STORAGE_KEY } from '../../contexts/auth/jwt-context'
import DrawControl from '../../draw-control';
import ControlPanel from '../../control-panel';


const TOKEN = 'pk.eyJ1IjoidmljdG9yYmFycmVyYSIsImEiOiJjajF3cHhpNjUwMDZhMzJxeW10NXkyaGxlIn0.fgu5_rHg0wj2L5vHbEfmpw'; // Set your mapbox token here



export function InvoiceCreateForm({
  submit
}: any): React.JSX.Element {
  const router = useRouter();
  const accessToken = globalThis.localStorage.getItem(STORAGE_KEY);
  let priceStockClient = new quotingsystem(

    {
      BASE: 'http://localhost:3000',
      HEADERS: {
        "Authorization": `Bearer ${accessToken}`
      }
    }
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (_: Values): Promise<void> => {
      try {

        let createReq = await priceStockClient.quotes.create(getValues() as any)
        submit(createReq)
        // Make API request
        toast.success('Invoice created');

        //router.push(paths.processes.index);
      } catch (err) {
        // logger.error(err);
        toast.error('Something went wrong!');
      }
    },
    [router]
  );

  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e: any) => {
    setFeatures(currFeatures => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e: any) => {
    setFeatures(currFeatures => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  const cropOptions = [
    { label: 'MAIZ', value: 1 },
    { label: 'TRIGO', id: 2 },
    { label: 'SORGO', id: 3 },
    { label: 'CAFE', id: 4 },
    { label: 'AGAVE', id: 5 },
  ];

  const stateOptions = [
    { label: 'JALISCO', id: 1 },
    { label: 'MICHOACAN', id: 2 },
    { label: 'SINALOA', id: 3 },
    { label: 'CHIHUAHUA', id: 4 },
    { label: 'SONORA', id: 5 },

  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Typography variant="h6">Basic information</Typography>
              <Grid container spacing={3}>
                <Grid size={{ md: 6, xs: 12 }} >
                  <Controller
                    control={control}
                    name="clientName"
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Name</InputLabel>
                        <OutlinedInput {...field} />
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="crop"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.state)} fullWidth>
                        <InputLabel>Crop</InputLabel>
                        <Select
                          {...field}
                        >
                          <MenuItem value={'MAIZ'}>MAIZ</MenuItem>
                          <MenuItem value={'TRIGO'}>TRIGO</MenuItem>
                          <MenuItem value={'SORGO'}>SORGO</MenuItem>
                          <MenuItem value={'CAFE'}>CAFE</MenuItem>
                          <MenuItem value={'AGAVE'}>AGAVE</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>


                <Grid size={{ md: 6, xs: 12 }} >
                  <Controller
                    control={control}
                    name="insuredAmount"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.insuredAmount)} fullWidth>
                        <InputLabel>Insured Amount</InputLabel>
                        <OutlinedInput
                          {...field}
                          inputProps={{ step: 1 }}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.valueAsNumber;

                            if (isNaN(value)) {
                              field.onChange('');
                              return;
                            }

                            field.onChange(parseFloat(value.toFixed(2)));
                          }}
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          type="number"
                        />
                        {errors.insuredAmount ? <FormHelperText>{errors.insuredAmount.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="state"
                    render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                      <FormControl error={Boolean(errors.state)} fullWidth>

                        <Autocomplete
                          disablePortal
                          options={stateOptions}
                          getOptionLabel={(option) => option.label}
                          onChange={(event, newValue) => onChange(newValue ? newValue.label : null)} // Update RHF value
                          value={stateOptions.find(option => option.label === value) || null} // Display selected value
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State"
                              inputRef={ref} // Connect ref to RHF
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }} >

                  <Controller
                    control={control}
                    name="validFrom"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="MMM d, yyyy"
                        label="valid From"
                        onChange={(date) => {
                          field.onChange(dayjs(date).toDate());
                        }}
                        slotProps={{
                          textField: {
                            error: Boolean(errors.validFrom),
                            fullWidth: true,
                            helperText: errors.validFrom?.message,
                          },
                        }}
                        value={dayjs(field.value).toDate()}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="validTo"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        defaultValue={new Date()}
                        format="MMM d, yyyy"
                        label="valid To"
                        onChange={(date) => {
                          field.onChange(dayjs(date).toDate());
                        }}
                        slotProps={{
                          textField: {
                            error: Boolean(errors.validTo),
                            fullWidth: true,
                            helperText: errors.validTo?.message,
                          },
                        }}
                        value={dayjs(field.value).toDate()}
                      />
                    )}
                  />
                </Grid>

              </Grid>
            </Stack>
          </Stack>
          <Stack style={{ height: 450 }}>
            <Map
              style={{ height: '100%' }}
              initialViewState={{
                longitude: -91.874,
                latitude: 42.76,
                zoom: 12,

              }}
              mapStyle="mapbox://styles/mapbox/satellite-v9"
              mapboxAccessToken={TOKEN}
            >
              <DrawControl
                position="top-left"
                displayControlsDefault={false}
                controls={{
                  polygon: true,
                  trash: true
                }}
                defaultMode="draw_polygon"
                onCreate={onUpdate}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </Map>
            <ControlPanel polygons={Object.values(features)} />

          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary">Cancel</Button>
          <Button type="submit" variant="contained">
            Create Quote
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
