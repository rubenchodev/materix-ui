// Imports por componente (`materix-ui/components/*` y `materix-ui/core`).
import { Button } from 'materix-ui/components/button';
import { TextField } from 'materix-ui/components/text-field';
import { DatePicker, DateTimePicker } from 'materix-ui/components/date-time-picker';
import { snackbar } from 'materix-ui/components/snackbar';
import { getInstance, theme, initAll, type MtxEventDetail } from 'materix-ui/core';

const input = document.createElement('input');
const field = new TextField(input);
field.togglePasswordVisibility();
const b = getInstance<Button>(document.querySelector('.mtx-button'));
b?.setLoading(false);
const same: typeof DateTimePicker = DatePicker;
void same;
snackbar.show({ message: 'Hi' });
theme.set('dark');
initAll();
input.addEventListener('mtx:text-field:adornment-click', (event) => {
  const position: 'start' | 'end' = event.detail.position;
  void position;
});
const d: MtxEventDetail<'mtx:slider:change'> = { value: [10, 20] };
void d;
