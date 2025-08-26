import NextLink from 'next/link';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import {
  Avatar,
  Card,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../core/scrollbar';
import { paths } from '../../paths';
// import { getInitials } from '../../../utils/get-initials';
// import { SeverityPill } from '../../../components/severity-pill';

const groupProcesses = (processes: any) => {
  return processes.reduce((acc: any, process: any) => {
    console.log(process)
    //const {  } = process;

    let status = 'valid'

    return {
      ...acc,
      [status]: [...acc[status], process]
    };
  }, {
    valid: [],
    expired: []
  });
};

const statusColorsMap: any = {
  valid: 'success',
  expired: 'error',
};

const ProcessRow = (props: any) => {
  const { process, ...other } = props;

  const statusColor = statusColorsMap[process.status];
  const totalAmount = numeral(process.totalAmount).format('0,0.00');
  const issueDate = process.issueDate && format(process.issueDate, 'dd/MM/yyyy');
  const dueDate = process.dueDate && format(process.dueDate, 'dd/MM/yyyy');

  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      {...other}>
      <TableCell width="25%">
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          component={NextLink}
          href={paths.quotes.detail('1')}
          sx={{
            display: 'inline-flex',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {/* <Avatar
            sx={{
              height: 42,
              width: 42
            }}
          >
             {getInitials(process.customer.name)} 
          </Avatar> */}
          <div>
            <Typography
              color="text.primary"
              variant="h6"
            >
              {process.name}
            </Typography>
            {/* <Typography
              color="text.secondary"
              variant="body2"
            >
              {process.customer.name}
            </Typography> */}
          </div>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">
          {/* {process.currency} */}
          {totalAmount} Updated Products
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">
          Issued
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {issueDate}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">
          Complete
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {dueDate}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {/* <SeverityPill color={statusColor}>
          {process.status}
        </SeverityPill> */}
      </TableCell>
      <TableCell align="right">
        <IconButton
          component={NextLink}
          href={paths.quotes.detail('1')}
        >
          <SvgIcon>
            <ArrowRightIcon />
          </SvgIcon>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export const ProcessListTable = (props: any) => {
  const {
    group,
    processes,
    processesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;

  let content;

  if (group) {
    const groupedProcesss = groupProcesses(processes);
    const statuses = Object.keys(groupedProcesss);

    content = (
      <Stack spacing={6}>
        {statuses.map((status) => {
          const groupTitle = status.charAt(0).toUpperCase() + status.slice(1);
          const count = groupedProcesss[status].length;
          const processes = groupedProcesss[status];
          const hasProcesss = processes.length > 0;

          return (
            <Stack
              key={groupTitle}
              spacing={2}
            >
              <Typography
                color="text.secondary"
                variant="h6"
              >
                {groupTitle}
                {' '}
                ({count})
              </Typography>
              {hasProcesss && (
                <Card>
                  <Scrollbar>
                    <Table sx={{ minWidth: 600 }}>
                      <TableBody>
                        {processes.map((process: any) => (
                          <ProcessRow
                            key={process.id}
                            process={process}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Card>
              )}
            </Stack>
          );
        })}
      </Stack>
    );
  } else {
    content = (
      <Card>
        <Table>
          <TableBody>
            {processes.map((process: any) => (
              <ProcessRow
                key={process.id}
                process={process}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <Stack
      spacing={4}
      {...other}>
      {content}
      <TablePagination
        component="div"
        count={processesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Stack>
  );
};

ProcessListTable.propTypes = {
  group: PropTypes.bool,
  processes: PropTypes.array.isRequired,
  processesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
