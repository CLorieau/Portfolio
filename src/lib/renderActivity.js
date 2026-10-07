// En mode « à la demande », la scène 3D n'est redessinée que pendant une courte fenêtre après une action
// (scroll, souris, fin du chargement). Au repos, plus aucune image n'est calculée.
let invalidateFrame = null
let awakeUntil = 0
let running = false
let lastFrame = 0

const FRAME_INTERVAL = 50 // 20 images/s maximum

export function setInvalidate(callback) {
  invalidateFrame = callback
}

function loop() {
  if (!invalidateFrame || performance.now() > awakeUntil) {
    running = false
    return
  }
  const now = performance.now()
  if (now - lastFrame >= FRAME_INTERVAL) {
    lastFrame = now
    invalidateFrame()
  }
  requestAnimationFrame(loop)
}

export function wake(duration = 1500) {
  if (!invalidateFrame) return
  awakeUntil = Math.max(awakeUntil, performance.now() + duration)
  if (!running) {
    running = true
    requestAnimationFrame(loop)
  }
}
