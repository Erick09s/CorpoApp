import { useState } from 'react'
import { fmtBs, diasPara, datosIniciales } from '../data'

const METODOS = [
  {
    id: 'pago-movil',
    nombre: 'Pago móvil',
    detalle: 'Débito inmediato desde tu teléfono',
    campos: [
      { key: 'banco', etiqueta: 'Banco emisor', tipo: 'select', opciones: ['Banco de Venezuela (0102)', 'Banesco (0134)', 'Mercantil (0105)', 'Provincial (0108)', 'Banco Nacional de Crédito (0191)'] },
      { key: 'telefono', etiqueta: 'Teléfono afiliado', tipo: 'tel', placeholder: '0414-1234567' },
    ],
  },
  {
    id: 'tdd',
    nombre: 'Tarjeta de débito',
    detalle: 'Punto de venta virtual (TDD)',
    campos: [
      { key: 'tarjeta', etiqueta: 'Número de tarjeta', tipo: 'text', placeholder: '0000 0000 0000 0000' },
      { key: 'banco', etiqueta: 'Banco emisor', tipo: 'select', opciones: ['Banco de Venezuela (0102)', 'Banesco (0134)', 'Mercantil (0105)', 'Provincial (0108)'] },
    ],
  },
  {
    id: 'transferencia',
    nombre: 'Transferencia',
    detalle: 'Desde tu cuenta bancaria',
    campos: [
      { key: 'cuenta', etiqueta: 'Cuenta origen', tipo: 'text', placeholder: '0102-0000-00-0000000000' },
      { key: 'banco', etiqueta: 'Banco emisor', tipo: 'select', opciones: ['Banco de Venezuela (0102)', 'Banesco (0134)', 'Mercantil (0105)', 'Provincial (0108)'] },
    ],
  },
]

const BANKS_DEFAULT = {
  'pago-movil': { banco: 'Banco de Venezuela (0102)', telefono: '0414-1234567' },
  tdd: { tarjeta: '4563 **** **** 0921', banco: 'Banesco (0134)' },
  transferencia: { cuenta: '0102-0000-00-4578991201', banco: 'Banco de Venezuela (0102)' },
}

