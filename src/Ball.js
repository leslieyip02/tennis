import * as THREE from "three";

const G = 0.01;
const MAX_POINTS = 180;

export class Ball {
    constructor(scene) {
        this.scene = scene;
        this.model = undefined;
        this.line = undefined;
        this.linePoints = 0;
        this.shadow = undefined;
        this.boundingSphere = undefined;

        this.x = 25;
        this.y = 15;
        this.z = 10;

        this.dx = 0.3;
        this.dy = 0;
        this.dz = 0.1;
    }

    render() {
        // ball
        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 16);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xf6ff82 });
        this.model = new THREE.Mesh(ballGeometry, ballMaterial);
        this.model.position.set(this.x, this.y, this.z);
        this.scene.add(this.model);
        
        // shadow
        const shadowGeometry = new THREE.CircleGeometry(0.8, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0xb1e9a8, side: THREE.DoubleSide });
        this.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        this.shadow.position.set(this.x, 0.015, this.z);
        this.shadow.rotateX(Math.PI / 2);
        this.scene.add(this.shadow);

        // line
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_POINTS * 3), 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.line);
        
        // collision detection
        this.boundingSphere = new THREE.Sphere(this.model.position, 0.5);
    }
    
    update(net) {
        if (!this.model || !net.boundingBox)
            return;
        
        // gravity
        this.dy -= G;
        if (this.y < 0.5) {
            this.y = 0.5;
            this.dy *= -0.95; 
        }
        
        // temporary walls 
        if (Math.abs(this.x) > 32)
            this.dx *= -1;
        if (Math.abs(this.z) > 24)
            this.dz *= -1;
        
        // collision 
        if (this.boundingSphere.intersectsBox(net.boundingBox)) {
            this.x = this.x > 0 ? 1 : -1;
            this.dx *= -1;
        }
        
        // movement
        this.x += this.dx;
        this.y += this.dy;
        this.z += this.dz;
        this.model.position.set(this.x, this.y, this.z);
        this.boundingSphere.set(this.model.position, 0.5);
        
        // shadow
        let shadowScale = (25 - this.y) / 25;
        this.shadow.scale.set(shadowScale, shadowScale, shadowScale);
        this.shadow.position.set(this.x, 0.015, this.z);
        
        // path line
        if (this.linePoints < MAX_POINTS) {
            this.line.geometry.attributes.position.array[this.linePoints * 3] = this.x;
            this.line.geometry.attributes.position.array[this.linePoints * 3 + 1] = this.y;
            this.line.geometry.attributes.position.array[this.linePoints * 3 + 2] = this.z;
            this.line.geometry.attributes.position.needsUpdate = true;
            this.line.geometry.setDrawRange(0, this.linePoints);
            this.linePoints++;
        } else {
            for (let i = 0; i < MAX_POINTS * 3; i++)
                this.line.geometry.attributes.position.array[i] = 
                this.line.geometry.attributes.position.array[i + 3];

            this.line.geometry.attributes.position.array[MAX_POINTS * 3 - 3] = this.x;
            this.line.geometry.attributes.position.array[MAX_POINTS * 3 - 2] = this.y;
            this.line.geometry.attributes.position.array[MAX_POINTS * 3 - 1] = this.z;
            this.line.geometry.attributes.position.needsUpdate = true;
        }
    }
}