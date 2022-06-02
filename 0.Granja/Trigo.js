import * as THREE from '../libs/three.module.js'

class Trigo extends THREE.Object3D {
    constructor() {
        super();
        var amarillo = new THREE.MeshPhongMaterial({ color: 0xFCDC5B });
        var cilGeom = new THREE.CylinderGeometry(0.05,0.05,4,20,1);
        var tallo = new THREE.Mesh(cilGeom, amarillo);
        var hojas = this.createHojas(amarillo);

        this.add(tallo);
        this.add(hojas);
        this.scale.set(5,5,5);
    }

    createHojas(amarillo){
        var forma = new THREE.Shape();

        forma.moveTo(0, 0);
        forma.quadraticCurveTo(0.3, 0.5, 0.0, 1.0);
        forma.quadraticCurveTo(-0.3, 0.5, 0, 0);
    
        this.extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 4, steps: 5, bevelSize: 1, bevelThickness: 0.1 };
    
        var geometry = new THREE.ExtrudeGeometry(forma, this.extrudeSettings);
        geometry.scale(0.2,0.2,0.2);

        var g1 = new THREE.Mesh(geometry, amarillo);
        var g2 = new THREE.Mesh(geometry, amarillo);
        var g3 = new THREE.Mesh(geometry, amarillo);
        var g4 = new THREE.Mesh(geometry, amarillo);
        var g5 = new THREE.Mesh(geometry, amarillo);
        var g6 = new THREE.Mesh(geometry, amarillo);
        var g7 = new THREE.Mesh(geometry, amarillo);
        var g8 = new THREE.Mesh(geometry, amarillo);
        var g9 = new THREE.Mesh(geometry, amarillo);
        var g10 = new THREE.Mesh(geometry, amarillo);

        g1.rotation.set(0,0,Math.PI/4);
        g1.position.set(-0.12,0,0);
        g2.rotation.set(0,0,Math.PI/4);
        g2.position.set(-0.12,0.5,0);

        g3.rotation.set(0,0,Math.PI/4);
        g3.position.set(-0.12,1,0);
        g4.rotation.set(0,0,Math.PI/4);
        g4.position.set(-0.12,1.5,0);

        g5.rotation.set(0,0,Math.PI/4);
        g5.position.set(-0.12,2,0);
        g6.rotation.set(0,0,-Math.PI/4);
        g6.position.set(0.12,0,0);

        g7.rotation.set(0,0,-Math.PI/4);
        g7.position.set(0.12,0.5,0);
        g8.rotation.set(0,0,-Math.PI/4);
        g8.position.set(0.12,1,0);

        g9.rotation.set(0,0,-Math.PI/4);
        g9.position.set(0.12,1.5,0);
        g10.rotation.set(0,0,-Math.PI/4);
        g10.position.set(0.12,2,0);


        var res = new THREE.Object3D();
        res.add(g1);
        res.add(g2);
        res.add(g3);
        res.add(g4);
        res.add(g5);
        res.add(g6);
        res.add(g7);
        res.add(g8);
        res.add(g9);
        res.add(g10);
        res.position.set(0,0,-0.05);
        return res;   
    }
}

export { Trigo };
