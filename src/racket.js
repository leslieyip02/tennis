import * as THREE from "three";
import racketData from "../models/racket.glb?url";

export class Racket {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
        this.model = undefined;

        this.x = 0;
        this.z = 0;
        this.dx = 0;
        this.dz = 0;
    }

    async render() {
        this.model = await this.loader.loadAsync(racketData)
            .then(data => data.scene.children[0]);
        this.model.position.set(this.x, 10, this.z);
        
        this.scene.add(this.model);
    }

    swing() {
        
    }

    update(keyboard) {
        if (!this.model)
            return;

        // apply friction
        this.dx *= 0.9;
        this.dz *= 0.9;

        // read keyboard input
        if (keyboard["w"]) this.dx += -0.1;
        if (keyboard["a"]) this.dz += 0.1;
        if (keyboard["s"]) this.dx += 0.1;
        if (keyboard["d"]) this.dz += -0.1;
        
        // movement
        this.x += this.dx;
        this.z += this.dz;
        this.model.position.set(this.x, 10, this.z);
    }
}