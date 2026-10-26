import { useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Checkbox } from '@rubenchodev/materix-react/components/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTableSelection,
} from '@rubenchodev/materix-react/components/table';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The selection API (`selectAll`, `clearSelection`, `toggleRow`, `setSelected`) and a remote pagination with `count={48}` controlled by the parent. The log shows `onSelectionChange`, `onPageChange` and `onRowsPerPageChange`, the equivalents of the vanilla events.',
  es: 'La API de selección (`selectAll`, `clearSelection`, `toggleRow`, `setSelected`) y una paginación remota con `count={48}` controlada por el padre. El registro muestra `onSelectionChange`, `onPageChange` y `onRowsPerPageChange`, los equivalentes de los eventos de vanilla.',
};

const TEAM = [
  { id: 'ana', name: 'Ana García' },
  { id: 'luis', name: 'Luis Pérez' },
  { id: 'maria', name: 'María Torres' },
];

export default function Demo() {
  const [log, setLog] = useState<string[]>([]);
  const [count, setCount] = useState(48);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [disabled, setDisabled] = useState(false);
  const write = (line: string) => setLog((lines) => [line, ...lines].slice(0, 6));
  const selection = useTableSelection(TEAM, (row) => row.id, {
    getRowLabel: (row) => row.name,
    onSelectionChange: (selected, detail) => write(`selection-change ${JSON.stringify(selected)} (${detail.reason})`),
  });
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button variant="outlined" onClick={selection.selectAll}>selectAll()</Button>
        <Button variant="outlined" onClick={selection.clearSelection}>clearSelection()</Button>
        <Button variant="outlined" onClick={() => selection.toggleRow('maria')}>toggleRow(&apos;maria&apos;)</Button>
        <Button variant="outlined" onClick={() => selection.setSelected(['ana'])}>setSelected([&apos;ana&apos;])</Button>
      </div>
      <TableContainer>
        <Table selectable size="small" aria-label="Team (API)">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <span className="mtx-visually-hidden">Select</span>
                <Checkbox {...selection.getHeaderCheckboxProps()} />
              </TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TEAM.map((row) => (
              <TableRow key={row.id} {...selection.getRowProps(row)}>
                <TableCell padding="checkbox">
                  <Checkbox {...selection.getRowCheckboxProps(row)} />
                </TableCell>
                <TableCell>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        disabled={disabled}
        showFirstButton
        showLastButton
        onPageChange={(_event, next, detail) => {
          setPage(next);
          write(`page-change ${next} (${detail.reason})`);
        }}
        onRowsPerPageChange={(_event, next) => {
          setRowsPerPage(next);
          setPage(0);
          write(`rows-per-page-change ${next}`);
        }}
      />
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setPage(0)}>page = 0</Button>
        <Button variant="outlined" onClick={() => setPage((p) => Math.min(lastPage, p + 1))}>page + 1</Button>
        <Button variant="outlined" onClick={() => setPage(lastPage)}>last page</Button>
        <Button variant="outlined" onClick={() => setPage(2)}>page = 2</Button>
        <Button variant="outlined" onClick={() => setCount(120)}>count = 120</Button>
        <Button variant="outlined" onClick={() => setDisabled((value) => !value)}>disabled = {String(!disabled)}</Button>
      </div>
      <pre className="demo-log" aria-live="polite">{log.join('\n')}</pre>
    </div>
  );
}
