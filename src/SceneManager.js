import * as THREE from "three";

export class SceneManager {
    constructor() {
        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa7e677);

        // camera
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -32, window.innerWidth / 32, 
            window.innerHeight / 32, window.innerHeight / -32, -100, 100);
        this.camera.position.set(10, 8, -12);

        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#court") });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // lighting
        const ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        // helpers
        const gridHelper = new THREE.GridHelper(200, 50);
        const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(gridHelper, axesHelper);
    }
}