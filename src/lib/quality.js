// Mode « machine sans GPU » : rendu à la demande et scène allégée.
export const quality = { low: false, forced: false }

// ?quality=low|high force le mode (utile pour comparer les performances).
export function forcedQuality() {
  const value = new URLSearchParams(window.location.search).get('quality')
  return value === 'low' || value === 'high' ? value : null
}

// Vrai si WebGL est émulé par le processeur (SwiftShader, llvmpipe, rendu logiciel).
export function detectSoftwareRenderer() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|software|basic render/i.test(renderer)
  } catch {
    return false
  }
}
