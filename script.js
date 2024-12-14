let audio, analyser, source, frequencyData;
let scene, camera, renderer, particles;

function init() {
    // Audio setup
    audio = new Audio('track1.mp3');
    audio.loop = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // Three.js setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Particles for visualization
    const geometry = new THREE.Geometry();
    for (let i = 0; i < 1000; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        geometry.vertices.push(vertex);
    }
    const material = new THREE.PointsMaterial({ size: 0.02, color: 0x00ff00 });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // UI controls
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

function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < particles.geometry.vertices.length; i++) {
        particles.geometry.vertices[i].y = (frequencyData[i % frequencyData.length] / 256) * 2 - 1;
    }
    particles.geometry.verticesNeedUpdate = true;
    renderer.render(scene, camera);
}

init();