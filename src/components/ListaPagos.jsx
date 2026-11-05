import { fmtBs, datosIniciales } from '../data'

export default function ListaPagos({ pagos }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>💳 Últimos pagos</h2>
        <span className="panel-sub">{pagos.length} registro(s)</span>
      </div>
      {pagos.length === 0 ? (
        <p className="vacio">No hay pagos registrados en este período.</p>
      ) : (
        <ul className="lista-pagos">
          {pagos.map((p) => (
            <li key={p.referencia}>
              <div>
                <strong>{fmtBs(p.monto)}</strong>
                <span className="pago-metodo">{p.metodo}</span>
                <code>{p.referencia}</code>
              </div>
              <span className="pago-fecha">{p.fecha}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
