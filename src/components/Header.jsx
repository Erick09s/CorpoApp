import Logo from './Logo'
import { datosIniciales } from '../data'

export default function Header() {
  const c = datosIniciales.cliente

  return (
    <header className="header">
      <div className="header-inner">
        <Logo />
        <div className="header-right">
          <div className="user-chip">
            <div className="avatar">MR</div>
            <div className="user-datos">
              <strong>{c.titular}</strong>
              <span>{c.cedula}</span>
            </div>
          </div>
          <button className="btn-sec btn-oscuro">Cerrar sesión</button>
        </div>
      </div>
    </header>
  )
}
