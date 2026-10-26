import { Avatar, AvatarGroup, type AvatarColor } from '@rubenchodev/materix-react/components/avatar';

export const title = { en: 'Grouping', es: 'Agrupación' };
export const description = {
  en: '`AvatarGroup` overlaps avatars. `max` also counts the `+N` indicator, `total` indicates users that are not rendered and `spacing` sets the overlap (`medium`, `small` or pixels).',
  es: '`AvatarGroup` solapa avatares. `max` cuenta también el indicador `+N`, `total` indica usuarios que no se renderizan y `spacing` fija el solapamiento (`medium`, `small` o píxeles).',
};

const abc: Array<[string, AvatarColor]> = [['A', 'primary'], ['B', 'secondary'], ['C', 'success']];

export default function Demo() {
  return (
    <>
      <div className="demo-group">
        <span className="demo-label">max={'{4}'} con 6 hijos</span>
        <div className="demo-row">
          <AvatarGroup max={4} label="Participantes">
            <Avatar src="https://i.pravatar.cc/120?img=5" alt="Ana García" />
            <Avatar src="https://i.pravatar.cc/120?img=12" alt="Carlos Ruiz" />
            <Avatar color="primary">LM</Avatar>
            <Avatar color="secondary">JP</Avatar>
            <Avatar color="success">OT</Avatar>
            <Avatar color="warning">AS</Avatar>
          </AvatarGroup>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">total={'{24}'} con 3 hijos</span>
        <div className="demo-row">
          <AvatarGroup max={3} total={24} label="Equipo de diseño" surplusLabel="{count} personas más">
            <Avatar color="info">RD</Avatar>
            <Avatar color="error">JM</Avatar>
            <Avatar color="primary">LC</Avatar>
          </AvatarGroup>
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Spacing: medium · small · 0</span>
        <div className="demo-row mtx-gap-3">
          {(['medium', 'small', 0] as const).map((spacing) => (
            <AvatarGroup key={spacing} spacing={spacing} label={`Espaciado ${spacing}`}>
              {abc.map(([letter, color]) => (
                <Avatar key={letter} color={color}>{letter}</Avatar>
              ))}
            </AvatarGroup>
          ))}
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Tamaño small en un grupo</span>
        <div className="demo-row">
          <AvatarGroup max={4} label="Revisores">
            {(['primary', 'secondary', 'success', 'info', 'error'] as const).map((color, i) => (
              <Avatar key={color} size="small" color={color}>
                {String.fromCharCode(65 + i)}
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </div>
    </>
  );
}
