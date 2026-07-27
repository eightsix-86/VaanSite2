let scene, camera, renderer, cake, cakeSlice, layers = [];
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0.2, y: 0 };
let scrollProgress = 0;
let sliceExtracted = false;

function init3DCake() {
    const canvas = document.getElementById('cake-canvas');
    const container = document.querySelector('.cake-canvas-wrapper');
    
    if (!canvas || !container) {
        console.log('Canvas or container not found');
        return;
    }

    console.log('Initializing 3D cake...');

    // Scene setup
    scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff69b4, 0.5, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff85c1, 0.3, 100);
    pointLight2.position.set(5, 3, -5);
    scene.add(pointLight2);

    // Create cake group
    cake = new THREE.Group();
    
    // Create SOLID cake with double frosting layer
    createSolidCake();
    
    // Create realistic WEDGE slice
    createCakeSlice();

    // Add decorative elements
    addFrosting();
    addCherries();
    addCandles();
    addSprinkles();

    scene.add(cake);
    cake.position.y = -2;

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.8;
    ground.receiveShadow = true;
    scene.add(ground);

    setupScrollControl();
    window.addEventListener('resize', onWindowResize);
    animate();
    
    console.log('3D cake initialized successfully!');
}

function createSpongeTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Base color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add sponge texture with holes
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 3 + 1;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.15})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Add lighter spots
    for (let i = 0; i < 800; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 2 + 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createSolidCake() {
    const totalHeight = 3.7;
    const baseRadius = 3;
    
    // Main pink frosted exterior
    const cakeGeometry = new THREE.CylinderGeometry(
        2,
        baseRadius,
        totalHeight,
        64
    );
    
    const cakeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF69B4,
        roughness: 0.4,
        metalness: 0.2
    });

    const solidCake = new THREE.Mesh(cakeGeometry, cakeMaterial);
    solidCake.position.y = totalHeight / 2;
    solidCake.castShadow = true;
    solidCake.receiveShadow = true;
    
    cake.add(solidCake);
    layers.push(solidCake);
}

function addFrosting() {
    const frostingMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFF0,
        roughness: 0.2,
        metalness: 0.2
    });

    // MIDDLE frosting band with drips
    const middleY = 1.85;
    const middleFrostingGeometry = new THREE.CylinderGeometry(2.7, 2.7, 0.2, 64);
    const middleFrosting = new THREE.Mesh(middleFrostingGeometry, frostingMaterial);
    middleFrosting.position.y = middleY;
    middleFrosting.castShadow = true;
    cake.add(middleFrosting);

    // Middle drips with VARIED lengths
    const middleDripLengths = [0.3, 0.5, 0.35, 0.6, 0.4, 0.55, 0.38, 0.52, 0.42, 0.48, 0.36, 0.58, 0.44, 0.5, 0.39, 0.56];
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const dripLength = middleDripLengths[i];
        const dripGeometry = new THREE.CylinderGeometry(0.08, 0.05, dripLength, 8);
        const drip = new THREE.Mesh(dripGeometry, frostingMaterial);
        drip.position.x = Math.cos(angle) * 2.7;
        drip.position.z = Math.sin(angle) * 2.7;
        drip.position.y = middleY - dripLength / 2 - 0.1;
        drip.castShadow = true;
        cake.add(drip);
    }

    // TOP frosting layer
    const topY = 3.7;
    const topFrostingGeometry = new THREE.CylinderGeometry(2.1, 2.1, 0.15, 64);
    const topFrosting = new THREE.Mesh(topFrostingGeometry, frostingMaterial);
    topFrosting.position.y = topY + 0.075;
    topFrosting.castShadow = true;
    cake.add(topFrosting);

    // Top drips with VARIED lengths
    const topDripLengths = [0.25, 0.4, 0.3, 0.5, 0.35, 0.45, 0.32, 0.48, 0.37, 0.42, 0.33, 0.47, 0.38, 0.44, 0.36, 0.46];
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const dripLength = topDripLengths[i];
        const dripGeometry = new THREE.CylinderGeometry(0.1, 0.06, dripLength, 8);
        const drip = new THREE.Mesh(dripGeometry, frostingMaterial);
        drip.position.x = Math.cos(angle) * 2.0;
        drip.position.z = Math.sin(angle) * 2.0;
        drip.position.y = topY - dripLength / 2;
        drip.castShadow = true;
        cake.add(drip);
    }
}

