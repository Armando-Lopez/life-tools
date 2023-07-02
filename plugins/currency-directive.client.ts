import { animationFrame } from '~/helpers/animationFrame'

function filterCurrency (el: HTMLElement, bindings: any) {
  const number = Number.isNaN(parseInt(bindings.value)) ? 0 : bindings.value
  const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
  if (bindings.modifiers?.animate) {
    animationFrame((progress: number) => {
      el.innerHTML = formatter.format(Math.floor(progress * number))
    })
  } else {
    el.innerHTML = formatter.format(number)
  }
}
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('currency', {
    mounted: filterCurrency,
    updated: filterCurrency
  })
})
