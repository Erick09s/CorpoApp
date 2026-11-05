import { fmtBs, datosIniciales, diasPara } from '../data'

export default function PanelFactura({ deuda, onPagar }) {
  const m = datosIniciales.medicion
  const f = datosIniciales.facturaActual
  const total = deuda.facturaVigente + deuda.saldoVencido
  const dias = diasPara(m.vencimiento)

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>🧾 Factura actual</h2>
        <span className="panel-sub">{m.periodo} ·	emitida el {m.fechaEmision}</span>
      </div>

      <table className="tabla-factura">
        <tbody>
          <tr><td>Energía consumida ({m.consumoKwh} kWh × 1,85 Bs)</td><td>{fmtBs(f.energia)}</td></tr>
          <tr><td>Cargo fijo mensual</td><td>{fmtBs(f.cargoFijo)}</td></tr>
          <tr><td>Aseo urbano y alumbrado público</td><td>{fmtBs(f.alumbrado)}</td></tr>
          <tr className={`fila-saldo${f.saldoAnterior > 0 ? ' alerta' : ''}`}>
            <td>Saldo de períodos anteriores <span className="badge rojo">VENCIDO {m.vencimientoAnterior}</span></td>
            <td>{fmtBs(f.saldoAnterior)}</td>
          </tr>
          <tr className="fila-total"><td>Total a pagar</td><td>{fmtBs(total)}</td></tr>
        </tbody>
      </table>

      <div className="detalle-factura">
        <span><strong>Medidor:</strong> {datosIniciales.cliente.medidor} · lectura anterior {m.lecturaAnterior} → actual {m.lecturaActual}</span>
        <span><strong>Domicilio:</strong> {datosIniciales.cliente.direccion}</span>
        <span><strong>Contrato:</strong> {datosIniciales.cliente.contrato}</span>
        <span>{dias < 0 ? '⚠️ Factura vencida, regularice su pago para evitar corte del servicio.' : `📅 Vence el ${m.vencimiento} (en ${dias} días).`}</span>
      </div>

      <div className="acciones-factura">
        <button className="btn-grande" onClick={onPagar} disabled={total <= 0.005}>
          Pagar {fmtBs(total)}
        </button>
        <button className="btn-sec" title="Función disponible próximamente">Descargar PDF</button>
      </div>
    </section>
  )
}
