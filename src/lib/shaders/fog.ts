
// The "fog of thoughts" - a slow moving, reaction-diffusion style noise
export const fogVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fogFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uIntensity;
  uniform float uChaos;   // Controls turbulence speed/scale
  uniform float uSuction; // Controls black hole strength (0.0 to 1.0)

  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;

    // Mouse influence (gravity well)
    float dist = distance(st, uMouse);

    // Normal mouse influence (gentle push)
    float push = smoothstep(0.5, 0.0, dist) * 0.5;

    // Suction influence (violent pull) - Black hole physics
    // As uSuction increases, we warp the coordinates towards the center (uMouse)
    vec2 toMouse = uMouse - st;
    float pullStrength = (1.0 - smoothstep(0.0, 0.8, dist)) * uSuction * 2.0;

    // Apply coordinate distortion for suction
    // We mix the original UVs with UVs pulled towards mouse
    vec2 warpedUv = vUv + toMouse * pullStrength * 0.5;

    // Organic movement with chaos
    // uChaos scales the time and noise frequency
    float chaosMod = 1.0 + uChaos * 3.0;

    float noise = snoise(warpedUv * 3.0 * chaosMod + uTime * 0.1 * chaosMod);
    float noise2 = snoise(warpedUv * 6.0 * chaosMod - uTime * 0.15 * chaosMod + push);

    // Combine noise layers
    float finalNoise = mix(noise, noise2, 0.5);

    // Color mixing - Suction pulls towards black (Color1)
    // We add uSuction to darken the center
    float mixVal = finalNoise + push * uIntensity;
    vec3 finalColor = mix(uColor1, uColor2, mixVal);

    // Darken based on suction (Event Horizon effect)
    finalColor = mix(finalColor, vec3(0.0), pullStrength * 0.8);

    // Deep vignetting for focus
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(vUv - 0.5));

    gl_FragColor = vec4(finalColor * vignette, 1.0);
  }
`
