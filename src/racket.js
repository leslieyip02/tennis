import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import racketData from "../models/racket.glb?url";

export class Racket {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
    }

    async render() {
        const racketModel = await this.loader.loadAsync(racketData)
            .then(data => data.scene.children[0]);
        
        racketModel.position.set(10, 10, 10);

        this.scene.add(racketModel);
    }
}