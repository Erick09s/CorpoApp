// Logotipo de muestra (diseño propio tipo rayo) — sustituible por el arte oficial.
export default function Logo({ size = 42, withText = true }) {
  return (
    <div className="logo">
      <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label="Logotipo de muestra">
        <defs>
          <linearGradient id="gAzul" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1256a4" />
            <stop offset="1" stopColor="#0b3d91" />
          </linearGradient>
          <linearGradient id="gAmarillo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd94a" />
            <stop offset="1" stopColor="#f0b41c" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#gAzul)" />
        <circle cx="32" cy="32" r="27" fill="none" stroke="#ffcf27" strokeWidth="3" />
        <path d="M35 14 L21 36 h9 l-3 14 L43 27 h-9 l3 -13 Z" fill="url(#gAmarillo)" />
      </svg>
      {withText && (
        <div className="logo-text">
          <strong>CORPOELEC</strong>
          <span>Corporación Eléctrica Nacional</span>
        </div>
      )}
    </div>
  )
}
