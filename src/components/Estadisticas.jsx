import { fmtBs, datosIniciales, deudaInicial, diasPara } from '../data'

export default function Estadisticas({ deuda, onPagar }) {
  const m = datosIniciales.medicion
  const total = deuda.facturaVigente + deuda.saldoVencido
  const dias = diasPara(m.vencimiento)
  const vencida = dias < 0
  const alDia = total <= 0.005
  const variacion = ((m.consumoKwh - m.consumoAnteriorKwh) / m.consumoAnteriorKwh) * 100

  return (
    <section className="stat-grid">
      <div className="panel stat-card">
        <span className="stat-titulo">⚡ Consumo del período</span>
        <span className="stat-valor">{m.consumoKwh} <small>kWh</small></span>
        <span className="stat-sub">{m.periodo} · corte {m.fechaCorte} · {m.diasFacturados} días</span>
        <span className="stat-extra">
          <span className={`badge ${variacion <= 0 ? 'verde' : 'rojo'}`}>
            {variacion <= 0 ? '▼' : '▲'} {Math.abs(variacion).toFixed(1).replace('.', ',')} % vs. mes anterior
          </span>
          ≈ {(m.consumoKwh / m.diasFacturados).toFixed(1).replace('.', ',')} kWh/día
        </span>
      </div>

      <div className="panel stat-card destacado">
        <span className="stat-titulo">💳 Monto a pagar</span>
        <span className="stat-valor">{fmtBs(total)}</span>
        {alDia ? (
          <span className="badge verde">✓ Al día</span>
        ) : vencida ? (
          <span className="stat-sub">
            Incluye <strong>{fmtBs(deuda.saldoVencido)}</strong> vencido el {m.vencimientoAnterior}
          </span>
        ) : (
          <span className="stat-sub">
            Factura de {m.periodo} + saldo anterior ·{' '}
            <strong>vence en {dias} días</strong> ({m.vencimiento})
          </span>
        )}
        <button className="btn-grande" onClick={onPagar} disabled={alDia}>
          {alDia ? 'No hay deuda pendiente' : 'Pagar ahora'}
        </button>
      </div>

      <div className="panel stat-card">
        <span className="stat-titulo">🏠 Tu servicio</span>
        <span className="stat-valor">Activo <span className="badge verde">EN SERVICIO</span></span>
        <span className="stat-sub">{datosIniciales.cliente.tarifa}</span>
        <span className="stat-extra">
          Medidor <strong>{datosIniciales.cliente.medidor}</strong> · última lectura {m.fechaLecturaAnterior}
        </span>
      </div>
    </section>
  )
}
