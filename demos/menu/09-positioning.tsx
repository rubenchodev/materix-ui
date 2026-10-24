import { useRef, useState } from 'react';
import { Button } from '@rubenchodev/materix-react/components/button';
import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Menu, MenuItem, useMenu } from '@rubenchodev/materix-react/components/menu';

export const title = { en: 'Positioning', es: 'Posicionamiento' };
export const description = {
  en: 'It opens below the anchor, aligned to its start edge; if it does not fit, it flips upwards and keeps that side while the page scrolls. `matchWidth` matches the anchor width, `placement` changes the preferred side and `anchorEl` can be any element (here a Chip).',
  es: 'Se abre bajo el ancla, alineado a su borde inicial; si no cabe, voltea hacia arriba y conserva ese lado mientras la página se desplaza. `matchWidth` iguala el ancho del ancla, `placement` cambia el lado preferido y `anchorEl` puede ser cualquier elemento (aquí un Chip).',
};

const SORTS = ['Relevance', 'Newest', 'Price'];
const FILTERS = ['All', 'Active', 'Archived'];

export default function Demo() {
  const sort = useMenu();
  const top = useMenu();
  const [sortBy, setSortBy] = useState('Relevance');
  const chipRef = useRef<HTMLElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  return (
    <div className="demo-row">
      <div className="demo-group">
        <span className="demo-label">matchWidth</span>
        <div className="demo-row">
          <Button variant="contained" {...sort.triggerProps}>
            Sort by: {sortBy.toLowerCase()}
          </Button>
          <Menu {...sort.menuProps} matchWidth onSelect={({ value }) => value && setSortBy(value)}>
            {SORTS.map((s) => (
              <MenuItem key={s} value={s} selected={s === sortBy}>
                {s}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">placement=&quot;top-start&quot;</span>
        <div className="demo-row">
          <Button variant="outlined" {...top.triggerProps}>
            Open upwards
          </Button>
          <Menu {...top.menuProps} placement="top-start">
            <MenuItem>Above</MenuItem>
            <MenuItem>The trigger</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">anchorEl = Chip</span>
        <div className="demo-row">
          <Chip
            ref={chipRef}
            variant="outlined"
            label={`Filter: ${filter.toLowerCase()}`}
            clickable
            aria-haspopup="menu"
            aria-expanded={filterOpen}
            aria-controls={filterOpen ? 'menu-anchor-chip' : undefined}
            onClick={() => setFilterOpen((v) => !v)}
          />
          <Menu
            id="menu-anchor-chip"
            open={filterOpen}
            anchorEl={chipRef}
            onClose={() => setFilterOpen(false)}
            onSelect={({ value }) => value && setFilter(value)}
          >
            {FILTERS.map((f) => (
              <MenuItem key={f} value={f} selected={f === filter}>
                {f}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  );
}
