export default function Spinner({ fullPage = false, label = 'Loading…' }) {
  return (
    <div className={fullPage ? 'spinner-page' : 'spinner-inline'} role="status">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
