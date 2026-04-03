import axios from 'axios'

const barcodePrinterRequest = axios.create({
  baseURL: import.meta.env.VITE_BARCODE_PRINTER_BASE_URL || '/barcode-printer',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 10000,
})

export const api_barcode_printer_print = (params = {}) => {
  const data = Array.isArray(params.data)
    ? params.data.map((item) => ({
      barcodeNumber: item.barcodeNumber,
      reagentName: item.reagentName,
      lotName: item.lotName,
    }))
    : []

  return barcodePrinterRequest
    .post('/print', {
      data,
      printer: params.printer,
    })
    .then((res) => res.data)
}

