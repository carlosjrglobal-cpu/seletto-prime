import { ICONS } from './icon-data';
import { LOGO_PATHS, LOGO_VIEWBOX } from './logo-data';

export function Icon({ n, className }: { n: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[n] || '' }}
    />
  );
}

export function Logo() {
  return <svg viewBox={LOGO_VIEWBOX} fill="currentColor" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: LOGO_PATHS }} />;
}
