import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const GlobeStudy = ({ className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Core Sphere
    const sphereGeo = new THREE.SphereGeometry(1, 48, 48);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x051e15,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });
    const globeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeSphere);

    // Wireframe Outer Mesh (Latitude & Longitude Grid)
    const wireGeo = new THREE.SphereGeometry(1.01, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireframeMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireframeMesh);

    // Glowing Dots / Telemetry Hotspots around Globe
    const pointsGeo = new THREE.BufferGeometry();
    const pointsCount = 400;
    const posArray = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount * 3; i += 3) {
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = Math.sqrt(pointsCount * Math.PI) * phi;

      const r = 1.02;
      posArray[i] = r * Math.cos(theta) * Math.sin(phi);
      posArray[i + 1] = r * Math.sin(theta) * Math.sin(phi);
      posArray[i + 2] = r * Math.cos(phi);
    }

    pointsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pointsMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x34d399,
      transparent: true,
      opacity: 0.85
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(pointsMesh);

    // Glow Atmosphere Mesh
    const atmosGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x059669,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.15
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.003;
      globeGroup.rotation.x += 0.0008;
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[320px] max-h-[500px]" />
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#05130E]/30 to-[#05130E]" />
    </div>
  );
};
