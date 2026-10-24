import { Link } from '@rubenchodev/materix-react/components/link';

export const title = { en: 'Basic usage', es: 'Uso básico' };
export const description = {
  en: 'A single `<Link href>`. With no other props it uses the primary color and is always underlined (MUI v5 default), so it never relies on color alone.',
  es: 'Un solo `<Link href>`. Sin más props usa el color primario y va siempre subrayado (por defecto en MUI v5), así que nunca depende solo del color.',
};

export default function Demo() {
  return (
    <div className="demo-row">
      <Link href="#basic">View documentation</Link>
      <Link href="#basic" color="secondary">
        Services
      </Link>
      <Link href="#basic" underline="hover">
        Terms
      </Link>
    </div>
  );
}
