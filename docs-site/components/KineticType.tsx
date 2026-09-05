"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * Kinetic Type — a word tiled over a solid and dragged around it by the clock.
 */

const CAM_DISTANCE = 50
const SPAN = 2 * Math.tan((45 * Math.PI) / 180 / 2) * CAM_DISTANCE
const TILE_W = 1024
const TILE_H = 576
const FILL_W = 0.9

type ShapeName = "torusKnot" | "box"

const SHAPES: Record<ShapeName, { repeat: [number, number] }> = {
    torusKnot: { repeat: [12, 3] },
    box: { repeat: [3, 3] },
}

const DEFAULTS = {
    shape: "torusKnot" as ShapeName,
    word: "COMPONENT",
    color: "#FFFFFF",
    fill: "#000000",
    density: 12,
    speed: 10,
    distort: 8,
    sizePercent: 102,
    hoverBoost: 7,
}

type FontValue = {
    fontFamily?: string
    fontSize?: number | string
    fontWeight?: number | string
    fontStyle?: string
    letterSpacing?: number | string
}

type Config = {
    shape: ShapeName
    word: string
    font: FontValue
    color: string
    fill: string
    density: number
    speed: number
    distort: number
    sizePercent: number
    hoverBoost: number
}

function clamp(v: number, lo: number, hi: number, fallback: number): number {
    const n = typeof v === "number" && isFinite(v) ? v : fallback
    return Math.max(lo, Math.min(hi, n))
}

function toPx(v: unknown, fallback: number, emBasis: number): number {
    if (typeof v === "number" && isFinite(v)) return v
    if (typeof v === "string") {
        const n = parseFloat(v)
        if (!isFinite(n)) return fallback
        if (v.indexOf("em") >= 0) return n * emBasis
        if (v.indexOf("%") >= 0) return (n / 100) * emBasis
        return n
    }
    return fallback
}

function settingsFor(cfg: Config) {
    const shape: ShapeName = SHAPES[cfg.shape] ? cfg.shape : DEFAULTS.shape
    const base = SHAPES[shape].repeat
    const font = cfg.font ?? {}
    const heightPct = clamp(toPx(font.fontSize, 60, 100), 10, 300, 60)
    const d = clamp(cfg.density, 1, 20, DEFAULTS.density) / 10
    return {
        shape,
        family: font.fontFamily || "Impact, Haettenschweiler, sans-serif",
        weight: font.fontWeight ?? 900,
        fontStyle: font.fontStyle ?? "normal",
        tracking: toPx(font.letterSpacing, 0, 1) * 2,
        capHeight: (heightPct / 100) * TILE_H,
        repeat: [
            Math.max(1, Math.round(base[0] * d)),
            Math.max(1, Math.round(base[1] * d)),
        ] as [number, number],
        speed: clamp(cfg.speed, 0, 20, DEFAULTS.speed) / 10,
        distort: clamp(cfg.distort, 0, 20, DEFAULTS.distort) / 10,
        hoverBoost: clamp(cfg.hoverBoost, 0, 20, DEFAULTS.hoverBoost) * 0.3,
        zoom: 100 / clamp(cfg.sizePercent, 20, 200, DEFAULTS.sizePercent),
    }
}

const VERTEX = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;
    uniform float uDistort;

    mat4 rotation3d(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;

        return mat4(
            oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
            0.0,                                0.0,                                0.0,                                1.0
        );
    }

    void main() {
        vUv = uv;

        vec3 pos = position;

        #ifdef SHAPE_BOX
            float angle = pos.x * 0.1 * uDistort;
            pos = (rotation3d(vec3(1., 0., 0.), angle) * vec4(pos, 1.)).xyz;
        #endif

        vPosition = pos;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }
`

const FRAGMENT = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;
    uniform vec2 uRepeat;
    uniform vec3 uFog;
    uniform sampler2D uTexture;
    uniform float uIsTransparent;

    void main() {
        vec4 texColor;

        #ifdef SHAPE_TORUS
            float time = uTime * 0.4;
            vec2 uv = fract(vUv * -uRepeat - vec2(time, 0.));
            texColor = texture2D(uTexture, uv);
            float fog = clamp(vPosition.z / 6., 0., 1.);
            // Only mix fog with RGB, keep alpha
            texColor.rgb = mix(uFog, texColor.rgb, fog);
        #endif

        #ifdef SHAPE_BOX
            float time = uTime * 0.25;
            vec2 uv = fract(vUv * uRepeat - vec2(time, 0.));
            texColor = texture2D(uTexture, uv);
        #endif

        gl_FragColor = texColor;
    }
`

function buildGeometry(shape: ShapeName): THREE.BufferGeometry {
    if (shape === "box") return new THREE.BoxGeometry(100, 10, 10, 64, 64, 64)
    return new THREE.TorusKnotGeometry(9, 3, 768, 3, 4, 3)
}

