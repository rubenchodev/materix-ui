import { Chip } from '@rubenchodev/materix-react/components/chip';
import { Avatar } from '@rubenchodev/materix-react/components/avatar';

export const title = { en: 'With icons and avatar', es: 'Con iconos y avatar' };
export const description = {
  en: '`icon` adds a start icon, `avatar` shows an Avatar and `onDelete` adds the trailing delete icon (replaceable with `deleteIcon`).',
  es: '`icon` añade un icono inicial, `avatar` muestra un Avatar y `onDelete` añade el icono de eliminar (sustituible con `deleteIcon`).',
};

export default function Demo() {
  return (
    <div className="demo-stack">
      <div className="demo-group">
        <span className="demo-label">No icon · start icon · end icon · both</span>
        <div className="demo-row">
          <Chip label="No icon" />
          <Chip label="Start icon" icon="face" />
          <Chip label="End icon" onDelete={() => {}} />
          <Chip label="Both" icon="check_circle" color="success" onDelete={() => {}} />
          <Chip
            label="Custom delete icon"
            variant="outlined"
            onDelete={() => {}}
            deleteIcon={
              <span className="material-icons" aria-hidden="true">
                cancel
              </span>
            }
          />
        </div>
      </div>
      <div className="demo-group">
        <span className="demo-label">Avatar</span>
        <div className="demo-row">
          <Chip label="Jane Cooper" avatar={
              <Avatar size="small" color="primary">
                J
              </Avatar>
            } />
          <Chip
            label="Robert Fox"
            variant="outlined"
            onDelete={() => {}}
            avatar={
              <Avatar size="small" src="https://i.pravatar.cc/80?img=12" alt="" />
            }
          />
        </div>
      </div>
    </div>
  );
}