function createCakeSlice() {
    cakeSlice = new THREE.Group();
    
    const sliceAngle = Math.PI / 6; // 30 degree wedge
    const spongeTexture = createSpongeTexture('#FF1493');
    
    // Create layers matching the cake structure
    const layerData = [
        // Bottom strawberry layer
        { radiusStart: 3, radiusEnd: 2.8, height: 1.5, yStart: 0, color: 0xFF1493, type: 'sponge' },
        // First white frosting
        { radiusStart: 2.8, radiusEnd: 2.75, height: 0.15, yStart: 1.5, color: 0xFFFFF0, type: 'frosting' },
        // Middle strawberry layer
        { radiusStart: 2.75, radiusEnd: 2.3, height: 1.2, yStart: 1.65, color: 0xFF1493, type: 'sponge' },
        // Second white frosting
        { radiusStart: 2.3, radiusEnd: 2.25, height: 0.25, yStart: 2.85, color: 0xFFFFF0, type: 'frosting' },
        // Top pink frosting
        { radiusStart: 2.25, radiusEnd: 2, height: 0.3, yStart: 3.1, color: 0xFF69B4, type: 'topping' }
    ];

    // Create each layer as a proper tapered wedge
    layerData.forEach((layer) => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
        const uvs = [];
        const segments = 32;

        // Center point at bottom (index 0)
        vertices.push(0, 0, 0);
        uvs.push(0.5, 0);
        
        // Bottom arc vertices (indices 1 to segments+1)
        for (let i = 0; i <= segments; i++) {
            const theta = -sliceAngle / 2 + (sliceAngle * i / segments);
            const x = Math.cos(theta) * layer.radiusStart;
            const z = Math.sin(theta) * layer.radiusStart;
            vertices.push(x, 0, z);
            uvs.push(i / segments, 0);
        }

        // Center point at top
        const topCenterIndex = segments + 2;
        vertices.push(0, layer.height, 0);
        uvs.push(0.5, 1);
        
        // Top arc vertices (tapered)
        for (let i = 0; i <= segments; i++) {
            const theta = -sliceAngle / 2 + (sliceAngle * i / segments);
            const x = Math.cos(theta) * layer.radiusEnd;
            const z = Math.sin(theta) * layer.radiusEnd;
            vertices.push(x, layer.height, z);
            uvs.push(i / segments, 1);
        }

        // Bottom face triangles (fan from center 0)
        for (let i = 0; i < segments; i++) {
            indices.push(0, i + 1, i + 2);
        }

        // Top face triangles (fan from topCenterIndex)
        for (let i = 0; i < segments; i++) {
            indices.push(topCenterIndex, topCenterIndex + i + 2, topCenterIndex + i + 1);
        }

        // Outer curved surface quads
        for (let i = 0; i < segments; i++) {
            const b1 = i + 1;
            const b2 = i + 2;
            const t1 = topCenterIndex + i + 1;
            const t2 = topCenterIndex + i + 2;
            
            indices.push(b1, b2, t1);
            indices.push(t1, b2, t2);
        }

        // Left flat side (from centers to first arc points)
        indices.push(0, topCenterIndex, 1);
        indices.push(topCenterIndex, topCenterIndex + 1, 1);

        // Right flat side (from centers to last arc points)
        const lastBottom = segments + 1;
        const lastTop = topCenterIndex + segments + 1;
        indices.push(0, lastBottom, topCenterIndex);
        indices.push(topCenterIndex, lastBottom, lastTop);

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        // Create appropriate material
        let material;
        if (layer.type === 'sponge') {
            material = new THREE.MeshStandardMaterial({
                color: layer.color,
                roughness: 0.8,
                metalness: 0.1,
                map: spongeTexture
            });
        } else if (layer.type === 'frosting') {
            material = new THREE.MeshStandardMaterial({
                color: layer.color,
                roughness: 0.2,
                metalness: 0.2
            });
        } else {
            material = new THREE.MeshStandardMaterial({
                color: layer.color,
                roughness: 0.3,
                metalness: 0.3
            });
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = layer.yStart;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        cakeSlice.add(mesh);
    });

    // Add thin pink outer coating on the curved surface only
    const coatingGeometry = new THREE.BufferGeometry();
    const coatingVertices = [];
    const coatingIndices = [];
    const coatingUvs = [];
    const segments = 32;
    const totalHeight = 3.4;

    // Create coating vertices on the outer arc only
    for (let i = 0; i <= segments; i++) {
        const theta = -sliceAngle / 2 + (sliceAngle * i / segments);
        
        // Bottom vertex (slightly outside main cake)
        const xBottom = Math.cos(theta) * 3.03;
        const zBottom = Math.sin(theta) * 3.03;
        coatingVertices.push(xBottom, 0, zBottom);
        coatingUvs.push(i / segments, 0);
        
        // Top vertex (slightly outside main cake, tapered)
        const xTop = Math.cos(theta) * 2.03;
        const zTop = Math.sin(theta) * 2.03;
        coatingVertices.push(xTop, totalHeight, zTop);
        coatingUvs.push(i / segments, 1);
    }

    // Create quads for the coating surface
    for (let i = 0; i < segments; i++) {
        const b1 = i * 2;
        const t1 = i * 2 + 1;
        const b2 = (i + 1) * 2;
        const t2 = (i + 1) * 2 + 1;
        
        coatingIndices.push(b1, b2, t1);
        coatingIndices.push(t1, b2, t2);
    }

    coatingGeometry.setAttribute('position', new THREE.Float32BufferAttribute(coatingVertices, 3));
    coatingGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(coatingUvs, 2));
    coatingGeometry.setIndex(coatingIndices);
    coatingGeometry.computeVertexNormals();

    const coatingMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF69B4,
        roughness: 0.4,
        metalness: 0.2,
        side: THREE.DoubleSide
    });

    const coating = new THREE.Mesh(coatingGeometry, coatingMaterial);
    coating.castShadow = true;
    cakeSlice.add(coating);

    cakeSlice.position.set(0, -2, 0);
    cakeSlice.rotation.y = 0;
    cakeSlice.visible = false;
    scene.add(cakeSlice);
}

