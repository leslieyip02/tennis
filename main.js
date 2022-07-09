import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "orbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Court } from "./src/court.js";
import { Racket } from "./src/racket.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa7e677 );

const camera = new THREE.OrthographicCamera( 
    window.innerWidth / - 24, 
    window.innerWidth / 24, 
    window.innerHeight / 24, 
    window.innerHeight / - 24, 
    -100, 100
);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#court"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(10);
camera.position.setY(10);
camera.position.setZ(-10);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
const axesHelper = new THREE.AxesHelper( 5 );
scene.add(gridHelper, axesHelper)

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();

const court = new Court(scene);
court.render();

const racket = new Racket(scene, loader);
racket.render();

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();