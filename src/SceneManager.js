import * as THREE from "three";

export class SceneManager {
    constructor() {
        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa7e677);

        // camera
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -30, window.innerWidth / 30, 
            window.innerHeight / 30, window.innerHeight / -30, -150, 150);
        this.camera.position.set(16, 12, -12);
        this.camera.lookAt(0, 0, 0);
        
        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#court") });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // lighting
        const ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        // helpers
        const gridHelper = new THREE.GridHelper(200, 50);
        const axesHelper = new THREE.AxesHelper(15);
        // this.scene.add(gridHelper, axesHelper);
    }

    resize() {
        this.camera.left = window.innerWidth / -32;
        this.camera.right = window.innerWidth / 32;
        this.camera.top = window.innerHeight / 32;
        this.camera.bottom = window.innerHeight / -32;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}