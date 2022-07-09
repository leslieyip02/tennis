export class Racket {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
    }

    async render() {
        const racketData = await this.loader.loadAsync("../models/racket.glb"); 
        const racketModel = await racketData.scene.children[0];
        racketModel.position.set(10, 10, 10);

        this.scene.add(racketModel);
    }
}