/**
 * Api del navegador para ejecutar animaciones.
 * @param callback Se ejecuta cada microsegundo, cada vez que el navegador esta listo para seguir el siguiente frame. Callback recibe el progreso de 0 a 1
 * @param duration Duration de la animación en microsegundos
 */
export const animationFrame = (callback: Function, duration = 1000): void => {
  let startTimestamp: number
  function step (timestamp: number): void {
    if (!startTimestamp) { startTimestamp = timestamp }
    const elapsed = timestamp - startTimestamp
    const progress = Math.min(elapsed / duration, 1)
    callback(progress)
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}
