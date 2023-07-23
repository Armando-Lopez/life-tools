export const useFilter = () => {
  function currency (value) {
    const number = Number.isNaN(parseInt(value)) ? 0 : value
    const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
    return formatter.format(number).split(',')[0]
  }

  return {
    currency
  }
}
