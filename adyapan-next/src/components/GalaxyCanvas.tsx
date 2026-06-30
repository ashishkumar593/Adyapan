"use client";

import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Vec3, Mesh } from "ogl";
import { useTheme } from "@/lib/context";

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uResolution;
  uniform vec2 uFocal;
  uniform vec2 uRotation;
  uniform float uStarSpeed;
  uniform float uDensity;
  uniform float uHueShift;
  uniform float uSpeed;
  uniform vec2 uMouse;
  uniform float uGlowIntensity;
  uniform float uSaturation;
  uniform bool uMouseRepulsion;
  uniform float uTwinkleIntensity;
  uniform float uRotationSpeed;
  uniform float uRepulsionStrength;
  uniform float uMouseActiveFactor;
  uniform float uAutoCenterRepulsion;
  uniform bool uTransparent;
  varying vec2 vUv;
  #define NUM_LAYER 4.0
  #define STAR_COLOR_CUTOFF 0.2
  #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
  #define PERIOD 3.0
  float Hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
  float tris(float x) { float t = fract(x); return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0)); }
  float trisn(float x) { float t = fract(x); return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0; }
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  float Star(vec2 uv, float flare) {
    float d = length(uv);
    float m = (0.05 * uGlowIntensity) / d;
    float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
    m += rays * flare * uGlowIntensity;
    uv *= MAT45;
    rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
    m += rays * 0.3 * flare * uGlowIntensity;
    m *= smoothstep(1.0, 0.2, d);
    return m;
  }
  vec3 StarLayer(vec2 uv) {
    vec3 col = vec3(0.0);
    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 offset = vec2(float(x), float(y));
        vec2 si = id + vec2(float(x), float(y));
        float seed = Hash21(si);
        float size = fract(seed * 345.32);
        float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
        float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
        float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
        float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
        float grn = min(red, blu) * seed;
        vec3 base = vec3(red, grn, blu);
        float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
        hue = fract(hue + uHueShift / 360.0);
        float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
        float val = max(max(base.r, base.g), base.b);
        base = hsv2rgb(vec3(hue, sat, val));
        vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
        float star = Star(gv - offset - pad, flareSize);
        float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
        twinkle = mix(1.0, twinkle, uTwinkleIntensity);
        col += star * size * base * twinkle;
      }
    }
    return col;
  }
  void main() {
    vec2 focalPx = uFocal * uResolution.xy;
    vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
    vec2 mouseNorm = uMouse - vec2(0.5);
    if (uMouseRepulsion) {
      vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
      float mouseDist = length(uv - mousePosUV);
      vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
      uv += repulsion * 0.05 * uMouseActiveFactor;
    } else {
      uv += mouseNorm * 0.1 * uMouseActiveFactor;
    }
    float autoRotAngle = uTime * uRotationSpeed;
    mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
    uv = autoRot * uv;
    uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
    vec3 col = vec3(0.0);
    for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
      float depth = fract(i + uStarSpeed * uSpeed);
      float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
      float fade = depth * smoothstep(1.0, 0.9, depth);
      col += StarLayer(uv * scale + i * 453.32) * fade;
    }
    if (uTransparent) {
      float alpha = smoothstep(0.0, 0.3, length(col));
      gl_FragColor = vec4(col, min(alpha, 1.0));
    } else {
      gl_FragColor = vec4(col, 1.0);
    }
  }
`;

export default function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer({ canvas, alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uFocal: { value: new Float32Array([0.5, 0.5]) },
        uRotation: { value: new Float32Array([1.0, 0.0]) },
        uStarSpeed: { value: 0.5 }, uDensity: { value: 1.0 }, uHueShift: { value: 140.0 },
        uSpeed: { value: 1.0 }, uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: 0.3 }, uSaturation: { value: 1.0 },
        uMouseRepulsion: { value: true }, uTwinkleIntensity: { value: 0.3 },
        uRotationSpeed: { value: 0.1 }, uRepulsionStrength: { value: 2.0 },
        uMouseActiveFactor: { value: 0.0 }, uAutoCenterRepulsion: { value: 0.0 },
        uTransparent: { value: true },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let targetMouse = { x: 0.5, y: 0.5 }, smoothMouse = { x: 0.5, y: 0.5 };
    let targetActive = 0, smoothActive = 0;

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    };
    const onMove = (e: PointerEvent) => {
      targetMouse = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight };
      targetActive = 1;
    };
    const onLeave = () => { targetActive = 0; };

    const applyTheme = () => {
      const light = theme === "light";
      program.uniforms.uGlowIntensity.value = light ? 0.55 : 0.3;
      program.uniforms.uSaturation.value = light ? 2.2 : 1.0;
      program.uniforms.uHueShift.value = light ? 200.0 : 140.0;
      program.uniforms.uDensity.value = light ? 1.4 : 1.0;
      program.uniforms.uTwinkleIntensity.value = light ? 0.6 : 0.3;
      canvas.style.background = light ? "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(139,92,246,0.05) 100%)" : "none";
      canvas.style.opacity = light ? "0.9" : "1";
    };

    let raf: number;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uStarSpeed.value = (t * 0.001 * 0.5) / 10.0;
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.05;
      smoothActive += (targetActive - smoothActive) * 0.05;
      program.uniforms.uMouse.value[0] = smoothMouse.x;
      program.uniforms.uMouse.value[1] = smoothMouse.y;
      program.uniforms.uMouseActiveFactor.value = smoothActive;
      renderer.render({ scene: mesh });
    };

    resize(); applyTheme();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      id="ai-agent-canvas"
      className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none"
    />
  );
}
