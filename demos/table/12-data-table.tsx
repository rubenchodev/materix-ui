import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Paper } from '@rubenchodev/materix-react/components/paper';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TableToolbar,
  getComparator,
  paginateRows,
  sortRows,
  useTableSelection,
  useTableSort,
} from '@rubenchodev/materix-react/components/table';
import { TextField } from '@rubenchodev/materix-react/components/text-field';

export const title = { en: 'Data table', es: 'Tabla de datos' };
export const description = {
  en: 'A complete recipe: a toolbar with a customer search and bulk delete, selection by id that survives sorting and filtering, sortable columns, status chips and local pagination.',
  es: 'Una receta completa: barra con búsqueda de cliente y borrado en lote, selección por id que sobrevive al orden y al filtro, columnas ordenables, chips de estado y paginación local.',
};

type Status = 'paid' | 'pending' | 'shipped' | 'cancelled';

interface Order {
  id: string;
  client: string;
  status: Status;
  total: number;
}

const STATUS: Record<Status, { label: string; color: 'success' | 'warning' | 'info' | 'error' }> = {
  paid: { label: 'Paid', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  shipped: { label: 'Shipped', color: 'info' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

const INITIAL: Order[] = (
  [
    ['1001', 'Ana García', 'paid', 120], ['1002', 'Luis Pérez', 'pending', 89.5], ['1003', 'María Torres', 'shipped', 42.9],
    ['1004', 'James Parker', 'paid', 310], ['1005', 'Emily Clark', 'cancelled', 15.75], ['1006', 'Carlos Ruiz', 'shipped', 230.4],
    ['1007', 'Rose Davis', 'paid', 64], ['1008', 'Andrew Lopez', 'pending', 512.2], ['1009', 'Grace Miller', 'shipped', 98.1],
    ['1010', 'Oscar Nash', 'paid', 27.3], ['1011', 'Ellen Reed', 'pending', 145], ['1012', 'Paul Gilbert', 'shipped', 76.6],
  ] as const
).map(([id, client, status, total]) => ({ id, client, status, total }));

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function Demo() {
  const [orders, setOrders] = useState(INITIAL);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const sort = useTableSort<'client' | 'total'>({ defaultOrderBy: 'client', onSortChange: () => setPage(0) });

  const filtered = orders.filter((order) => order.client.toLowerCase().includes(query.trim().toLowerCase()));
  const sorted = sortRows(filtered, getComparator(sort.order, sort.orderBy ?? 'client', 'en'));
  const visible = paginateRows(sorted, page, rowsPerPage);
  const selection = useTableSelection(visible, (order) => order.id, { getRowLabel: (order) => order.client });

  const deleteSelected = () => {
    setOrders((current) => current.filter((order) => !selection.isSelected(order.id)));
    selection.clearSelection();
    setPage(0);
  };

  return (
    <Paper variant="outlined">
      <TableToolbar
        title="Orders"
        numSelected={selection.numSelected}
        actions={
          <TextField
            label="Search customer"
            size="small"
            type="search"
            startIcon="search"
            autoComplete="off"
            value={query}
            onChange={(_event, value) => {
              setQuery(value);
              setPage(0);
            }}
          />
        }
        selectedActions={
          <Button color="error" startIcon="delete" onClick={deleteSelected}>
            Delete
          </Button>
        }
      />
      <TableContainer>
        <Table selectable hover aria-label="Orders">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox {...selection.getHeaderCheckboxProps()} />
              </TableCell>
              <TableCell>Order</TableCell>
              <TableCell>
                <TableSortLabel {...sort.getSortLabelProps('client')}>Customer</TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">
                <TableSortLabel {...sort.getSortLabelProps('total')}>Amount</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((order) => (
              <TableRow key={order.id} {...selection.getRowProps(order)}>
                <TableCell padding="checkbox">
                  <Checkbox {...selection.getRowCheckboxProps(order)} />
                </TableCell>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>
                  <Chip label={STATUS[order.status].label} size="small" variant="outlined" color={STATUS[order.status].color} />
                </TableCell>
                <TableCell align="right">{money.format(order.total)}</TableCell>
              </TableRow>
            ))}
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No orders</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={sorted.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, -1]}
        onPageChange={(_event, next) => setPage(next)}
        onRowsPerPageChange={(_event, next) => {
          setRowsPerPage(next);
          setPage(0);
        }}
      />
    </Paper>
  );
}
