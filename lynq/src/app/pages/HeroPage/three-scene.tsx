"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0xffffff, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1) // was 0.5
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2) // was 1
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


    // Create floating cards
    const createCard = (x: number, y: number, z: number, color: string) => {
      const geometry = new THREE.BoxGeometry(1, 0.6, 0.05)
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: 0,
        roughness: 0,
        transmission: 0.9, // Use if you want it translucent
        clearcoat: 1,
        clearcoatRoughness: 0,
        opacity: 1,
        transparent: false,
        side: THREE.DoubleSide,
      })
      
      

      const card = new THREE.Mesh(geometry, material)
      card.position.set(x, y, z)
      card.castShadow = true
      card.receiveShadow = true

      // Add random rotation
      card.rotation.x = Math.random() * 0.2 - 0.1
      card.rotation.y = Math.random() * 0.2 - 0.1

      scene.add(card)

      return card
    }

    // Create multiple cards with different positions and colors
    const cards = [
      createCard(0, 0, -6, "#A2D4EC"), // Gentle cloud blue
      createCard(-3, 1, -2, "#DCEEFB"), // Lightest blue
      createCard(-2, -2, -4, "#84C5F4"), // Calm sky blue
      createCard(3, -1, -3, "#B6E0FE"), // Soft blue
      createCard(2, 2, -5, "#62B0E8"), // Light primary blue
    ]
    
    

    // Animation properties for each card
    const cardAnimations = cards.map(() => ({
      yOffset: Math.random() * 0.2 + 0.1,
      ySpeed: Math.random() * 0.001 + 0.001,
      rotSpeed: Math.random() * 0.001 + 0.0005,
      initialY: 0,
    }))

    // Store initial Y positions
    cards.forEach((card, i) => {
      cardAnimations[i].initialY = card.position.y
    })

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Animate each card
      cards.forEach((card, i) => {
        const animation = cardAnimations[i]

        // Floating motion
        card.position.y = animation.initialY + Math.sin(Date.now() * animation.ySpeed) * animation.yOffset

        // Subtle rotation
        card.rotation.x += animation.rotSpeed * 0.5
        card.rotation.y += animation.rotSpeed
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}
