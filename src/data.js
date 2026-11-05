// ============================================================
// Datos de demostración (mock). En producción vendrían de una API.
// ============================================================

export const datosIniciales = {
  cliente: {
    titular: 'María G. Rodríguez',
    cedula: 'V-14.567.890',
    contrato: 'N.º 08-4521-7 · Contrato R-33120',
    direccion: 'Av. Principal Los Ruices, Resid. Mirador II, Torre B, Apt. 5-C',
    zona: 'Región Capital · Distrito Capital',
    tarifa: 'Residencial R1 · BT (< 1 kV)',
    medidor: 'MD-9908-B5621',
  },

  medicion: {
    periodo: 'Octubre 2026',
    fechaEmision: '24/10/2026',
    vencimiento: '10/11/2026',
    vencimientoAnterior: '15/10/2026',
    lecturaAnterior: 14_320,
    lecturaActual: 14_590,
    consumoKwh: 270,
    consumoAnteriorKwh: 287,
    diasFacturados: 30,
    fechaLecturaAnterior: '30/09/2026',
    fechaCorte: '30/10/2026',
  },

  facturaActual: {
    energia: 499.5,      // 270 kWh × 1,85 Bs/kWh
    cargoFijo: 24.0,
    alumbrado: 13.2,
    saldoAnterior: 214.35, // saldo vencido de septiembre
  },

  historialFacturas: [
    { numero: 'F-26-10-091220', periodo: 'Octubre 2026',  consumoKwh: 270, monto: 536.7,  vencimiento: '10/11/2026', estado: 'Pendiente' },
    { numero: 'F-26-09-087401', periodo: 'Septiembre 2026', consumoKwh: 287, monto: 567.05, vencimiento: '15/10/2026', estado: 'Vencida' },
    { numero: 'F-26-08-082914', periodo: 'Agosto 2026',   consumoKwh: 302, monto: 591.4,  vencimiento: '12/09/2026', estado: 'Pagada' },
    { numero: 'F-26-07-079336', periodo: 'Julio 2026',    consumoKwh: 281, monto: 555.25, vencimiento: '10/08/2026', estado: 'Pagada' },
    { numero: 'F-26-06-074150', periodo: 'Junio 2026',    consumoKwh: 315, monto: 610.0,  vencimiento: '11/07/2026', estado: 'Pagada' },
    { numero: 'F-26-05-078431', periodo: 'Mayo 2026',     consumoKwh: 296, monto: 581.2,  vencimiento: '09/06/2026', estado: 'Pagada' },
  ],

  pagos: [
    {
      referencia: 'CE-684120935',
      fecha: '14/10/2026 09:41',
      monto: 542.1,
      metodo: 'Pago móvil · Banco de Venezuela',
    },
  ],
}

// Deuda total = factura vigente + saldo arrastrado vencido
export const deudaInicial = {
  facturaVigente: datosIniciales.facturaActual.energia +
    datosIniciales.facturaActual.cargoFijo +
    datosIniciales.facturaActual.alumbrado,        // 536,70
  saldoVencido: datosIniciales.facturaActual.saldoAnterior, // 214,35
}

// ---------- Utilidades de formato (sin depender de Intl) ----------

export const fmtN = (n, dec = 2) => {
  const fixed = Math.abs(n).toFixed(dec)
  const [int, frac] = fixed.split('.')
  const intSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const sign = n < 0 ? '-' : ''
  return `${sign}${intSep}${frac ? ',' + frac : ''}`
}

export const fmtBs = (n, dec = 2) => `Bs. ${fmtN(n, dec)}`

export const fechaHumana = (d) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ` +
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

export const nuevaReferencia = () =>
  'CE-' + Math.floor(100_000_000 + Math.random() * 900_000_000)

export const diasPara = (ddmttyy) => {
  const [d, m, y] = ddmttyy.split('/').map(Number)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(y, m - 1, d) - hoy) / 86_400_000)
}
