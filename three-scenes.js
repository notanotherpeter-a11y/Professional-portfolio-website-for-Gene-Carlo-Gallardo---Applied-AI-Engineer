/* 3D scenes for gene-carlo.com
 * - Hero: animated neural-network particle field
 * - Showcase: rotating icosahedron surrounded by orbiting agent nodes
 * - Project cards: subtle 3D tilt on hover/mouse
 * Fails gracefully when WebGL or Three.js is unavailable.
 */
(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    ready(function () {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded; 3D scenes disabled.');
            return;
        }

        initHeroScene();
        initShowcaseScene();
        initCardTilt();
    });

    /* ---------------- Hero neural-particle field ---------------- */
    function initHeroScene() {
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.z = 60;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Particle field
        const particleCount = 600;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const colA = new THREE.Color(0x2F81F7); // blue
        const colB = new THREE.Color(0x3FB950); // emerald

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3]     = (Math.random() - 0.5) * 140;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
            const mix = Math.random();
            const c = colA.clone().lerp(colB, mix);
            colors[i * 3]     = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.55,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const points = new THREE.Points(geom, mat);
        scene.add(points);

        // Connection lines (sparse)
        const lineGeom = new THREE.BufferGeometry();
        const linePositions = new Float32Array(120 * 2 * 3);
        lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x2F81F7,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending
        });
        const lines = new THREE.LineSegments(lineGeom, lineMat);
        scene.add(lines);

        function resize() {
            const w = canvas.clientWidth || canvas.parentElement.clientWidth;
            const h = canvas.clientHeight || canvas.parentElement.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        const mouse = { x: 0, y: 0 };
        window.addEventListener('mousemove', function (e) {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();
        const still = prefersReducedMotion();

        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            if (!still) {
                points.rotation.y = t * 0.05;
                points.rotation.x = Math.sin(t * 0.1) * 0.15;
            }

            // Update sparse connections among nearby particles
            const pos = geom.attributes.position.array;
            let idx = 0;
            const maxLines = 120;
            const maxDistSq = 36;
            for (let i = 0; i < particleCount && idx < maxLines; i += 7) {
                for (let j = i + 1; j < particleCount && idx < maxLines; j += 11) {
                    const dx = pos[i * 3]     - pos[j * 3];
                    const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                    const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    const dSq = dx * dx + dy * dy + dz * dz;
                    if (dSq < maxDistSq) {
                        linePositions[idx * 6]     = pos[i * 3];
                        linePositions[idx * 6 + 1] = pos[i * 3 + 1];
                        linePositions[idx * 6 + 2] = pos[i * 3 + 2];
                        linePositions[idx * 6 + 3] = pos[j * 3];
                        linePositions[idx * 6 + 4] = pos[j * 3 + 1];
                        linePositions[idx * 6 + 5] = pos[j * 3 + 2];
                        idx++;
                    }
                }
            }
            // Clear unused line slots
            for (let k = idx; k < maxLines; k++) {
                linePositions[k * 6] = linePositions[k * 6 + 1] = linePositions[k * 6 + 2] = 0;
                linePositions[k * 6 + 3] = linePositions[k * 6 + 4] = linePositions[k * 6 + 5] = 0;
            }
            lineGeom.attributes.position.needsUpdate = true;

            // Parallax with mouse
            camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
            camera.position.y += (mouse.y * 5 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();
    }

    /* ---------------- Showcase scene ---------------- */
    function initShowcaseScene() {
        const canvas = document.getElementById('showcase-3d-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 9);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const keyLight = new THREE.DirectionalLight(0x2F81F7, 1.2);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);
        const rim = new THREE.DirectionalLight(0x3FB950, 0.8);
        rim.position.set(-5, -2, 3);
        scene.add(rim);

        // Core icosahedron (orchestration layer)
        const coreGeom = new THREE.IcosahedronGeometry(1.6, 1);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x161B22,
            emissive: 0x2F81F7,
            emissiveIntensity: 0.25,
            metalness: 0.7,
            roughness: 0.25,
            flatShading: true
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        scene.add(core);

        // Wireframe outline
        const wireGeom = new THREE.IcosahedronGeometry(1.85, 1);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x2F81F7,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const wire = new THREE.Mesh(wireGeom, wireMat);
        scene.add(wire);

        // Orbiting agent nodes
        const agents = [];
        const agentCount = 8;
        const palette = [0x2F81F7, 0x3FB950, 0xD29922, 0x8B5CF6];
        for (let i = 0; i < agentCount; i++) {
            const g = new THREE.SphereGeometry(0.18, 16, 16);
            const m = new THREE.MeshStandardMaterial({
                color: palette[i % palette.length],
                emissive: palette[i % palette.length],
                emissiveIntensity: 0.9,
                metalness: 0.2,
                roughness: 0.3
            });
            const mesh = new THREE.Mesh(g, m);
            const angle = (i / agentCount) * Math.PI * 2;
            const radius = 3.2 + Math.random() * 0.6;
            const yOff = (Math.random() - 0.5) * 1.5;
            mesh.userData = { angle: angle, radius: radius, yOff: yOff, speed: 0.3 + Math.random() * 0.35 };
            agents.push(mesh);
            scene.add(mesh);
        }

        // Edges from core to agents
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x2F81F7, transparent: true, opacity: 0.35 });
        const edgePositions = new Float32Array(agentCount * 2 * 3);
        const edgeGeom = new THREE.BufferGeometry();
        edgeGeom.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
        const edges = new THREE.LineSegments(edgeGeom, edgeMat);
        scene.add(edges);

        function resize() {
            const w = canvas.clientWidth || canvas.parentElement.clientWidth;
            const h = canvas.clientHeight || canvas.parentElement.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        // Interactive drag-to-rotate
        let dragging = false, lastX = 0, lastY = 0;
        let targetRotY = 0, targetRotX = 0;
        canvas.addEventListener('pointerdown', function (e) {
            dragging = true; lastX = e.clientX; lastY = e.clientY;
            canvas.setPointerCapture(e.pointerId);
        });
        canvas.addEventListener('pointerup', function () { dragging = false; });
        canvas.addEventListener('pointermove', function (e) {
            if (!dragging) return;
            targetRotY += (e.clientX - lastX) * 0.005;
            targetRotX += (e.clientY - lastY) * 0.005;
            lastX = e.clientX; lastY = e.clientY;
        });

        const clock = new THREE.Clock();
        const still = prefersReducedMotion();

        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            if (!still) {
                core.rotation.y += 0.004;
                core.rotation.x += 0.002;
                wire.rotation.y -= 0.002;
                wire.rotation.z += 0.0015;
            }

            core.rotation.y += (targetRotY - (core.rotation.y - (still ? 0 : 0))) * 0;
            scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;
            scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;

            // Update agents
            for (let i = 0; i < agents.length; i++) {
                const a = agents[i];
                const ang = a.userData.angle + (still ? 0 : t * a.userData.speed * 0.3);
                const x = Math.cos(ang) * a.userData.radius;
                const z = Math.sin(ang) * a.userData.radius;
                const y = a.userData.yOff + Math.sin(t * a.userData.speed + i) * 0.25;
                a.position.set(x, y, z);

                edgePositions[i * 6]     = 0;
                edgePositions[i * 6 + 1] = 0;
                edgePositions[i * 6 + 2] = 0;
                edgePositions[i * 6 + 3] = x;
                edgePositions[i * 6 + 4] = y;
                edgePositions[i * 6 + 5] = z;
            }
            edgeGeom.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        }
        animate();
    }

    /* ---------------- 3D Card Tilt ---------------- */
    function initCardTilt() {
        if (prefersReducedMotion()) return;
        const cards = document.querySelectorAll('.project-card, .fact-card, .education-card');
        cards.forEach(function (card) {
            card.style.transformStyle = 'preserve-3d';
            card.style.transition = 'transform 0.15s ease-out';
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rx = (0.5 - y) * 8;
                const ry = (x - 0.5) * 10;
                card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }
})();