function definesFor(shape: ShapeName): Record<string, boolean> {
    return shape === "box" ? { SHAPE_BOX: true } : { SHAPE_TORUS: true }
}

class KineticScene {
    private container: HTMLElement
    private cfg: Config
    private renderer: THREE.WebGLRenderer
    private scene = new THREE.Scene()
    private camera = new THREE.PerspectiveCamera(45, 1, 1, 1000)
    private geometry: THREE.BufferGeometry
    private material: THREE.ShaderMaterial
    private mesh: THREE.Mesh
    private plate: HTMLCanvasElement
    private plateCtx: CanvasRenderingContext2D | null
    private texture: THREE.CanvasTexture
    private width = 1
    private height = 1
    private time = 0
    private lastT = 0
    private frameId = 0
    private disposed = false
    private grip = 0
    private hovered = false
    private onEnter = () => {
        this.hovered = true
    }
    private onLeave = () => {
        this.hovered = false
    }

    constructor(container: HTMLElement, cfg: Config) {
        this.container = container
        this.cfg = cfg
        const S = settingsFor(cfg)

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        this.renderer.setClearColor(0x000000, 0)
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        const canvas = this.renderer.domElement
        canvas.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;display:block;"
        container.appendChild(canvas)

        canvas.addEventListener("pointerenter", this.onEnter)
        canvas.addEventListener("pointerleave", this.onLeave)
        canvas.addEventListener("pointercancel", this.onLeave)

        this.plate = document.createElement("canvas")
        this.plate.width = TILE_W
        this.plate.height = TILE_H
        this.plateCtx = this.plate.getContext("2d")
        this.texture = new THREE.CanvasTexture(this.plate)
        this.texture.colorSpace = THREE.SRGBColorSpace
        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.wrapT = THREE.RepeatWrapping
        this.texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
        this.drawPlate()

        this.geometry = buildGeometry(S.shape)
        this.material = new THREE.ShaderMaterial({
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            defines: definesFor(S.shape),
            uniforms: {
                uTime: { value: 0 },
                uRepeat: { value: new THREE.Vector2(S.repeat[0], S.repeat[1]) },
                uDistort: { value: S.distort },
                uFog: { value: new THREE.Color(cfg.fill === "transparent" ? "#000000" : (cfg.fill || DEFAULTS.fill)) },
                uTexture: { value: this.texture },
            },
            side: THREE.DoubleSide,
            transparent: true,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)

        const fonts = (document as any).fonts
        if (fonts?.ready?.then) {
            fonts.ready.then(() => {
                if (!this.disposed) this.drawPlate()
            })
        }
    }

    private drawPlate() {
        const ctx = this.plateCtx
        if (!ctx) return
        const S = settingsFor(this.cfg)
        const word = (this.cfg.word ?? "").length ? this.cfg.word : DEFAULTS.word

        ctx.setTransform(1, 0, 0, 1, 0, 0)
        if (this.cfg.fill === "transparent") {
            ctx.clearRect(0, 0, TILE_W, TILE_H)
        } else {
            ctx.fillStyle = this.cfg.fill || DEFAULTS.fill
            ctx.fillRect(0, 0, TILE_W, TILE_H)
        }

        const BASIS = 200
        ctx.font = `${S.fontStyle} ${S.weight} ${BASIS}px ${S.family}`
        if ("letterSpacing" in ctx) (ctx as any).letterSpacing = `${S.tracking}px`
        const m = ctx.measureText(word)
        const w = Math.max(1, m.width)
        const ascent = m.actualBoundingBoxAscent || BASIS * 0.72
        const descent = m.actualBoundingBoxDescent || 0
        const h = Math.max(1, ascent + descent)

        ctx.translate(TILE_W / 2, TILE_H / 2)
        ctx.scale((FILL_W * TILE_W) / w, S.capHeight / h)
        ctx.fillStyle = this.cfg.color || DEFAULTS.color
        ctx.textAlign = "center"
        ctx.textBaseline = "alphabetic"
        ctx.fillText(word, 0, h / 2 - descent)
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        this.texture.needsUpdate = true
    }

    start() {
        this.lastT = performance.now()
        const loop = () => {
            if (this.disposed) return
            this.frameId = requestAnimationFrame(loop)
            this.step()
        }
        this.frameId = requestAnimationFrame(loop)
    }

    setSize(width: number, height: number) {
        if (this.disposed) return
        this.width = Math.max(1, width)
        this.height = Math.max(1, height)
        this.renderer.setSize(this.width, this.height, false)
        this.updateCamera()
    }

    private updateCamera() {
        const aspect = this.width / this.height
        const S = settingsFor(this.cfg)
        const span = SPAN * S.zoom
        const visibleHeight = aspect < 1 ? span / aspect : span

        this.camera.aspect = aspect
        this.camera.position.set(0, 0, CAM_DISTANCE)
        this.camera.lookAt(0, 0, 0)
        this.camera.fov =
            2 * Math.atan(visibleHeight / 2 / CAM_DISTANCE) * (180 / Math.PI)
        this.camera.near = Math.max(0.1, CAM_DISTANCE - 40)
        this.camera.far = CAM_DISTANCE + 40
        this.camera.updateProjectionMatrix()
    }

    updateConfig(cfg: Config) {
        if (this.disposed) return
        const prev = this.cfg
        this.cfg = cfg
        const S = settingsFor(cfg)

        if (S.shape !== settingsFor(prev).shape) {
            this.geometry.dispose()
            this.geometry = buildGeometry(S.shape)
            this.mesh.geometry = this.geometry
            this.material.defines = definesFor(S.shape)
            this.material.needsUpdate = true
        }

        const u = this.material.uniforms
        u.uRepeat.value.set(S.repeat[0], S.repeat[1])
        u.uDistort.value = S.distort
        u.uFog.value.set(cfg.fill === "transparent" ? "#000000" : (cfg.fill || DEFAULTS.fill))

        if (
            cfg.word !== prev.word ||
            cfg.color !== prev.color ||
            cfg.fill !== prev.fill ||
            JSON.stringify(cfg.font) !== JSON.stringify(prev.font)
        ) {
            this.drawPlate()
        }

        this.updateCamera()
    }

    private step() {
        const now = performance.now()
        let dt = (now - this.lastT) / 1000
        this.lastT = now
        if (!isFinite(dt) || dt < 0) dt = 0
        if (dt > 0.05) dt = 0.05 

        const S = settingsFor(this.cfg)
        const target = this.hovered && S.hoverBoost > 0 ? 1 : 0
        this.grip += (target - this.grip) * (1 - Math.exp(-dt * 4))
        this.time += dt * S.speed * (1 + this.grip * S.hoverBoost)
        this.material.uniforms.uTime.value = this.time

        this.renderer.render(this.scene, this.camera)
    }

    dispose() {
        this.disposed = true
        cancelAnimationFrame(this.frameId)
        this.geometry.dispose()
        this.material.dispose()
        this.texture.dispose()
        this.renderer.dispose()
        const canvas = this.renderer.domElement
        canvas.removeEventListener("pointerenter", this.onEnter)
        canvas.removeEventListener("pointerleave", this.onLeave)
        canvas.removeEventListener("pointercancel", this.onLeave)
        if (canvas.parentNode === this.container) this.container.removeChild(canvas)
    }
}

interface KineticTypeProps {
    shape?: ShapeName
    word?: string
    font?: FontValue
    color?: string
    fill?: string
    density?: number
    speed?: number
    distort?: number
    sizePercent?: number
    hoverBoost?: number
    style?: React.CSSProperties
    className?: string
}

function __OriginkitBase_KineticType(props: KineticTypeProps) {
    const {
        shape = DEFAULTS.shape,
        word = DEFAULTS.word,
        font = { fontFamily: "Inter, sans-serif", fontSize: 60, fontWeight: 900 },
        color = DEFAULTS.color,
        fill = DEFAULTS.fill,
        density = DEFAULTS.density,
        speed = DEFAULTS.speed,
        distort = DEFAULTS.distort,
        sizePercent = DEFAULTS.sizePercent,
        hoverBoost = DEFAULTS.hoverBoost,
        style,
        className,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<KineticScene | null>(null)
    const cfgRef = useRef<Config>(null as any)
    cfgRef.current = {
        shape,
        word,
        font: font ?? {},
        color,
        fill,
        density,
        speed,
        distort,
        sizePercent,
        hoverBoost,
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        let scene: KineticScene
        try {
            scene = new KineticScene(container, cfgRef.current)
        } catch {
            return
        }
        sceneRef.current = scene
        scene.setSize(container.clientWidth, container.clientHeight)
        scene.start()

        const ro = new ResizeObserver(() => {
            scene.setSize(container.clientWidth, container.clientHeight)
        })
        ro.observe(container)
        return () => {
            ro.disconnect()
            scene.dispose()
            sceneRef.current = null
        }
    }, [])

    useEffect(() => {
        sceneRef.current?.updateConfig(cfgRef.current)
    }, [
        shape,
        word,
        JSON.stringify(font),
        color,
        fill,
        density,
        speed,
        distort,
        sizePercent,
        hoverBoost,
    ])

    return (
        <div
            ref={containerRef}
            className={className}
            role="img"
            aria-label={`The word ${word} repeating over a moving surface`}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minWidth: 120,
                minHeight: 120,
                overflow: "hidden",
                ...style,
            }}
        />
    )
}

const __originkitPresetProps = {
  shape: "torusKnot" as ShapeName,
  word: "USE-WEB-KIT",
  color: "#5BE30C",
  fill: "#050507",
  density: 12,
  speed: 10,
  distort: 8,
  sizePercent: 102,
  hoverBoost: 7
};

export default function KineticType(props: KineticTypeProps) {
  return <__OriginkitBase_KineticType {...__originkitPresetProps} {...props} />;
}
