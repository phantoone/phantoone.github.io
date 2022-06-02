import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Herramientas extends THREE.Object3D {
  constructor() {
    super();
    // this.createGUI();
    var metal = new THREE.TextureLoader().load('../imgs/metal.jpg');
    var madera = new THREE.TextureLoader().load('../imgs/wood.jpg');

    var metalMat = new THREE.MeshPhongMaterial ({map: metal});
    var maderaMat = new THREE.MeshPhongMaterial ({map: madera});

    this.regadera = this.createRegadera(metalMat);
    this.pala = this.createPala(metalMat, maderaMat);

    this.add(this.regadera);
    this.add(this.pala);
    this.regadera.visible=false;
    this.pala.visible=false;
  }

  createRegadera(Mat){
    var cuerpoGeo = new THREE.CylinderGeometry(2,2,3);
    var cuerpo = new THREE.Mesh(cuerpoGeo, Mat);
    cuerpo.position.set(0.5, -3, 0);

    var asaGeo = new THREE.TorusGeometry (1.8, 0.2, 5, 5, Math.PI*1.0)
    var asa = new THREE.Mesh(asaGeo, Mat);
    asa.position.set(0.5, -1.5, 0);

    var cuelloGeo = new THREE.CylinderGeometry(0.2,0.6,3);
    var cuello = new THREE.Mesh(cuelloGeo, Mat);
    cuello.rotation.set(0, 0, -Math.PI*0.28);
    cuello.position.set(3.2, -3, 0);

    var cabezaGeo = new THREE.CylinderGeometry(0.5,0.2,0.7);
    var cabeza = new THREE.Mesh(cabezaGeo, Mat);
    cabeza.rotation.set(0, 0, -Math.PI*0.28);
    cabeza.position.set(4.6, -1.85, 0);

    var regadera = new THREE.Object3D;
    regadera.add(cuerpo);
    regadera.add(asa);
    regadera.add(cuello);
    regadera.add(cabeza);

    return regadera;
  }

  createPala(Mat, Mat2){
    var cabezaShape = new THREE.Shape();
    cabezaShape
             .moveTo(0, 0).lineTo(2, 0)
             .bezierCurveTo( 2, 2,  2, 3,  0, 4)
             .bezierCurveTo(-2, 3, -2, 2, -2, 0)
             .lineTo(0, 0);

    var options = { depth: 0.1 };
    var cabezaGeo = new THREE.ExtrudeBufferGeometry(cabezaShape, options);
    var cabeza = new THREE.Mesh( cabezaGeo, Mat);
    cabeza.rotation.set( 0, 0, Math.PI*1.5);
    cabeza.position.set(3.5, 0, 0);

    var cuerpoGeo = new THREE.CylinderGeometry(0.35,0.35,4.5);
    var cuerpo = new THREE.Mesh(cuerpoGeo, Mat2);
    cuerpo.rotation.set( 0, 0, Math.PI*0.5);
    cuerpo.position.set(1.5, 0, 0);

    var asaGeo = new THREE.TorusGeometry (1.2, 0.4, 5, 3)
    var asa = new THREE.Mesh(asaGeo, Mat);
    // asa.rotation.set( 0, 0, Math.PI*0.5);
    asa.position.set(-1.5, 0, 0);
    
    var pala = new THREE.Object3D;
    pala.add(cabeza);
    pala.add(cuerpo);
    pala.add(asa);

    return pala;
  }

  // createGUI (gui) {
  //   this.guiControls = {
  //     regadera : () => {
  //       this.regadera();
  //     },  
  //     pala : () => {
  //       this.pala();
  //     },
  //     quit : () => {
  //       this.quit();
  //     }
  //   }
  //   var folder = gui.addFolder (titleGui);
  //   folder.add (this.guiControls, 'regadera').name ('[ Regadera ]');
  //   folder.add (this.guiControls, 'pala').name ('[ Pala ]');
  //   folder.add (this.guiControls, 'quit').name ('[ Quit ]');
  // }

  regadera(){
    this.regadera.visible=true;
    this.pala.visible=false;
  }

  pala(){
    this.regadera.visible=false;
    this.pala.visible=true;
  }

  quit(){
    this.regadera.visible=false;
    this.pala.visible=false;
  }
}


export { Herramientas };
