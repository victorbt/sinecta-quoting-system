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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

export function InvoiceCreateForm({
  submit
}: any): React.JSX.Element {
  const router = useRouter();

  let priceStockClient = new quotingsystem(
    {
      BASE: 'http://localhost:3000'
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

        let createReq = await priceStockClient.quotes.create(getValues())
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

  // const handleAddLineItem = React.useCallback(() => {
  //   const lineItems = getValues('lineItems');

  //   setValue('lineItems', [
  //     ...lineItems,
  //     { id: `LI-${lineItems.length + 1}`, description: '', service: '', quantity: 1, unitPrice: 0 },
  //   ]);
  // }, [getValues, setValue]);

  // const handleRemoveLineItem = React.useCallback(
  //   (lineItemId: string) => {
  //     const lineItems = getValues('lineItems');

  //     setValue(
  //       'lineItems',
  //       lineItems.filter((lineItem) => lineItem.id !== lineItemId)
  //     );
  //   },
  //   [getValues, setValue]
  // );

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
                <Grid size={{ md: 6, xs: 12 }} >

                  <Controller
                    control={control}
                    name="validFrom"
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="MMM D, YYYY"
                        label="Issue date"
                        onChange={(date) => {
                          field.onChange((date as any)?.toDate());
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
                        format="MMM D, YYYY"
                        label="Due date"
                        onChange={(date) => {
                          field.onChange((date as any)?.toDate());
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
                {/* <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="taxId"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.taxId)} fullWidth>
                        <InputLabel>Tax ID</InputLabel>
                        <OutlinedInput {...field} placeholder="e.g EU372054390" />
                        {errors.taxId ? <FormHelperText>{errors.taxId.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid> */}
              </Grid>
            </Stack>
            {/* <Grid container spacing={3}>
              <Grid md={4} xs={12}>
                <Controller
                  control={control}
                  name="discount"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.discount)} fullWidth>
                      <InputLabel>Discount</InputLabel>
                      <OutlinedInput
                        {...field}
                        inputProps={{ step: 0.01 }}
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
                      {errors.discount ? <FormHelperText>{errors.discount.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={4} xs={12}>
                <Controller
                  control={control}
                  name="shippingRate"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.shippingRate)} fullWidth>
                      <InputLabel>Shipping rate</InputLabel>
                      <OutlinedInput
                        {...field}
                        inputProps={{ step: 0.01 }}
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
                      {errors.shippingRate ? <FormHelperText>{errors.shippingRate.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={4} xs={12}>
                <Controller
                  control={control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.taxRate)} fullWidth>
                      <InputLabel>Tax rate (%)</InputLabel>
                      <OutlinedInput
                        {...field}
                        inputProps={{ step: 0.01 }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const value = event.target.valueAsNumber;

                          if (isNaN(value)) {
                            field.onChange('');
                            return;
                          }

                          if (value > 100) {
                            field.onChange(100);
                            return;
                          }

                          field.onChange(parseFloat(value.toFixed(2)));
                        }}
                        type="number"
                      />
                      {errors.taxRate ? <FormHelperText>{errors.taxRate.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid> */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Stack spacing={2} sx={{ width: '300px', maxWidth: '100%' }}>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">Discount</Typography>
                  <Typography variant="body2">
                    {discount
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(discount)
                      : '-'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">
                    {shippingRate
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(shippingRate)
                      : '-'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">Taxes</Typography>
                  <Typography variant="body2">
                    {tax ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tax) : '-'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                  </Typography>
                </Stack>
              </Stack>
            </Box> */}
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary">Cancel</Button>
          <Button type="submit" variant="contained">
            Create Process
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