function addCherries() {
    const cherryGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const cherryMaterial = new THREE.MeshStandardMaterial({
        color: 0xDC143C,
        roughness: 0.2,
        metalness: 0.5
    });

    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({
        color: 0x228B22,
        roughness: 0.8
    });

    const topY = 3.7 + 0.15 + 0.3;
    
    const positions = [
        { x: 0, z: 0 },
        { x: 0.8, z: 0 },
        { x: -0.4, z: 0.7 },
        { x: -0.4, z: -0.7 }
    ];

    positions.forEach(pos => {
        const cherry = new THREE.Mesh(cherryGeometry, cherryMaterial);
        cherry.position.set(pos.x, topY, pos.z);
        cherry.castShadow = true;
        cake.add(cherry);

        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(pos.x, topY + 0.3, pos.z);
        stem.rotation.x = Math.random() * 0.3 - 0.15;
        cake.add(stem);

        const shineGeometry = new THREE.SphereGeometry(0.06, 16, 16);
        const shineMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });
        const shine = new THREE.Mesh(shineGeometry, shineMaterial);
        shine.position.set(pos.x - 0.08, topY + 0.08, pos.z + 0.08);
        cake.add(shine);
    });
}

function addCandles() {
    const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.9, 16);
    const candleMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFE4B5,
        roughness: 0.7
    });

    const flameGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    flameGeometry.scale(1, 1.5, 1);
    
    const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFA500,
        transparent: true,
        opacity: 0.9
    });

    const topY = 3.7 + 0.15 + 0.3;

    const candlePositions = [
        { x: 1.2, z: 0 },
        { x: -0.6, z: 1.04 },
        { x: -0.6, z: -1.04 }
    ];

    candlePositions.forEach((pos, index) => {
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.set(pos.x, topY + 0.45, pos.z);
        candle.castShadow = true;
        cake.add(candle);

        const wickGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8);
        const wickMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const wick = new THREE.Mesh(wickGeometry, wickMaterial);
        wick.position.set(pos.x, topY + 0.975, pos.z);
        cake.add(wick);

        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(pos.x, topY + 1.125, pos.z);
        flame.userData.index = index;
        cake.add(flame);

        const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(pos.x, topY + 1.125, pos.z);
        glow.userData.index = index;
        cake.add(glow);
    });
}

