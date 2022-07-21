import * as THREE from "three";

export class Court {
    constructor(scene) {
        this.scene = scene;
    }

    render() {
        // white base to form lines
        const baseGeometry = new THREE.PlaneGeometry(64, 48);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const base = new THREE.Mesh(baseGeometry, lineMaterial);
        base.rotateX(Math.PI / 2);
        this.scene.add(base);
        
        // render green field above the white base
        const field = [];
        const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0xc1f7b9, side: THREE.DoubleSide });

        const leftEdge = new THREE.Mesh(new THREE.PlaneGeometry(64 - 2, 6), fieldMaterial);
        const rightEdge = new THREE.Mesh(new THREE.PlaneGeometry(64 - 2, 6), fieldMaterial);
        const bottomEdge = new THREE.Mesh(new THREE.PlaneGeometry(17, 33), fieldMaterial);
        const topEdge = new THREE.Mesh(new THREE.PlaneGeometry(17, 33), fieldMaterial);
        const leftMid = new THREE.Mesh(new THREE.PlaneGeometry(27, 16.25), fieldMaterial);
        const rightMid = new THREE.Mesh(new THREE.PlaneGeometry(27, 16.25), fieldMaterial);
        
        // magic numbers
        leftEdge.position.set(0, 0.01, 20);
        rightEdge.position.set(0, 0.01, -20);
        bottomEdge.position.set(22.5, 0.01, 0);
        topEdge.position.set(-22.5, 0.01, 0);
        leftMid.position.set(0, 0.01, 8.375);
        rightMid.position.set(0, 0.01, -8.375);
        
        field.push(leftEdge, rightEdge, bottomEdge, topEdge, leftMid, rightMid);
        field.forEach(component => {
            component.rotateX(Math.PI / 2);
            this.scene.add(component);
        });

        // shadow
        const shadowGeometry = new THREE.PlaneGeometry(64, 48);
        const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x3b945e, side: THREE.DoubleSide });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotateX(Math.PI / 2);
        shadow.position.set(0, -1, 0);
        this.scene.add(shadow);
    }
}