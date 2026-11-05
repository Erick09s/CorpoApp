import { useState, useEffect } from 'react'
import Header from './components/Header'
import Estadisticas from './components/Estadisticas'
import PanelConsumo from './components/PanelConsumo'
import PanelFactura from './components/PanelFactura'
import HistorialFacturas from './components/HistorialFacturas'
import ListaPagos from './components/ListaPagos'
import ModalPago from './components/ModalPago'
import Toast from './components/Toast'
import { datosIniciales, deudaInicial, fechaHumana, nuevaReferencia } from './data'

export default function App() {
  const [deuda, setDeuda] = useState(deudaInicial)
  const [pagos, setPagos] = useState(datosIniciales.pagos)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4500)
    return () => clearTimeout(t)
  }, [toast])

  const abrirPago = () => setModalAbierto(true)

  const registrarPago = ({ monto, metodo, referencia }) => {
    setDeuda((d) => {
      const restante = Math.max(0, d.facturaVigente + d.saldoVencido - monto)
      const abonoVencido = Math.min(monto, d.saldoVencido)
      return {
        saldoVencido: Math.round((d.saldoVencido - abonoVencido) * 100) / 100,
        facturaVigente: Math.round((restante - (d.saldoVencido - abonoVencido)) * 100) / 100,
      }
    })
    setPagos((p) => [
      { referencia, fecha: fechaHumana(new Date()), monto, metodo },
      ...p,
    ])
    setToast(`Pago de Bs. ${monto.toLocaleString('es-VE', { minimumFractionDigits: 2 })} registrado · Ref. ${referencia}`)
  }

  return (
    <>
      <Header />
      <main className="contenedor">
        <div className="saludo">
          <h1>Oficina Virtual</h1>
          <p>Hola, {datosIniciales.cliente.titular.split(' ')[0]} 👋 · {datosIniciales.cliente.zona}</p>
        </div>

        <Estadisticas deuda={deuda} onPagar={abrirPago} />

        <div className="grid-2-a">
          <PanelConsumo />
          <PanelFactura deuda={deuda} onPagar={abrirPago} />
        </div>

        <div className="grid-2-b">
          <HistorialFacturas onPagar={abrirPago} />
          <ListaPagos pagos={pagos} />
        </div>

        <footer className="pie">
          © 2026 Corporación Eléctrica Nacional · Oficina Virtual v1.0 · Aplicación de demostración (datos simulados, no conectada a sistemas reales).
        </footer>
      </main>

      <ModalPago abierto={modalAbierto} deuda={deuda} onPagar={registrarPago} onCerrar={() => setModalAbierto(false)} />
      <Toast mensaje={toast} />
    </>
  )
}