function addSprinkles() {
    const sprinkleColors = [0xFF1493, 0x00FF00, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFF0000, 0xFFA500];
    const topY = 3.7 + 0.15 + 0.3;
    
    for (let i = 0; i < 70; i++) {
        const sprinkleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8);
        const color = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
        const sprinkleMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.6
        });
        
        const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.9;
        
        sprinkle.position.x = Math.cos(angle) * radius;
        sprinkle.position.z = Math.sin(angle) * radius;
        sprinkle.position.y = topY + 0.05;
        
        sprinkle.rotation.x = Math.random() * Math.PI;
        sprinkle.rotation.z = Math.random() * Math.PI;
        
        sprinkle.castShadow = true;
        cake.add(sprinkle);
    }
}

function setupScrollControl() {
    const section = document.querySelector('.cake-section-3d');
    
    window.addEventListener('scroll', () => {
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        const scrollStart = -rect.top;
        const scrollRange = sectionHeight - viewportHeight;
        scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollRange));
        
        updateCakeAnimation(scrollProgress);
    });
}

function updateCakeAnimation(progress) {
    // Phase 1 (0-0.2): Rotate the cake
    if (progress <= 0.2) {
        const rotateProgress = progress / 0.2;
        targetRotation.y = rotateProgress * Math.PI * 2;
        cake.visible = true;
        cake.position.y = -2;
        
        cake.traverse((child) => {
            if (child.material) {
                child.material.transparent = false;
                child.material.opacity = 1;
            }
        });
        
        cakeSlice.visible = false;
        sliceExtracted = false;
        
        camera.position.set(0, 5, 12);
        camera.lookAt(0, 0, 0);
        
        // Force HIDE all callouts
        const callouts = document.querySelectorAll('.layer-callout');
        callouts.forEach(c => {
            c.style.opacity = '0';
            c.style.visibility = 'hidden';
            c.classList.remove('visible');
        });
        
        const cakeText = document.getElementById('cakeText');
        if (cakeText) cakeText.classList.remove('visible');
    }
    // Phase 2 (0.2-0.35): Slice comes OUT
    else if (progress <= 0.35) {
        const extractProgress = (progress - 0.2) / 0.15;
        const easeOut = 1 - Math.pow(1 - extractProgress, 3);
        
        if (!sliceExtracted) {
            cakeSlice.visible = true;
            sliceExtracted = true;
        }
        
        cake.visible = true;
        cakeSlice.position.x = easeOut * 5;
        cakeSlice.position.y = -2;
        cakeSlice.position.z = 0;
        cakeSlice.rotation.y = 0;
        
        cakeSlice.traverse((child) => {
            if (child.material) {
                child.material.transparent = false;
                child.material.opacity = 1;
            }
        });
        
        // Keep callouts HIDDEN
        const callouts = document.querySelectorAll('.layer-callout');
        callouts.forEach(c => {
            c.style.opacity = '0';
            c.style.visibility = 'hidden';
            c.classList.remove('visible');
        });
    }
    // Phase 3 (0.35-0.45): Main cake fades
    else if (progress <= 0.45) {
        const fadeProgress = (progress - 0.35) / 0.1;
        const easeIn = fadeProgress * fadeProgress;
        
        cakeSlice.position.x = 5;
        cakeSlice.position.y = -2;
        cakeSlice.position.z = 0;
        
        cake.position.y = -2 + easeIn * 12;
        cake.traverse((child) => {
            if (child.material) {
                child.material.transparent = true;
                child.material.opacity = 1 - fadeProgress;
            }
        });
        
        if (fadeProgress > 0.9) cake.visible = false;
        
        // Keep callouts HIDDEN
        const callouts = document.querySelectorAll('.layer-callout');
        callouts.forEach(c => {
            c.style.opacity = '0';
            c.style.visibility = 'hidden';
            c.classList.remove('visible');
        });
    }
    // Phase 4 (0.45-0.65): Slice moves to center, callouts FADE IN
    else if (progress <= 0.65) {
        const centerProgress = (progress - 0.45) / 0.2;
        const easeInOut = centerProgress < 0.5 
            ? 2 * centerProgress * centerProgress 
            : 1 - Math.pow(-2 * centerProgress + 2, 2) / 2;
        
        cake.visible = false;
        
        cakeSlice.position.x = 5 - easeInOut * 5;
        cakeSlice.position.y = -2;
        cakeSlice.position.z = 0;
        cakeSlice.rotation.y = easeInOut * Math.PI / 4;
        
        camera.position.set(0, 5, 12 - easeInOut * 3);
        camera.lookAt(0, 0, 0);
        
        // Gradually fade in callouts
        if (centerProgress > 0.3) {
            const calloutFade = (centerProgress - 0.3) / 0.7;
            const callouts = document.querySelectorAll('.layer-callout');
            callouts.forEach(c => {
                c.style.opacity = calloutFade.toString();
                c.style.visibility = 'visible';
            });
            
            const callout1 = document.getElementById('callout-1');
            const callout2 = document.getElementById('callout-2');
            const callout3 = document.getElementById('callout-3');
            
            if (calloutFade > 0.2 && callout1) callout1.classList.add('visible');
            if (calloutFade > 0.5 && callout2) callout2.classList.add('visible');
            if (calloutFade > 0.8 && callout3) callout3.classList.add('visible');
        } else {
            // Before 30%, keep hidden
            const callouts = document.querySelectorAll('.layer-callout');
            callouts.forEach(c => {
                c.style.opacity = '0';
                c.style.visibility = 'hidden';
                c.classList.remove('visible');
            });
        }
    }
    // Phase 5 (0.65-0.75): Slice stays centered
    else if (progress <= 0.75) {
        cakeSlice.position.set(0, -2, 0);
        cakeSlice.rotation.y = Math.PI / 4;
        
        camera.position.set(0, 5, 9);
        camera.lookAt(0, 0, 0);
        
        // Callouts FULLY VISIBLE
        const callouts = document.querySelectorAll('.layer-callout');
        callouts.forEach(c => {
            c.style.opacity = '1';
            c.style.visibility = 'visible';
            c.classList.add('visible');
        });
    }
    // Phase 6 (0.75-0.78): Slice and callouts FADE OUT VERY QUICKLY
    else if (progress <= 0.78) {
        const hideProgress = (progress - 0.75) / 0.03; // Changed from 0.07 to 0.03 for MUCH faster fade
        const easeIn = hideProgress * hideProgress * hideProgress;
        
        cakeSlice.position.x = 0;
        cakeSlice.position.y = -2 + easeIn * 15;
        cakeSlice.position.z = 0;
        
        const fadeOut = 1 - hideProgress;
        
        // Fade callouts WITH slice (very fast)
        const callouts = document.querySelectorAll('.layer-callout');
        callouts.forEach(c => {
            c.style.opacity = fadeOut.toString();
            if (fadeOut < 0.1) {
                c.style.visibility = 'hidden';
                c.classList.remove('visible');
            }
        });
        
        cakeSlice.traverse((child) => {
            if (child.material) {
                child.material.transparent = true;
                child.material.opacity = fadeOut;
            }
        });
    }
    // Phase 7 (0.78-1): Show text (adjusted from 0.82)
    else {
        const textProgress = (progress - 0.78) / 0.22;
        
        cakeSlice.visible = false;
        camera.position.set(0, 5, 12);
        camera.lookAt(0, 0, 0);
        
        // Callouts completely HIDDEN
        const callouts = document.querySelectorAll('.layer-callout');
        callouts.forEach(c => {
            c.style.opacity = '0';
            c.style.visibility = 'hidden';
            c.classList.remove('visible');
        });
        
        const cakeText = document.getElementById('cakeText');
        if (textProgress > 0.2 && cakeText) {
            cakeText.classList.add('visible');
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    if (scrollProgress <= 0.2) {
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
        cake.rotation.y = currentRotation.y;
        cake.position.y = -2 + Math.sin(time) * 0.08;
    }
    
    if (cakeSlice.visible && scrollProgress > 0.35 && scrollProgress <= 0.75) {
        const baseY = -2;
        cakeSlice.position.y = baseY + Math.sin(time * 0.5) * 0.03;
    }

    cake.children.forEach(child => {
        if (child.material && child.material.color && child.material.color.getHex() === 0xFFA500) {
            const index = child.userData.index || 0;
            child.scale.y = 1 + Math.sin(time * 3 + index * 2) * 0.15;
            child.scale.x = 1 + Math.sin(time * 4 + index * 1.5) * 0.08;
        }
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.querySelector('.cake-canvas-wrapper');
    if (!container) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DCake);
} else {
    init3DCake();
}

console.log('cake3d.js loaded - proper wedge slice with layers');