import { useRef, useState } from 'react';
import { Accordion, AccordionGroup } from '@rubenchodev/materix-react/components/accordion';
import type { AccordionGroupActions } from '@rubenchodev/materix-react/components/accordion';
import { Button } from '@rubenchodev/materix-react/components/button';

export const title = { en: 'Programmatic usage', es: 'Uso programático' };
export const description = {
  en: 'The vanilla `expand()`, `collapse()` and `toggle()` become the controlled `expanded` prop with `onChange` (the `mtx:accordion:change` event). `actionRef` exposes `expandAll()` and `collapseAll()` of the group.',
  es: '`expand()`, `collapse()` y `toggle()` de vanilla pasan a ser la prop controlada `expanded` con `onChange` (el evento `mtx:accordion:change`). `actionRef` expone `expandAll()` y `collapseAll()` del grupo.',
};

export default function Demo() {
  const [expanded, setExpanded] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const group = useRef<AccordionGroupActions>(null);
  const write = (text: string) => setLog((prev) => [...prev.slice(-5), text]);

  return (
    <div className="demo-stack demo-wide">
      <Accordion
        summary="Panel controlled by state"
        expanded={expanded}
        onChange={(_, next) => {
          setExpanded(next);
          write(`onChange → expanded = ${next}`);
        }}
      >
        Content managed from React.
      </Accordion>
      <div className="demo-row">
        <Button variant="outlined" onClick={() => setExpanded(true)}>
          Expand
        </Button>
        <Button variant="outlined" onClick={() => setExpanded(false)}>
          Collapse
        </Button>
        <Button variant="outlined" onClick={() => setExpanded((value) => !value)}>
          Toggle
        </Button>
      </div>
      <AccordionGroup exclusive={false} actionRef={group}>
        <Accordion summary="Group panel 1">One.</Accordion>
        <Accordion summary="Group panel 2">Two.</Accordion>
      </AccordionGroup>
      <div className="demo-row">
        <Button variant="outlined" onClick={() => group.current?.expandAll()}>
          expandAll()
        </Button>
        <Button variant="outlined" onClick={() => group.current?.collapseAll()}>
          collapseAll()
        </Button>
      </div>
      <pre className="demo-log" aria-live="polite">
        {log.join('\n')}
      </pre>
    </div>
  );
}