export default function ModalPago({ abierto, deuda, onPagar, onCerrar }) {
  const [paso, setPaso] = useState(0)
  const [monto, setMonto] = useState(null)
  const [montoLibre, setMontoLibre] = useState('')
  const [metodoId, setMetodoId] = useState(null)
  const [campos, setCampos] = useState({})
  const [procesando, setProcesando] = useState(false)
  const [comprobante, setComprobante] = useState(null)

  if (!abierto) return null

  const total = deuda.facturaVigente + deuda.saldoVencido
  const dias = diasPara(datosIniciales.medicion.vencimiento)
  const valorelegidos = { ...(metodoId ? BANKS_DEFAULT[metodoId] : {}), ...campos }

  const cerrar = () => {
    onCerrar()
    setTimeout(() => {
      setPaso(0); setMonto(null); setMontoLibre(''); setMetodoId(null)
      setCampos({}); setProcesando(false); setComprobante(null)
    }, 300)
  }

  const montoEfectivo = monto === 'total' ? total : monto === 'parcial' ? Number(montoLibre) : NaN
  const montoValido = montoEfectivo > 0 && montoEfectivo <= total + 0.005

  const metodo = METODOS.find((m) => m.id === metodoId)
  const metodoValido = metodo && metodo.campos.every((c) => (valorelegidos[c.key] || '').trim().length >= 4)

  const confirmar = () => {
    setProcesando(true)
    setTimeout(() => {
      setProcesando(false)
      setComprobante({
        referencia: 'CE-' + Math.floor(100_000_000 + Math.random() * 900_000_000),
        fecha: new Date(),
      })
      setPaso(3)
    }, 1600)
  }

  const finalizar = () => {
    onPagar({
      monto: montoEfectivo,
      metodo: `${metodo.nombre} · ${valorelegidos.banco}`,
      referencia: comprobante.referencia,
    })
    cerrar()
  }

  return (
    <div className="overlay" onClick={procesando ? undefined : cerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Pagar factura">
        <div className="modal-cabecera">
          <h2>⚡ Pagar servicio eléctrico</h2>
          <button className="cerrar" onClick={cerrar} disabled={procesando} aria-label="Cerrar">✕</button>
        </div>
        <div className="stepper">
          {['Monto', 'Método', 'Confirmar'].map((s, i) => (
            <div key={s} className={`paso ${i <= Math.min(paso, 2) ? 'activo' : ''}`}>
              <span className="paso-num">{comprobante && i === 2 ? '✓' : i + 1}</span> {s}
            </div>
          ))}
        </div>

        {/* PASO 1 · MONTO */}
        {paso === 0 && (
          <div className="modal-cuerpo">
            <p className="deuda-linea">
              Deuda total: <strong>{fmtBs(total)}</strong>{' '}
              <span className={`badge ${dias < 0 ? 'rojo' : 'amarillo'}`}>
                {dias < 0 ? 'VENCIDA' : `vence en ${dias} días`}
              </span>
            </p>
            <label className={`opcion-monto${monto === 'total' ? ' activa' : ''}`} onClick={() => setMonto('total')}>
              <input type="radio" checked={monto === 'total'} onChange={() => {}} />
              <div><strong>Pagar el total</strong><span>{fmtBs(total)}</span></div>
            </label>
            <label className={`opcion-monto${monto === 'parcial' ? ' activa' : ''}`} onClick={() => setMonto('parcial')}>
              <input type="radio" checked={monto === 'parcial'} onChange={() => {}} />
              <div><strong>Pago parcial (abono)</strong><span>ingresa el monto</span></div>
            </label>
            {monto === 'parcial' && (
              <div className="campo">
                <label>Monto en bolívares (Bs.)</label>
                <input
                  autoFocus
                  type="number"
                  min="0"
                  step="0.01"
                  value={montoLibre}
                  onChange={(e) => setMontoLibre(e.target.value)}
                  placeholder={`Máx. ${fmtN(total)}`}
                />
                <div className="chips">
                  {[0.25, 0.5, 0.75].map((p) => (
                    <button key={p} onClick={() => setMontoLibre((total * p).toFixed(2))}>
                      {p * 100} % · {fmtBs(total * p)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {monto === 'parcial' && Number(montoLibre) > total && (
              <p className="error">El monto no puede superar la deuda ({fmtBs(total)}).</p>
            )}
            <button className="btn-grande" disabled={!montoValido} onClick={() => setPaso(1)}>
              Continuar →
            </button>
          </div>
        )}

        {/* PASO 2 · MÉTODO */}
        {paso === 1 && (
          <div className="modal-cuerpo">
            <div className="metodos">
              {METODOS.map((m) => (
                <label key={m.id} className={`metodo${metodoId === m.id ? ' activo' : ''}`}>
                  <input type="radio" name="metodo" checked={metodoId === m.id} onChange={() => { setMetodoId(m.id); setCampos({}) }} />
                  <div><strong>{m.nombre}</strong><span>{m.detalle}</span></div>
                </label>
              ))}
            </div>

            {metodo && (
              <div className="metodo-campos">
                {metodo.campos.map((c) => (
                  <div className="campo" key={c.key}>
                    <label>{c.etiqueta}</label>
                    {c.tipo === 'select' ? (
                      <select value={valorelegidos[c.key] ?? ''} onChange={(e) => setCampos({ ...campos, [c.key]: e.target.value })}>
                        {c.opciones.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={c.tipo}
                        placeholder={c.placeholder}
                        value={valorelegidos[c.key] ?? ''}
                        onChange={(e) => setCampos({ ...campos, [c.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="botones-dobles">
              <button className="btn-sec" onClick={() => setPaso(0)} disabled={procesando}>← Volver</button>
              <button className="btn-grande" disabled={!metodoValido} onClick={() => setPaso(2)}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* PASO 2b · CONFIRMAR / PROCESANDO */}
        {paso === 2 && (
          <div className="modal-cuerpo">
            {procesando ? (
              <div className="procesando">
                <span className="spinner" />
                <p>Procesando tu pago de <strong>{fmtBs(montoEfectivo)}</strong>…</p>
                <small>No cierres esta ventana.</small>
              </div>
            ) : (
              <>
                <p className="resumen-fila"><span>Cliente</span><strong>{datosIniciales.cliente.titular}</strong></p>
                <p className="resumen-fila"><span>Contrato</span><strong>{datosIniciales.cliente.contrato}</strong></p>
                <p className="resumen-fila"><span>Método</span><strong>{metodo.nombre}</strong></p>
                <p className="resumen-fila"><span>Monto</span><strong>{fmtBs(montoEfectivo)}</strong></p>
                <p className="resumen-fila"><span>Saldo restante</span><strong>{fmtBs(total - montoEfectivo)}</strong></p>
                <div className="botones-dobles">
                  <button className="btn-sec" onClick={() => setPaso(1)}>← Volver</button>
                  <button className="btn-grande" onClick={confirmar}>✔ Confirmar pago</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PASO 3 · COMPROBANTE */}
        {paso === 3 && comprobante && (
          <div className="modal-cuerpo comprobante">
            <div className="check">✓</div>
            <h3>¡Pago registrado con éxito!</h3>
            <p className="resumen-fila"><span>Monto pagado</span><strong>{fmtBs(montoEfectivo)}</strong></p>
            <p className="resumen-fila"><span>Método</span><strong>{metodo.nombre} · {valorelegidos.banco}</strong></p>
            <p className="resumen-fila"><span>Referencia</span><code>{comprobante.referencia}</code></p>
            <p className="resumen-fila"><span>Fecha</span><strong>{fechaComprobante(comprobante.fecha)}</strong></p>
            <p className="resumen-fila"><span>Saldo restante</span><strong>{fmtBs(total - montoEfectivo)}</strong></p>
            <small className="nota-demo">Comprobante de demostración. Recibirás la factura sellada en tu correo.</small>
            <button className="btn-grande" onClick={finalizar}>Finalizar</button>
          </div>
        )}
      </div>
    </div>
  )
}

// helpers locales
function fmtN(n) {
  const fixed = Math.abs(n).toFixed(2)
  const [int, frac] = fixed.split('.')
  const sign = n < 0 ? '-' : ''
  return `${sign}${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${frac ? ',' + frac : ''}`
}

function fechaComprobante(d) {
  const pad = (x) => String(x).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
