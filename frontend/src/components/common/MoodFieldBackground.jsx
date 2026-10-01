import React, { useEffect, useRef } from 'react';

export const MoodFieldBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuration exact values:
    // Background: #F6F7FB
    // Intense Color: #0EA616 (Primary WasteSphere Green)
    // Calm Color: #eef1f8ff
    // Mood: Intense | Speed: 50 | Density: 100 | Damping: 50
    // Flow: 100/100/100 | Cursor: 260/100/90
    const config = {
      bgColor: '#F6F7FB',
      intenseColor: [14, 166, 22],    // #0EA616
      calmColor: [233, 234, 235],      // #eef1f8ff
      speed: 0.0022,                 // speed: 50
      cursorRadius: 260,             // cursor radius: 260
      cursorPower: 100,
      damping: 0.08                  // damping: 50`
    };

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let nodes = [];

    const initNodes = () => {
      nodes = [];
      // Generous nodes around the edges and viewport space
      const count = Math.max(10, Math.floor((width * height) / 75000));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          radius: Math.random() * 280 + 260,
          colorType: i % 3 === 0 ? 'calm' : 'intense', // 66% intense green, 33% calm blue
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.003 + 0.0015
        });
      }
    };

    initNodes();

    let time = 0;

    const render = () => {
      time += config.speed;

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * config.damping;
      mouse.y += (mouse.targetY - mouse.y) * config.damping;

      ctx.fillStyle = config.bgColor;
      ctx.fillRect(0, 0, width, height);

      // Render fluid mood field blobs
      nodes.forEach((node, idx) => {
        node.phase += node.pulseSpeed;

        // Flow motion dynamics (100/100/100 flow field)
        const flowX = Math.sin(time + node.phase + idx) * 110;
        const flowY = Math.cos(time * 0.85 + node.phase) * 110;

        node.x = node.baseX + flowX;
        node.y = node.baseY + flowY;

        // Mouse displacement within radius 260
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.cursorRadius) {
          const force = (1 - dist / config.cursorRadius) * 60;
          node.x -= (dx / dist) * force;
          node.y -= (dy / dist) * force;
        }

        // Keep inside bounds softly
        if (node.x < -150) node.baseX += width + 300;
        if (node.x > width + 150) node.baseX -= width + 300;
        if (node.y < -150) node.baseY += height + 300;
        if (node.y > height + 150) node.baseY -= height + 300;

        // Create radial gradient for mood field color
        const [r, g, b] = node.colorType === 'intense' ? config.intenseColor : config.calmColor;
        const currentRadius = node.radius + Math.sin(node.phase) * 45;

        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          currentRadius
        );

        // Visibly rich alpha stops for clear environmental atmosphere
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.38)`);
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.18)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ambient organic tech grid lines
      ctx.strokeStyle = 'rgba(14, 166, 22, 0.04)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#F6F7FB]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
