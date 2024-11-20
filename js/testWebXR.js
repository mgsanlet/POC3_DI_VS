import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer, currentModel;
let isTouching = false; // Variable para rastrear si el usuario está tocando la pantalla
let touchStartX = 0; // Posición inicial del toque en el eje X
let touchStartY = 0; // Posición inicial del toque en el eje Y

function init() {
    // Crear el renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Añadir el botón de AR
    document.body.appendChild(ARButton.createButton(renderer));

    // Crear la escena
    scene = new THREE.Scene();

    // Crear la cámara
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    scene.add(camera);

    // Crear una luz ambiental
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.5);
    scene.add(light);

    // Configurar los botones
    document.getElementById('cubeButton').addEventListener('click', () => loadModel('cube'));
    document.getElementById('coneButton').addEventListener('click', () => loadModel('cone'));
    document.getElementById('cylinderButton').addEventListener('click', () => loadModel('cylinder'));

    // Agregar eventos táctiles
    window.addEventListener('touchstart', onTouchStart, false);
    window.addEventListener('touchmove', onTouchMove, false);
    window.addEventListener('touchend', onTouchEnd, false);

    // Configurar el bucle de renderizado
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

function loadModel(type) {
    // Eliminar el modelo actual si existe
    if (currentModel) {
        scene.remove(currentModel);
    }

    let geometry;
    let material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff, // Color aleatorio
    });

    switch (type) {
        case 'cube':
            geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            break;
        case 'cone':
            geometry = new THREE.ConeGeometry(0.2, 0.4, 32);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32);
            break;
        default:
            return;
    }

    currentModel = new THREE.Mesh(geometry, material);
    currentModel.position.set(0, 0, -1); // Posicionar el modelo frente al usuario
    scene.add(currentModel);
}

function onTouchStart(event) {
    isTouching = true;
    touchStartX = event.touches[0].clientX; // Registrar la posición inicial X
    touchStartY = event.touches[0].clientY; // Registrar la posición inicial Y
}

function onTouchMove(event) {
    if (!isTouching || !currentModel) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    // Calcular la diferencia de movimiento
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;

    // Girar el modelo según el movimiento
    currentModel.rotation.y += deltaX * 0.005; // Ajustar velocidad de rotación en eje Y
    currentModel.rotation.x += deltaY * 0.005; // Ajustar velocidad de rotación en eje X

    // Actualizar las posiciones iniciales
    touchStartX = touchX;
    touchStartY = touchY;
}

function onTouchEnd() {
    isTouching = false; // Finalizar el toque
}

// Iniciar la aplicación al cargar la página
window.addEventListener('load', init);
