import * as THREE from "three";
import netData from "../models/net.glb?url";

export class Net {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
        this.model = undefined;
        this.boundingBox = undefined;
    }

    async render() {
        this.model = await this.loader.loadAsync(netData)
            .then(data => data.scene.children[0]);
        this.model.position.set(0, 2.75, 0);
        this.scene.add(this.model);
 
        const min = new THREE.Vector3(-0.5, 0, -26);
        const max = new THREE.Vector3(0.5, 4.75, 26);
        this.boundingBox = new THREE.Box3(min, max);
    }
}