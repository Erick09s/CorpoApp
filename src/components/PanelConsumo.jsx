import { datosIniciales } from '../data'

export default function PanelConsumo() {
  const h = datosIniciales.historialFacturas
  const meses = [...h].reverse() // mayo → octubre
  const max = Math.max(...meses.map((f) => f.consumoKwh))
  const promedio = Math.round(meses.reduce((a, f) => a + f.consumoKwh, 0) / meses.length)

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>📊 Consumo de tu casa — últimos 6 meses</h2>
        <span className="panel-sub">Promedio: {promedio} kWh/mes</span>
      </div>
      <div className="chart" role="img" aria-label={`Gráfico de barras de consumo mensual en kWh`}>
        {meses.map((f, i) => (
          <div className="barra-col" key={f.periodo} title={`${f.periodo}: ${f.consumoKwh} kWh · ${f.estado}`}>
            <span className="barra-val">{f.consumoKwh}</span>
            <div className="barra-zona">
              <div
                className={`barra${i === meses.length - 1 ? ' barra-actual' : ''}`}
                style={{ height: `${Math.round((f.consumoKwh / max) * 100)}%` }}
              />
            </div>
            <span className="barra-label">{f.periodo.split(' ')[0].slice(0, 3)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
