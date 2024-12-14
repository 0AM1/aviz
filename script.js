let audio, analyser, source, frequencyData;
let scene, camera, renderer, particles;

function init() {
    // Audio setup remains the same
    audio = new Audio('track1.mp3');
    audio.loop = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // Three.js setup with BufferGeometry
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Particles for visualization using BufferGeometry
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
        positions[i * 3] = Math.random() * 2 - 1;  // x
        positions[i * 3 + 1] = Math.random() * 2 - 1; // y
        positions[i * 3 + 2] = Math.random() * 2 - 1; // z
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ size: 0.02, color: 0x00ff00 });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // UI controls remain the same
    document.getElementById('playPause').onclick = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    };

    document.getElementById('switchTrack').onclick = () => {
        audio.src = audio.src.includes('track1') ? 'track2.mp3' : 'track1.mp3';
        if (!audio.paused) audio.play();
    };

    animate();
}
function startAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audio = new Audio();
        audio.src = 'track1.mp3';
        audio.loop = true;
        source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
    }
    
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    animate();
}
function switchTrack() {
    audio.src = audio.src.includes('track1') ? 'track2.mp3' : 'track1.mp3';
    if (!audio.paused) audio.play();
}

function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(frequencyData);
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = (frequencyData[(i / 3) % frequencyData.length] / 256) * 2 - 1;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}

init();
