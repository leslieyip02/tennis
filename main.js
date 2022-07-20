import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SceneManager } from "./src/SceneManager";
import { Court } from "./src/Court.js";
import { Racket } from "./src/Racket.js";
import { Net } from "./src/Net";

const sm = new SceneManager();
const scene = sm.scene;
const camera = sm.camera;
const renderer = sm.renderer;

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

const court = new Court(scene);
const net = new Net(scene, loader);
const racket = new Racket(scene, loader);

court.render();
net.render();
racket.render();

// handle inputs
let keyboard = {};
document.addEventListener("keydown", e => keyboard[e.key] = true );
document.addEventListener("keyup", e => keyboard[e.key] = false );

// aniamtion loop
function animate() {
    requestAnimationFrame(animate);

    racket.update(keyboard);
    renderer.render(scene, camera);
}

animate();