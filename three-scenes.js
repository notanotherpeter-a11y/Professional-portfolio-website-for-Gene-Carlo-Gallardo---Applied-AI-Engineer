/* Cinematic 3D scenes for gene-carlo.com
 * - Hero: GLSL shader aurora + mouse-magnetic particle cloud + floating 3D "GC" monogram
 * - Showcase: icosahedron core, orbiting agent nodes, flowing data-packet pulses, scroll-scrubbed camera
 * - Cards: 3D tilt on hover
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

    /* =======================================================
     * HERO — shader aurora + magnetic particle cloud + 3D monogram
     * ======================================================= */
    function initHeroScene() {
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.autoClear = false;

        /* --- Background shader (fullscreen triangle) --- */
        const bgScene = new THREE.Scene();
        const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const bgUniforms = {
            uTime:     { value: 0 },
            uRes:      { value: new THREE.Vector2(1, 1) },
            uMouse:    { value: new THREE.Vector2(0.5, 0.5) },
            uColorA:   { value: new THREE.Color(0x2F81F7) },
            uColorB:   { value: new THREE.Color(0x3FB950) },
            uColorC:   { value: new THREE.Color(0x8B5CF6) }
        };
        const bgMat = new THREE.ShaderMaterial({
            uniforms: bgUniforms,
            transparent: true,
            depthWrite: false,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                varying vec2 vUv;
                uniform float uTime;
                uniform vec2 uRes;
                uniform vec2 uMouse;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform vec3 uColorC;

                // 2D simplex-ish noise (cheap)
                vec2 hash2(vec2 p) {
                    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
                    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    vec2 u = f*f*(3.0 - 2.0*f);
                    return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                                   dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
                               mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                                   dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
                }
                float fbm(vec2 p) {
                    float v = 0.0;
                    float a = 0.5;
                    for (int i = 0; i < 5; i++) {
                        v += a * noise(p);
                        p *= 2.03;
                        a *= 0.5;
                    }
                    return v;
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
                    float t = uTime * 0.08;

                    // Mouse-warped flow field
                    vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
                    vec2 warp = p + 0.25 * vec2(fbm(p * 1.8 + t), fbm(p * 1.8 - t + 4.2));
                    float d = length(warp - m * 0.4);

                    float n1 = fbm(warp * 1.6 + t);
                    float n2 = fbm(warp * 3.2 - t * 1.3 + vec2(5.0));

                    vec3 col = mix(uColorA, uColorB, smoothstep(-0.2, 0.6, n1));
                    col = mix(col, uColorC, smoothstep(0.2, 0.9, n2));

                    // Aurora bands
                    float band = smoothstep(0.1, 0.0, abs(warp.y + 0.3 * sin(warp.x * 1.2 + t * 2.0)));
                    col += band * 0.35 * uColorB;

                    // Mouse glow
                    col += 0.35 * uColorA * exp(-d * 2.8);

                    // Vignette
                    float vig = smoothstep(1.3, 0.3, length(p));
                    col *= vig;

                    // Low-alpha composite — let page bg show
                    float alpha = 0.55 * vig;
                    gl_FragColor = vec4(col, alpha);
                }
            `
        });
        const bgGeom = new THREE.PlaneGeometry(2, 2);
        const bgQuad = new THREE.Mesh(bgGeom, bgMat);
        bgScene.add(bgQuad);

        /* --- Foreground: particle cloud + 3D monogram --- */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
        camera.position.z = 55;

        // Particle cloud (original positions stored for magnetic return)
        const PC = 800;
        const pos = new Float32Array(PC * 3);
        const origPos = new Float32Array(PC * 3);
        const colArr = new Float32Array(PC * 3);
        const sizes = new Float32Array(PC);
        const cA = new THREE.Color(0x2F81F7);
        const cB = new THREE.Color(0x3FB950);
        const cC = new THREE.Color(0x8B5CF6);
        for (let i = 0; i < PC; i++) {
            const x = (Math.random() - 0.5) * 160;
            const y = (Math.random() - 0.5) * 90;
            const z = (Math.random() - 0.5) * 90;
            pos[i * 3] = origPos[i * 3] = x;
            pos[i * 3 + 1] = origPos[i * 3 + 1] = y;
            pos[i * 3 + 2] = origPos[i * 3 + 2] = z;
            const r = Math.random();
            const c = r < 0.5 ? cA.clone().lerp(cB, r * 2) : cB.clone().lerp(cC, (r - 0.5) * 2);
            colArr[i * 3] = c.r; colArr[i * 3 + 1] = c.g; colArr[i * 3 + 2] = c.b;
            sizes[i] = 0.3 + Math.random() * 0.9;
        }
        const pGeom = new THREE.BufferGeometry();
        pGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        pGeom.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.7,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        const points = new THREE.Points(pGeom, pMat);
        scene.add(points);

        // 3D Monogram "GC" — extruded text via shapes
        const monogram = buildMonogram();
        monogram.position.set(0, 0, 0);
        monogram.scale.setScalar(4.5);
        scene.add(monogram);

        // Lighting for monogram
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const key = new THREE.DirectionalLight(0x2F81F7, 1.6);
        key.position.set(5, 3, 5);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0x8B5CF6, 1.1);
        rim.position.set(-4, -2, 2);
        scene.add(rim);

        /* --- Sizing --- */
        function resize() {
            const w = canvas.clientWidth || canvas.parentElement.clientWidth;
            const h = canvas.clientHeight || canvas.parentElement.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            bgUniforms.uRes.value.set(w, h);
        }
        resize();
        window.addEventListener('resize', resize);

        /* --- Mouse --- */
        const mouseScreen = { x: 0.5, y: 0.5 };
        const mouseWorld = new THREE.Vector3(0, 0, 0);
        window.addEventListener('mousemove', function (e) {
            mouseScreen.x = e.clientX / window.innerWidth;
            mouseScreen.y = 1.0 - (e.clientY / window.innerHeight);
            // Project to a plane at z=0
            const ndc = new THREE.Vector3(mouseScreen.x * 2 - 1, mouseScreen.y * 2 - 1, 0.5);
            ndc.unproject(camera);
            const dir = ndc.sub(camera.position).normalize();
            const t = -camera.position.z / dir.z;
            mouseWorld.copy(camera.position).addScaledVector(dir, t);
        });

        const clock = new THREE.Clock();
        const still = prefersReducedMotion();
        const MAGNET_RADIUS = 18;
        const MAGNET_STRENGTH = 0.35;

        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            bgUniforms.uTime.value = t;
            bgUniforms.uMouse.value.set(mouseScreen.x, mouseScreen.y);

            const arr = pGeom.attributes.position.array;
            for (let i = 0; i < PC; i++) {
                const ox = origPos[i * 3], oy = origPos[i * 3 + 1], oz = origPos[i * 3 + 2];
                // idle drift
                const drift = still ? 0 : (Math.sin(t * 0.5 + i * 0.13) * 0.4);
                let tx = ox, ty = oy + drift, tz = oz;
                // magnetic repulsion around cursor
                const dx = tx - mouseWorld.x;
                const dy = ty - mouseWorld.y;
                const dz = tz - mouseWorld.z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if (dist < MAGNET_RADIUS && dist > 0.01) {
                    const f = (1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH * 12;
                    tx += (dx / dist) * f;
                    ty += (dy / dist) * f;
                    tz += (dz / dist) * f;
                }
                // ease toward target
                arr[i * 3]     += (tx - arr[i * 3])     * 0.1;
                arr[i * 3 + 1] += (ty - arr[i * 3 + 1]) * 0.1;
                arr[i * 3 + 2] += (tz - arr[i * 3 + 2]) * 0.1;
            }
            pGeom.attributes.position.needsUpdate = true;

            if (!still) {
                points.rotation.y = t * 0.03;
                monogram.rotation.y = Math.sin(t * 0.4) * 0.5;
                monogram.rotation.x = Math.sin(t * 0.3) * 0.15;
                monogram.position.y = Math.sin(t * 0.8) * 0.8;
            }

            // Camera parallax toward mouse
            const targetX = (mouseScreen.x - 0.5) * 10;
            const targetY = (mouseScreen.y - 0.5) * 6;
            camera.position.x += (targetX - camera.position.x) * 0.04;
            camera.position.y += (targetY - camera.position.y) * 0.04;
            camera.lookAt(0, 0, 0);

            renderer.clear();
            renderer.render(bgScene, bgCamera);
            renderer.clearDepth();
            renderer.render(scene, camera);
        }
        animate();
    }

    /* Build extruded 3D "GC" monogram using shape paths */
    function buildMonogram() {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
            color: 0x0D1117,
            emissive: 0x2F81F7,
            emissiveIntensity: 0.35,
            metalness: 0.85,
            roughness: 0.2,
            flatShading: false
        });
        const extrude = { depth: 0.35, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 32 };

        // G — ring with a notch
        const gShape = new THREE.Shape();
        gShape.absarc(0, 0, 1.0, Math.PI * 0.2, Math.PI * 2 - 0.05, false);
        gShape.lineTo(0.2, -0.05);
        gShape.lineTo(0.2, 0.35);
        gShape.lineTo(1.0, 0.35);
        const gHole = new THREE.Path();
        gHole.absarc(0, 0, 0.62, 0, Math.PI * 2, true);
        gShape.holes.push(gHole);
        const gGeom = new THREE.ExtrudeGeometry(gShape, extrude);
        gGeom.center();
        const gMesh = new THREE.Mesh(gGeom, mat);
        gMesh.position.x = -1.15;
        group.add(gMesh);

        // C — open ring
        const cShape = new THREE.Shape();
        cShape.absarc(0, 0, 1.0, Math.PI * 0.22, Math.PI * 1.78, false);
        const cHole = new THREE.Path();
        cHole.absarc(0, 0, 0.62, Math.PI * 0.22, Math.PI * 1.78, false);
        cShape.holes.push(cHole);
        const cGeom = new THREE.ExtrudeGeometry(cShape, extrude);
        cGeom.center();
        const cMesh = new THREE.Mesh(cGeom, mat);
        cMesh.position.x = 1.15;
        group.add(cMesh);

        // Outer wireframe halo
        const haloGeom = new THREE.TorusGeometry(3.0, 0.015, 8, 120);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0x2F81F7, transparent: true, opacity: 0.35 });
        const halo = new THREE.Mesh(haloGeom, haloMat);
        halo.rotation.x = Math.PI * 0.5;
        group.add(halo);

        const halo2 = halo.clone();
        halo2.rotation.x = Math.PI * 0.35;
        halo2.rotation.y = Math.PI * 0.2;
        group.add(halo2);

        return group;
    }

    /* =======================================================
     * SHOWCASE — icosahedron + agents + flowing data packets
     * ======================================================= */
    function initShowcaseScene() {
        const canvas = document.getElementById('showcase-3d-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 9);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        scene.add(new THREE.AmbientLight(0xffffff, 0.45));
        const keyLight = new THREE.DirectionalLight(0x2F81F7, 1.3);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);
        const rim = new THREE.DirectionalLight(0x3FB950, 0.8);
        rim.position.set(-5, -2, 3);
        scene.add(rim);
        const purple = new THREE.PointLight(0x8B5CF6, 1.0, 20);
        purple.position.set(0, 3, 2);
        scene.add(purple);

        // Core icosahedron
        const coreGeom = new THREE.IcosahedronGeometry(1.6, 1);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x161B22,
            emissive: 0x2F81F7,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2,
            flatShading: true
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        scene.add(core);

        // Wireframe halo
        const wire = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.9, 1),
            new THREE.MeshBasicMaterial({ color: 0x2F81F7, wireframe: true, transparent: true, opacity: 0.4 })
        );
        scene.add(wire);

        // Agents
        const agents = [];
        const AC = 8;
        const palette = [0x2F81F7, 0x3FB950, 0xD29922, 0x8B5CF6];
        for (let i = 0; i < AC; i++) {
            const color = palette[i % palette.length];
            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 20, 20),
                new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 1.0,
                    metalness: 0.2,
                    roughness: 0.3
                })
            );
            // Halo sprite
            const halo = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 12, 12),
                new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false })
            );
            mesh.add(halo);

            mesh.userData = {
                angle: (i / AC) * Math.PI * 2,
                radius: 3.2 + Math.random() * 0.7,
                yOff: (Math.random() - 0.5) * 1.5,
                speed: 0.25 + Math.random() * 0.4,
                color: color
            };
            agents.push(mesh);
            scene.add(mesh);
        }

        // Edges
        const edgePositions = new Float32Array(AC * 2 * 3);
        const edgeGeom = new THREE.BufferGeometry();
        edgeGeom.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
        const edges = new THREE.LineSegments(
            edgeGeom,
            new THREE.LineBasicMaterial({ color: 0x2F81F7, transparent: true, opacity: 0.4 })
        );
        scene.add(edges);

        // Data packets (flowing pulses along edges)
        const packets = [];
        for (let i = 0; i < AC; i++) {
            for (let k = 0; k < 2; k++) {
                const pk = new THREE.Mesh(
                    new THREE.SphereGeometry(0.09, 12, 12),
                    new THREE.MeshBasicMaterial({
                        color: agents[i].userData.color,
                        transparent: true,
                        opacity: 0.95,
                        blending: THREE.AdditiveBlending
                    })
                );
                pk.userData = { agent: i, t: (k / 2) + Math.random() * 0.3, speed: 0.4 + Math.random() * 0.5, dir: Math.random() < 0.5 ? 1 : -1 };
                packets.push(pk);
                scene.add(pk);
            }
        }

        function resize() {
            const w = canvas.clientWidth || canvas.parentElement.clientWidth;
            const h = canvas.clientHeight || canvas.parentElement.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        resize();
        window.addEventListener('resize', resize);

        // Drag-to-rotate
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

        // Scroll-scrubbed camera zoom
        const stage = canvas.parentElement;
        let scrollProgress = 0;
        function updateScroll() {
            const rect = stage.getBoundingClientRect();
            const vh = window.innerHeight;
            // 0 when stage bottom enters viewport, 1 when stage top exits
            const p = 1 - Math.max(0, Math.min(1, (rect.top + rect.height * 0.5) / vh));
            scrollProgress = p;
        }
        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();

        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            if (!still) {
                core.rotation.y += 0.005;
                core.rotation.x += 0.002;
                wire.rotation.y -= 0.003;
                wire.rotation.z += 0.002;
            }

            scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;
            scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;

            // Camera zoom via scroll
            const zoom = 9 - scrollProgress * 3.0;
            camera.position.z += (zoom - camera.position.z) * 0.08;
            camera.position.y = Math.sin(scrollProgress * Math.PI) * 1.2;
            camera.lookAt(0, 0, 0);

            purple.position.x = Math.cos(t * 0.8) * 3;
            purple.position.z = Math.sin(t * 0.8) * 3;

            // Agents
            for (let i = 0; i < AC; i++) {
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

            // Flowing data packets
            for (let p = 0; p < packets.length; p++) {
                const pk = packets[p];
                if (!still) pk.userData.t += 0.008 * pk.userData.speed * pk.userData.dir;
                if (pk.userData.t > 1) pk.userData.t -= 1;
                if (pk.userData.t < 0) pk.userData.t += 1;
                const a = agents[pk.userData.agent];
                const k = pk.userData.t;
                pk.position.set(a.position.x * k, a.position.y * k, a.position.z * k);
                const pulse = 0.6 + 0.4 * Math.sin(t * 6 + p);
                pk.material.opacity = 0.6 + 0.4 * pulse;
                pk.scale.setScalar(0.8 + 0.4 * pulse);
            }

            renderer.render(scene, camera);
        }
        animate();
    }

    /* =======================================================
     * CARD TILT
     * ======================================================= */
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
                const rx = (0.5 - y) * 9;
                const ry = (x - 0.5) * 12;
                card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px) scale(1.01)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }
})();
