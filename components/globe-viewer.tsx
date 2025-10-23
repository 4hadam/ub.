"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface GlobeViewerProps {
  selectedCountry: string | null
}

const hslToHex = (h: number, s: number, l: number): number => {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const r = Math.round(255 * f(0))
  const g = Math.round(255 * f(8))
  const b = Math.round(255 * f(4))
  return (r << 16) | (g << 8) | b
}

const generateCountryColors = (featureCount: number) => {
  const colors: number[] = []
  for (let i = 0; i < featureCount; i++) {
    const hue = (i * 360) / featureCount
    const saturation = 70
    const lightness = 45
    colors.push(hslToHex(hue, saturation, lightness))
  }
  return colors
}

export default function GlobeViewer({ selectedCountry }: GlobeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const globeGroupRef = useRef<THREE.Group | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  const mouseDown = useRef(false)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const targetRotationX = useRef(0)
  const targetRotationY = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 2.5
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 1)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create group for globe
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)
    globeGroupRef.current = globeGroup

    const loadWorldMap = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
        )

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const geojsonData = await response.json()
        if (!geojsonData.features || geojsonData.features.length === 0) {
          throw new Error("No features found in GeoJSON data")
        }

        const colors = generateCountryColors(geojsonData.features.length)
        let colorIndex = 0
        const radius = 1

        const latLonToXYZ = (lat: number, lon: number, r: number) => {
          const phi = lat * (Math.PI / 180)
          const theta = (180 - lon) * (Math.PI / 180)
          const x = r * Math.cos(phi) * Math.cos(theta)
          const y = r * Math.sin(phi)
          const z = r * Math.cos(phi) * Math.sin(theta)
          return { x, y, z }
        }

        geojsonData.features.forEach((feature: any) => {
          let color = colors[colorIndex % colors.length]
          const countryName = feature.properties?.ADMIN || ""
          if (countryName === "Morocco") {
            color = 0xff0000
          }
          colorIndex++

          const geometry = feature.geometry
          if (!geometry) return

          let allRings: any[] = []
          if (geometry.type === "Polygon") {
            allRings = geometry.coordinates
          } else if (geometry.type === "MultiPolygon") {
            geometry.coordinates.forEach((polygon: any) => {
              allRings = allRings.concat(polygon)
            })
          }

          allRings.forEach((ring: any) => {
            if (!ring || ring.length < 2) return

            const points: THREE.Vector3[] = []

            for (let i = 0; i < ring.length; i++) {
              const [lon, lat] = ring[i]
              const { x, y, z } = latLonToXYZ(lat, lon, radius)
              points.push(new THREE.Vector3(x, y, z))
            }

            const lineGeometry = new THREE.BufferGeometry()
            lineGeometry.setFromPoints(points)
            const lineMaterial = new THREE.LineBasicMaterial({
              color: color,
              linewidth: 1,
            })
            const line = new THREE.Line(lineGeometry, lineMaterial)
            globeGroup.add(line)
          })
        })
      } catch (error) {
        console.error("Error loading world map:", error)
      }
    }

    loadWorldMap()

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 3, 5)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const glowGeometry = new THREE.SphereGeometry(1.02, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.05,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    globeGroup.add(glow)

    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    globeGroup.add(sphere)

    // Add stars
    const starsGeometry = new THREE.BufferGeometry()
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, sizeAttenuation: true })

    const starsVertices = []
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 200
      const y = (Math.random() - 0.5) * 200
      const z = (Math.random() - 0.5) * 200
      starsVertices.push(x, y, z)
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(starsVertices), 3))
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    globeGroup.add(stars)

    const onMouseDown = (e: MouseEvent) => {
      mouseDown.current = true
      mouseX.current = e.clientX
      mouseY.current = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown.current) return

      const deltaX = e.clientX - mouseX.current
      const deltaY = e.clientY - mouseY.current

      targetRotationY.current += deltaX * 0.005
      targetRotationX.current += deltaY * 0.005

      targetRotationX.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX.current))

      mouseX.current = e.clientX
      mouseY.current = e.clientY
    }

    const onMouseUp = () => {
      mouseDown.current = false
    }

    const onMouseWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!cameraRef.current) return

      const zoomSpeed = 0.1
      const direction = e.deltaY > 0 ? 1 : -1
      cameraRef.current.position.z += direction * zoomSpeed
      cameraRef.current.position.z = Math.max(1.5, Math.min(5, cameraRef.current.position.z))
    }

    renderer.domElement.addEventListener("mousedown", onMouseDown)
    renderer.domElement.addEventListener("mousemove", onMouseMove)
    renderer.domElement.addEventListener("mouseup", onMouseUp)
    renderer.domElement.addEventListener("wheel", onMouseWheel, { passive: false })

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (globeGroup) {
        globeGroup.rotation.y += (targetRotationY.current - globeGroup.rotation.y) * 0.1
        globeGroup.rotation.x += (targetRotationX.current - globeGroup.rotation.x) * 0.1
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener("mousedown", onMouseDown)
      renderer.domElement.removeEventListener("mousemove", onMouseMove)
      renderer.domElement.removeEventListener("mouseup", onMouseUp)
      renderer.domElement.removeEventListener("wheel", onMouseWheel)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      glowMaterial.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
