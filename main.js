import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SceneManager } from "./src/SceneManager";
import { Court } from "./src/Court.js";
import { Net } from "./src/Net";
import { Racket } from "./src/Racket.js";
import { Ball } from "./src/Ball";

const sm = new SceneManager();
const scene = sm.scene;
const camera = sm.camera;
const renderer = sm.renderer;

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

const court = new Court(scene);
const net = new Net(scene, loader);
const racket = new Racket(scene, loader);
const ball = new Ball(scene);

court.render();
net.render();
racket.render();
ball.render();

// handle resize
window.addEventListener("resize", e => sm.resize(), false);

// handle inputs
let keyboard = {};
document.addEventListener("keydown", e => keyboard[e.key] = true );
document.addEventListener("keyup", e => keyboard[e.key] = false );

// aniamtion loop
function animate() {
    requestAnimationFrame(animate);

    racket.update(keyboard);
    ball.update(net);
    renderer.render(scene, camera);
}

animate();