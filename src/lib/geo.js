import { Vector3 } from 'three'

const DEG = Math.PI / 180

export function latLonToVector(lat, lon, radius, target = new Vector3()) {
  const phi = lat * DEG
  const theta = lon * DEG
  return target.set(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  )
}

export function vectorToLatLon(vector) {
  const length = vector.length()
  return {
    lat: Math.asin(vector.y / length),
    lon: Math.atan2(vector.x, vector.z),
  }
}

export function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export async function buildLandDots(count, radius) {
  const [{ feature }, { default: topology }] = await Promise.all([
    import('topojson-client'),
    import('world-atlas/land-110m.json'),
  ])

  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })

  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)
  context.fillStyle = '#fff'

  const land = feature(topology, topology.objects.land)
  const features = land.type === 'FeatureCollection' ? land.features : [land]

  context.beginPath()
  features.forEach(({ geometry }) => {
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
    polygons.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach(([lon, lat], index) => {
          const x = ((lon + 180) / 360) * width
          const y = ((90 - lat) / 180) * height
          if (index === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        })
        context.closePath()
      })
    })
  })
  context.fill('evenodd')

  const pixels = context.getImageData(0, 0, width, height).data
  const positions = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  let filled = 0

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (2 * (i + 0.5)) / count
    const lat = Math.asin(y)
    const lon = ((i * golden + Math.PI) % (Math.PI * 2)) - Math.PI
    const px = Math.min(width - 1, Math.floor((lon / (Math.PI * 2) + 0.5) * width))
    const py = Math.min(height - 1, Math.floor((0.5 - lat / Math.PI) * height))

    if (pixels[(py * width + px) * 4] > 128) {
      const ring = Math.cos(lat) * radius
      positions[filled * 3] = ring * Math.sin(lon)
      positions[filled * 3 + 1] = y * radius
      positions[filled * 3 + 2] = ring * Math.cos(lon)
      filled += 1
    }
  }

  return positions.slice(0, filled * 3)
}
