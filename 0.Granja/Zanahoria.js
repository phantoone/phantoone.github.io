import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Zanahoria extends THREE.Object3D {
  constructor() {
    super();
    var naranja = new THREE.MeshPhongMaterial({ color: 0xF08112 });
    var cabeza = this.createCabeza(naranja);
    var cuerpo = this.createCuerpo(naranja);
    var punta =  this.createPunta(naranja);
    var hojas =  this.createHojas();

    this.add(cabeza);
    this.add(cuerpo);
    this.add(punta);
    this.add(hojas);

    this.scale.set(2,2,2);
  }

  createCabeza(naranja) {
    var csg = new CSG();
    var esferaGeom = new THREE.SphereGeometry(1.5, 20, 10, 1);
    var cuboGeom = new THREE.BoxGeometry(4, 4, 4);

    var aux = new THREE.Mesh(cuboGeom, naranja);
    aux.position.set(0, -2, 0);
    var cabeza = new THREE.Mesh(esferaGeom, naranja);

    cabeza.scale.set(1, 0.8, 1);
    csg.union([cabeza]);
    csg.subtract([aux]);

    var resultado = csg.toMesh();
    resultado.position.set(0, 1.5, 0);

    var res = new THREE.Object3D();
    res.add(resultado);

    return res;
  }

  createPunta(naranja) {
    var csg = new CSG();
    var esferaGeom = new THREE.SphereGeometry(0.25, 20, 10, 1);
    var cuboGeom = new THREE.BoxGeometry(2, 2, 2);

    var aux = new THREE.Mesh(cuboGeom, naranja);
    aux.position.set(0, 1, 0);
    var cabeza = new THREE.Mesh(esferaGeom, naranja);

    cabeza.scale.set(1, 0.7, 1);

    csg.union([cabeza]);
    csg.subtract([aux]);

    var resultado = csg.toMesh();
    resultado.position.set(0, -1.5, 0);

    var res = new THREE.Object3D();
    res.add(resultado);

    return res;
  }

  createCuerpo(naranja) {
    var cilGeom = new THREE.CylinderGeometry(1.5, 0.25, 3, 20, 10);
    var cuerpo = new THREE.Mesh(cilGeom, naranja);

    var res = new THREE.Object3D();
    res.add(cuerpo);

    return res;
  }

  createHojas() {
    var verde = new THREE.MeshPhongMaterial({ color: 0x29BE2B });
    var cilGeom = new THREE.CylinderGeometry(0.15, 0.15, 2, 20, 10);
    var rama1 = new THREE.Mesh(cilGeom, verde);
    var rama2 = new THREE.Mesh(cilGeom, verde);
    var rama3 = new THREE.Mesh(cilGeom, verde);
    var rama4 = new THREE.Mesh(cilGeom, verde);

    rama1.rotation.set(0, Math.PI / 4, Math.PI / 4);
    rama2.rotation.set(0, -Math.PI / 4, Math.PI / 4);
    rama3.rotation.set(0, Math.PI / 4, -Math.PI / 4);
    rama4.rotation.set(0, -Math.PI / 4, -Math.PI / 4);
    var res = new THREE.Object3D();
    res.add(rama1);
    res.add(rama2);
    res.add(rama3);
    res.add(rama4);

    res.position.set(0, 2.5, 0);

    return res;
  }
}

export { Zanahoria };
