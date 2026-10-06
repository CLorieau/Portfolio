export const dotsVertex = `
  uniform float uSize;
  uniform float uScale;
  varying float vFacing;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 viewNormal = normalize(normalMatrix * normalize(position));
    vFacing = dot(viewNormal, normalize(-viewPosition.xyz));
    gl_PointSize = max(uSize * uScale / -viewPosition.z, 1.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const dotsFragment = `
  uniform vec3 uColor;
  uniform vec3 uRim;
  varying float vFacing;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float edge = smoothstep(0.5, 0.28, distanceToCenter);
    float facing = clamp(vFacing, 0.0, 1.0);
    float rim = pow(1.0 - facing, 2.0);
    vec3 color = mix(uColor, uRim, rim * 0.9);
    float alpha = edge * mix(0.35, 1.0, smoothstep(0.0, 0.5, facing));
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`

export const oceanVertex = `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const oceanFragment = `
  uniform vec3 uBase;
  uniform vec3 uRim;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.6);
    vec3 color = mix(uBase, uRim, fresnel * 0.6);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`

export const atmosphereVertex = `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const atmosphereFragment = `
  uniform vec3 uColor;
  varying vec3 vNormal;

  void main() {
    float intensity = pow(max(0.64 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    gl_FragColor = vec4(uColor, 1.0) * intensity * 1.6;
    #include <colorspace_fragment>
  }
`
