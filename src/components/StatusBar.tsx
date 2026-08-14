type Props = {
  label: string;
  value: number;
  max: number;
  tone: 'health' | 'energy';
};

export function StatusBar({ label, value, max, tone }: Props) {
  const percent = Math.max(0, Math.min(100, value / max * 100));

  return (
    <div className={`status-bar status-bar--${tone}`} aria-label={`${label}: ${Math.round(value)} of ${max}`}>
      <span><b>{label}</b><i>{Math.round(value)}/{max}</i></span>
      <div><i style={{ width: `${percent}%` }} /></div>
    </div>
  );
}
