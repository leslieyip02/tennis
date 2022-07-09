import * as THREE from "three";

export class Court {
    constructor(scene) {
        this.scene = scene;
    }

    render() {
        const geometry = new THREE.PlaneGeometry(20, 10);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide, 
            // wireframe: true
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        this.scene.add(plane);
    }
}