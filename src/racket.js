import * as THREE from "three";
import redRacketData from "../models/racket_red.glb?url";
import blueRacketData from "../models/racket_blue.glb?url";

const hitSound = new Audio("../sounds/hit.mp3");
const swingSound = new Audio("../sounds/swing.mp3");
swingSound.volume = 0.25;

export class Racket {
    constructor(scene, loader, position, player, controls) {
        this.scene = scene;
        this.loader = loader;
        this.model = undefined;
        this.shadow = undefined;
        this.boundingBox = undefined;
        // this.helper = undefined;

        // player is 1 or -1 so certain values can be inverted
        this.player = player;
        this.controls = controls;

        this.x = position.x;
        this.y = position.y;
        this.z = position.z;

        this.dx = 0;
        this.dy = 0;
        this.dz = 0;
        
        this.rotation = { x: 0, y: 0, z: 0 };

        this.charge = 0;
        this.charging = false;
        this.swinging = false;
    }

    async render() {
        // racket
        this.model = await this.loader.loadAsync(this.player == 1 ? redRacketData : blueRacketData)
            .then(data => data.scene.children[0]);
        this.model.position.set(this.x, this.y, this.z);
        if (this.player == -1) this.model.rotateZ(Math.PI);
        this.model.rotateZ(Math.PI / 2);
        this.model.rotateY(Math.PI / 4);

        this.scene.add(this.model);
        
        // shadow
        const shadowGeometry = new THREE.CircleGeometry(1, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0xb1e9a8, side: THREE.DoubleSide });
        this.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        this.shadow.position.set(this.x, 0.015, this.z);
        this.shadow.rotateX(Math.PI / 2);
        this.scene.add(this.shadow);

        // collision
        this.boundingBox = new THREE.Box3().setFromObject(this.model);

        // this.helper = new THREE.Box3Helper(this.boundingBox, 0xff0000);
        // this.helper.updateMatrixWorld();
        // this.scene.add(this.helper);
    }

    swing(ball) {
        this.charge++;
        this.charging = true;

        // check whether the ball will end up to the left or right of the current position
        let t = Math.abs((ball.x - this.x) / ball.dx);
        let z = ball.dz * t;

        if (ball.y > 6) {
            this.smash();
        } else {
            if (this.player == 1) {
                if (ball.z + z > this.z) {
                    this.backhand();
                } else {
                    this.forehand();
                }   
            } else {
                if (ball.z + z < this.z) {
                    this.backhand();
                } else {
                    this.forehand();
                }   
            }
        }

        swingSound.currentTime = 0;
        swingSound.play();
    }

    forehand() {
        this.model.rotation.x = this.player * Math.PI / 2;
        this.model.rotation.y = this.player == 1 ? -Math.PI / 4 : Math.PI / 4 * 3;
        this.model.rotation.z = 0;
        this.model.rotateX(-Math.PI / 4);
        this.model.rotateY(-Math.PI / 5);
        
        this.rotation.x = this.player * -0.2;
        this.rotation.y = this.player * 0.8;
        this.rotation.z = 0.1;
    }

    backhand() {
        this.model.rotation.x = this.player * Math.PI / 2;
        this.model.rotation.y = this.player == 1 ? -Math.PI / 4 : Math.PI / 4 * 3;
        this.model.rotation.z = 0;
        this.model.rotateX(Math.PI / 4);
        this.model.rotateY(-Math.PI / 5);
        
        this.rotation.x = this.player * 0.2;
        this.rotation.y = this.player * 0.8;
        this.rotation.z = 0.1;
    }

    smash() {
        this.model.rotation.x = this.player * Math.PI / 2;
        this.model.rotation.y = 0;
        this.model.rotation.z = this.player * Math.PI / 2;
        this.model.rotateY(Math.PI / 2);
        this.model.rotateX(-Math.PI / 2);
        this.model.rotateZ(-Math.PI / 8);

        this.rotation.x = this.player * 0.7;
        this.rotation.y = this.player * 0.6;
        this.rotation.z = 0.15;
    }

    hit(ball) {
        ball.x = this.player == 1 ? this.boundingBox.min.x : this.boundingBox.max.x;
        ball.y = Math.max(ball.y, 4);

        // rotation x tied to dy
        // rotation y tied to dx and dz
        ball.dx = this.player * -Math.min(Math.abs(this.rotation.y) * 0.2, 0.8) * Math.random(1.0, 1.5);
        ball.dz = this.rotation.y * -0.08 * Math.random(0.10, 0.12) * (Math.random() > 0.3 ? 1 : -1);
        ball.dy = Math.min(Math.abs(this.rotation.x) * 0.2, 0.03);
        // ball.dx = this.player * -Math.min(Math.abs(this.rotation.y) * 5, 0.8) * Math.random(1.0, 1.5);
        // ball.dz = this.rotation.y * -0.8 * Math.random(1.0, 1.2) * (Math.random() > 0.3 ? 1 : -1);
        // ball.dy = Math.min(Math.abs(this.rotation.x) * 3, 0.3);

        // spin
        if (this.charge > 200) 
            ball.d2z = 0.05 * Math.min(this.charge * 0.0001, 0.01) * (Math.random() > 0.5 ? 1 : -1);

        this.charge = 0;
        this.swinging = false;

        hitSound.currentTime = 0;
        hitSound.play();
    }

    update(keyboard, ball, dt) {
        if (!this.model)
            return;
        
        // update bounding box
        this.boundingBox.setFromObject(this.model);
        // make bounding box bigger
        this.boundingBox.min.x -= 1;
        this.boundingBox.min.y -= 1;
        this.boundingBox.min.z -= 1;
        this.boundingBox.max.x += 1;
        this.boundingBox.max.y += 1;
        this.boundingBox.max.z += 1;
        // this.helper.updateMatrixWorld();

        // apply friction
        this.dx *= 0.9;
        this.dy *= 0.9;
        this.dz *= 0.9;
        this.rotation.x *= 0.8;
        this.rotation.y *= 0.8;
        this.rotation.z *= 0.8;

        // read keyboard input
        if (keyboard[this.controls.up]) this.dx += -0.008;
        if (keyboard[this.controls.left]) this.dz += 0.008;
        if (keyboard[this.controls.down]) this.dx += 0.008;
        if (keyboard[this.controls.right]) this.dz += -0.008;
        
        this.charging = false;
        this.swinging = !Object.values(this.rotation).every(r => Math.abs(r) < 0.05);
        if (keyboard[this.controls.swing]) {
            this.swing(ball);
        } else if (!this.swinging) {
            this.charge = 0;
        }

        // movement
        if (this.player == 1) {
            this.x = Math.max(this.x + this.dx * dt, 6);
        } else {
            this.x = Math.min(this.x + this.dx * dt, -6);
        }
        
        this.z += this.dz * dt;
        this.model.position.set(this.x, this.y, this.z);
        
        // rotation
        this.model.rotation.x += this.rotation.x;
        this.model.rotation.y += this.rotation.y;
        this.model.rotation.z += this.rotation.z;

        // shadow
        let s = new THREE.Vector3();
        this.boundingBox.getCenter(s);
        this.shadow.position.set(s.x, 0.015, s.z);
    }
}