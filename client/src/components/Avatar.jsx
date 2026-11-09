// Initial-letter avatars. Color is picked from the name so the same person
// always gets the same color everywhere in the app.
const COLORS = [
  { bg: '#2d6a4f', fg: '#ffffff' },
  { bg: '#f4a261', fg: '#1b1b1b' },
  { bg: '#7cc6b8', fg: '#1b1b1b' },
  { bg: '#f6d55c', fg: '#1b1b1b' },
];

function colorFor(name = '') {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return COLORS[sum % COLORS.length];
}

export function Avatar({ name = '?', size = 36 }) {
  const { bg, fg } = colorFor(name);
  return (
    <span
      className="avatar"
      title={name}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.38 }}
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}

export function AvatarStack({ people = [], max = 4, size = 34 }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className="avatar-stack" aria-label={people.map((p) => p.name).join(', ')}>
      {shown.map((p) => (
        <Avatar key={p._id} name={p.name} size={size} />
      ))}
      {extra > 0 && (
        <span className="avatar avatar-more" style={{ width: size, height: size }}>
          +{extra}
        </span>
      )}
    </span>
  );
}
