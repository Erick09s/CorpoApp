export default function Toast({ mensaje }) {
  if (!mensaje) return null
  return <div className="toast" role="status">✅ {mensaje}</div>
}
