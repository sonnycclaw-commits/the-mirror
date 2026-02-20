
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimulation } from '@/lib/stores/simulation'

// -----------------------------------------------------------------------------
// SHADERS
// -----------------------------------------------------------------------------

const vertexShader = `
  uniform float uTime;
  uniform float uChaos;
  uniform float uSuction; // 0 to 1 (hold progress)

  attribute vec3 aRandom; // [speed, scale, offset]

  varying vec3 vColor;
  varying float vAlpha;

  // ---------------------------------------------------------------------------
  // CURL NOISE (Simplex 3D derivative based)
  // Source: glsl-curl-noise (simplified)
  // ---------------------------------------------------------------------------
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    // x0 = x0 - 0.0 + 0.0 * C.xxx;
    // x1 = x0 - i1  + 1.0 * C.xxx;
    // x2 = x0 - i2  + 2.0 * C.xxx;
    // x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  // Curl noise via numerical derivative of simplex noise
  vec3 curl(vec3 p) {
      const float e = 0.1;
      vec3 x = vec3(e, 0.0, 0.0);
      vec3 y = vec3(0.0, e, 0.0);
      vec3 z = vec3(0.0, 0.0, e);

      float n1 = snoise(p + x);
      float n2 = snoise(p - x);
      float n3 = snoise(p + y);
      float n4 = snoise(p - y);
      float n5 = snoise(p + z);
      float n6 = snoise(p - z);

      float x_ = (n3 - n4) - (n5 - n6);
      float y_ = (n5 - n6) - (n1 - n2);
      float z_ = (n1 - n2) - (n3 - n4);

      return normalize(vec3(x_, y_, z_));
  }

  void main() {
    // 1. Initial Position (Sphere)
    vec3 pos = position;

    // 2. Add Curl Noise Drift over Time
    // Scale down time to make it majestic
    // Scale spatial coordinates for noise frequency
    float t = uTime * 0.02 * (1.0 + uChaos * 2.0);
    vec3 noise = curl(pos * 0.1 + t);

    // Apply noise displacement
    // More chaos = more displacement strength
    pos += noise * (0.5 + uChaos * 3.0);

    // 3. Suction (Black Hole) Physics
    // Use logarithmic pull for that "event horizon" snapping feel
    if (uSuction > 0.0) {
        float dist = length(pos);

        // Direction to center
        vec3 dir = -normalize(pos);

        // Strength increases closer to center (Inverse Square Law-ish)
        float gravity = uSuction * (20.0 / (dist + 0.1));

        // Swirl effect (Tangent)
        vec3 tangent = cross(dir, vec3(0.0, 0.0, 1.0));
        pos += tangent * uSuction * 0.5; // Spin

        // Pull
        pos += dir * gravity * 0.5;

        // Compress Z (flat disc accretion)
        pos.z *= (1.0 - uSuction * 0.8);

        // Scale down entire universe as it collapses
        pos *= (1.0 - uSuction * 0.9);
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation
    // PROBLEM FIX: The user saw giant blobs because points near camera (z ~ -1) were huge.
    // Solution:
    // 1. Drastically reduce base size multiplier.
    // 2. Clamp the distance factor to avoid division by near-zero.
    float depth = -mvPosition.z;
    float sizeFactor = 30.0 / max(depth, 5.0); // Clamp depth so it never thinks it's closer than 5 units for sizing

    gl_PointSize = (2.0 * aRandom.y + 0.5) * sizeFactor;

    // Pass color to fragment
    float distToCenter = length(pos);

    // Alpha Logic
    // 1. Fade edges of the sphere (original logic)
    // 2. Fade particles that are too close to camera to prevent clipping/blobs
    float edgeFade = 1.0 - smoothstep(15.0, 30.0, distToCenter);
    float camFade = smoothstep(2.0, 8.0, depth); // Fade out if closer than 8 units, invisible if closer than 2

    vAlpha = edgeFade * camFade;

    // Color shift based on energy
    vColor = mix(
        vec3(0.5, 0.6, 0.7), // Twilight-300 (Calm)
        vec3(0.88, 0.48, 0.37), // Coral-500 (Chaos/Hot)
        uSuction * 0.8 + uChaos * 0.2
    );
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circular particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float r = length(coord);

    if (r > 0.5) discard;

    // Soft glow edge
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);

    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

const PARTICLE_COUNT = 6000 // Increased density
const RADIUS = 30

export function GalaxyField() {
  const mesh = useRef<THREE.Points>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uChaos: { value: 0 },
    uSuction: { value: 0 }
  }), [])

  // Generate initial positions
  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const rnd = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Spherical Cloud
        const r = RADIUS * Math.pow(Math.random(), 0.5) // Less dense center
        const theta = Math.random() * 2 * Math.PI
        const phi = Math.acos(2 * Math.random() - 1)

        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        pos[i * 3 + 2] = r * Math.cos(phi)

        // Random attributes
        rnd[i * 3] = Math.random() // speed
        rnd[i * 3 + 1] = Math.random() // scale
        rnd[i * 3 + 2] = Math.random() // offset
    }
    return [pos, rnd]
  }, [])

  useFrame((state) => {
    if (mesh.current) {
        const material = mesh.current.material as THREE.ShaderMaterial
        const { chaos, suction } = useSimulation.getState()

        // Update Uniforms
        material.uniforms.uTime.value = state.clock.getElapsedTime()

        // Smooth lerp for state values
        material.uniforms.uChaos.value += (chaos - material.uniforms.uChaos.value) * 0.1
        material.uniforms.uSuction.value += (suction - material.uniforms.uSuction.value) * 0.1

        // Slow rotation of entire galaxy
        mesh.current.rotation.y += 0.0001
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={PARTICLE_COUNT}
          array={randoms}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
