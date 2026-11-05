import { fmtBs, datosIniciales } from '../data'

export default function HistorialFacturas({ onPagar }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>🗂️ Historial de facturas</h2>
        <span className="panel-sub">Últimos 6 períodos</span>
      </div>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Período</th><th>Factura</th><th>Consumo</th><th>Monto</th><th>Vencimiento</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {datosIniciales.historialFacturas.map((f) => (
              <tr key={f.numero}>
                <td><strong>{f.periodo}</strong></td>
                <td><code>{f.numero}</code></td>
                <td>{f.consumoKwh} kWh</td>
                <td>{fmtBs(f.monto)}</td>
                <td>{f.vencimiento}</td>
                <td>
                  <span className={`badge ${f.estado === 'Pagada' ? 'verde' : f.estado === 'Vencida' ? 'rojo' : 'amarillo'}`}>
                    {f.estado.toUpperCase()}
                  </span>
                </td>
                <td>
                  {f.estado !== 'Pagada' && (
                    <button className="btn-mini" onClick={onPagar}>Pagar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
