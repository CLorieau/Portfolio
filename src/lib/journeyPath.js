import { CatmullRomCurve3, MathUtils, Matrix4, Vector3 } from 'three'
import { journey } from '@/config/journey'
import { scene } from '@/config/scene'
import { latLonToVector, smoothstep, vectorToLatLon } from '@/lib/geo'

const { radius, groundOffset, routeLift, routeLiftFactor, roadLift } = scene.globe
const { minFraming, maxFraming, framingBase, framingFactor } = scene.camera

const anchors = journey.steps.map((step) =>
  latLonToVector(step.lat, step.lon, radius + groundOffset),
)

const controlPoints = []
anchors.forEach((anchor, index) => {
  controlPoints.push(anchor)
  const next = anchors[index + 1]
  if (next) {
    const chord = anchor.distanceTo(next)
    // Route : on reste au ras du sol. Avion : arc de croisière.
    const lift =
      journey.steps[index + 1].transport === 'road' ? roadLift : routeLift + chord * routeLiftFactor
    const apex = anchor
      .clone()
      .add(next)
      .normalize()
      .multiplyScalar(radius + groundOffset + lift)
    controlPoints.push(apex)
  }
})

export const journeyCurve = new CatmullRomCurve3(controlPoints, false, 'centripetal', 0.5)
export const journeyLength = journeyCurve.getLength()
export const journeySegments = 240
export const journeyPoints = journeyCurve.getPoints(journeySegments)
export const journeyCards = journey.steps.length + 1

const waypointCount = anchors.length

// Moyen de transport utilisé à la position t (0..1) du trajet.
export function transportAt(t) {
  const leg = Math.min(Math.floor(t * (waypointCount - 1)), waypointCount - 2)
  return journey.steps[leg + 1].transport
}
const legChords = anchors.slice(1).map((anchor, index) => anchor.distanceTo(anchors[index]))
const legFraming = legChords.map((chord) =>
  MathUtils.clamp(framingBase + chord * framingFactor, minFraming, maxFraming),
)
const waypointFraming = anchors.map((_, index) => {
  const before = legFraming[index - 1]
  const after = legFraming[index]
  if (before === undefined) return after
  if (after === undefined) return before
  return (before + after) / 2
})

export const journeyRuntime = {
  t: 0,
  index: 0,
  framing: waypointFraming[0],
  lat: 0,
  lon: 0,
  activeCard: 0,
}

const probe = new Vector3()

export function sampleJourney(progress) {
  const time = progress * journeyCards
  const k = MathUtils.clamp(time - 0.5, 0, waypointCount - 1)
  const index = Math.min(Math.floor(k), waypointCount - 2)
  const blend = smoothstep(0.3, 0.7, k - index)

  journeyRuntime.t = (index + blend) / (waypointCount - 1)
  journeyRuntime.index = index
  journeyRuntime.framing = MathUtils.lerp(
    waypointFraming[index],
    waypointFraming[index + 1],
    blend,
  )
  journeyRuntime.activeCard = Math.min(journeyCards - 1, Math.floor(time))

  journeyCurve.getPoint(journeyRuntime.t, probe)
  const { lat, lon } = vectorToLatLon(probe)
  journeyRuntime.lat = lat
  journeyRuntime.lon = lon

  return journeyRuntime
}

const tangent = new Vector3()
const up = new Vector3()
const right = new Vector3()
const basis = new Matrix4()

export function poseOnJourney(t, position, quaternion) {
  journeyCurve.getPoint(t, position)
  journeyCurve.getTangent(t, tangent).normalize()
  up.copy(position).normalize()
  up.addScaledVector(tangent, -up.dot(tangent)).normalize()
  right.crossVectors(up, tangent)
  basis.makeBasis(right, up, tangent)
  quaternion.setFromRotationMatrix(basis)
}

export function waypointPosition(index) {
  return anchors[index]
}
