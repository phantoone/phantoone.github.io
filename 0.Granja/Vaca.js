import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class Vaca extends THREE.Object3D {
  constructor( iniX, iniY, iniZ) {
    super();
    this.iniX = iniX;
    this.iniY = iniY;
    this.iniZ = iniZ;
    this.createGUI();

    // Materiales
    var vaca = new THREE.TextureLoader().load('../imgs/vaca.jpg');
    var matVaca = new THREE.MeshPhongMaterial({ map: vaca });

    this.pata1 = this.createPata(matVaca);
    this.pata2 = this.createPata(matVaca);
    this.pata3 = this.createPata(matVaca);
    this.pata4 = this.createPata(matVaca);

    this.pata1.position.set(3.5,  13, 6);
    this.pata2.position.set(3.5,  13, -5);
    this.pata3.position.set(-3.5, 13, 6);
    this.pata4.position.set(-3.5, 13, -5);

    this.cuerpo = this.createCuerpo(matVaca);
    this.cabeza = this.createCabeza(matVaca);
    this.cabeza.position.set(0,15.5,-7);
    this.cola = this.createCola(matVaca);

    //Añadir el modelo
    this.add(this.cuerpo);
    this.add(this.pata1);
    this.add(this.pata2);
    this.add(this.pata3);
    this.add(this.pata4);
    this.add(this.cabeza);
    this.add(this.cola);

    setTimeout(() => { this.animarVaca(); }, Math.floor(Math.random() * 10) * 900);
  }

  createPata(matVaca) {
    var matCasco = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var pataGeom = new THREE.CylinderGeometry(3, 1.5, 12, 32);
    var cascoGeom = new THREE.CylinderGeometry(1.5, 2.5, 3, 32);
    var pata = new THREE.Mesh(pataGeom, matVaca);
    var casco = new THREE.Mesh(cascoGeom, matCasco);
    pata.position.set(0,-5,0);
    casco.position.set(0, -11, 0);

    var res = new THREE.Object3D;
    res.add(pata);
    res.add(casco);

    return res;
  }

  createCuerpo(matVaca) {
    var rosa = new THREE.MeshPhongMaterial({ color: 0xFFC9D2 });
    var esfGeom = new THREE.SphereBufferGeometry(6.15, 32, 12, 1);
    var cilGeom = new THREE.CylinderGeometry(0.5, 0.5, 1,32,1);

    var pompi = new THREE.Mesh(esfGeom, matVaca);
    var pecho = new THREE.Mesh(esfGeom, matVaca);
    var puntos = [];
    puntos.push(new THREE.Vector3(0.01, 0.01, 0.01));
    puntos.push(new THREE.Vector3(6.0, 0.01, 0.01));
    puntos.push(new THREE.Vector3(5.6, 1.5, 0.01));
    puntos.push(new THREE.Vector3(5.3, 3, 0.01));
    puntos.push(new THREE.Vector3(5.2, 4.5, 0.01));
    puntos.push(new THREE.Vector3(5.1, 6.0, 0.01));
    puntos.push(new THREE.Vector3(5.2, 7.5, 0.01));
    puntos.push(new THREE.Vector3(5.3, 9, 0.01));
    puntos.push(new THREE.Vector3(5.6, 10.5, 0.01));
    puntos.push(new THREE.Vector3(6.0, 12.0, 0.01));
    puntos.push(new THREE.Vector3(0.01, 12.0, 0.01));

    var cuerpo = new THREE.Mesh(new THREE.LatheGeometry(puntos, 32, 1, Math.PI * 2), matVaca);
    
    //ubres
    var ubres = new THREE.Mesh(esfGeom, rosa); 
    ubres.scale.set(0.4,0.4,0.6);
    ubres.position.set(0,10,4);

    var palo1 = new THREE.Mesh(cilGeom, rosa);
    palo1.position.set(1.5, 8, 2);
    palo1.rotation.set(Math.PI/5,0,Math.PI/5);
    
    var palo2 = new THREE.Mesh(cilGeom, rosa);
    palo2.position.set(-1.5, 8, 2);
    palo2.rotation.set(Math.PI/5,0,-Math.PI/5);

    var palo3 = new THREE.Mesh(cilGeom, rosa);
    palo3.position.set(1.5, 8, 4);
    palo3.rotation.set(-Math.PI/6,0,Math.PI/6);
    
    var palo4 = new THREE.Mesh(cilGeom, rosa);
    palo4.position.set(-1.5, 8, 4);
    palo4.rotation.set(-Math.PI/6,0,-Math.PI/6);

    // Posicionar las piezas
    cuerpo.rotation.set(Math.PI / 2, 0, 0);
    cuerpo.position.set(0, 15, -6);

    pompi.rotation.set(Math.PI / 2, 0, 0);
    pecho.rotation.set(Math.PI / 2, 0, 0);

    pompi.position.set(0, 15, 6.55);
    pecho.position.set(0, 15, -6.55);

    pompi.scale.set(0.99, 0.85, 0.99);
    pecho.scale.set(1, 0.85, 1);

    var res = new THREE.Object3D;
    res.add(ubres);
    res.add(cuerpo);
    res.add(pompi);
    res.add(pecho);
    res.add(palo1);
    res.add(palo2);
    res.add(palo3);
    res.add(palo4);
    res.scale.set(1.2, 1.2, 1);
    res.position.set(0, -4, 0);

    return res;
  }

  createCola(matVaca){
    var colaGeom = new THREE.CylinderGeometry(0.5, 0.5, 9, 32);
    var puntaGeom = new THREE.CylinderGeometry(0.5,1,1.5,32);
    var negro = new THREE.MeshPhongMaterial({ color: 0x000000 });

    var cola = new THREE.Mesh(colaGeom, matVaca);
    var pelo = new THREE.Mesh(puntaGeom, negro);

    cola.position.set(0,16.5,12);
    cola.rotation.set(-Math.PI/4,0,0);

    pelo.position.set(0,13.5,15);
    pelo.rotation.set(-Math.PI/4,0,0);

    var res = new THREE.Object3D;
    res.add(cola);
    res.add(pelo);

    return res;
  }

  createCabeza(matVaca) {
    var rosa = new THREE.MeshPhongMaterial({ color: 0xFFC9D2 });
    var negro = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var amarillo = new THREE.MeshPhongMaterial({ color: 0xFCF2C5 });
    var blanco = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    var esfGeom = new THREE.SphereBufferGeometry(6.15, 32, 12, 1);
    var cuelloGeom = new THREE.CylinderGeometry(3, 5, 15, 32);

    var cabeza = new THREE.Mesh(esfGeom, matVaca);
    var cuello = new THREE.Mesh(cuelloGeom, matVaca);

    cabeza.scale.set(0.9, 0.9, 0.95);
    cabeza.position.set(0, 9, -7);

    cuello.rotation.set(-Math.PI / 4, 0, 0);
    cuello.position.set(0, 4, -4);

    //oreja
    var oreja = new THREE.Shape();
    oreja.moveTo(0, 0);
    oreja.quadraticCurveTo(0.3, 0.5, 0.0, 1.0);
    oreja.quadraticCurveTo(-0.3, 0.5, 0, 0);

    var extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 4, steps: 5, bevelSize: 1, bevelThickness: 0.1 };
    var geometry = new THREE.ExtrudeGeometry(oreja, extrudeSettings);

    var oreja1 = new THREE.Mesh(geometry, blanco);
    var oreja2 = new THREE.Mesh(geometry, negro);

    oreja1.scale.set(1.2, 1.4, 1.2);
    oreja1.rotation.set(0, 0, Math.PI / 3);
    oreja1.position.set(7, 10, -7);

    oreja2.scale.set(1.2, 1.4, 1.2);
    oreja2.rotation.set(0, 0, -Math.PI / 3);
    oreja2.position.set(-7, 10, -7);

    var oreja1rosa = new THREE.Mesh(geometry, rosa);
    var oreja2rosa = new THREE.Mesh(geometry, rosa);

    oreja1rosa.scale.set(0.9, 1.1, 0.9);
    oreja1rosa.rotation.set(0, 0, Math.PI / 3);
    oreja1rosa.position.set(7, 10, -7.1);

    oreja2rosa.scale.set(0.9, 1.1, 0.9);
    oreja2rosa.rotation.set(0, 0, -Math.PI / 3);
    oreja2rosa.position.set(-7, 10, -7.1);

    //hocico
    var hocico = new THREE.Mesh(esfGeom, rosa);
    hocico.scale.set(0.5,0.4,0.5);
    hocico.position.set(0,7,-12);
    
    //ojos
    var ojo1 = new THREE.Mesh(esfGeom, negro);
    ojo1.scale.set(0.1,0.1,0.1);
    ojo1.position.set(2.5,10,-11.7);

    var ojo2 = new THREE.Mesh(esfGeom, negro);
    ojo2.scale.set(0.1,0.1,0.1);
    ojo2.position.set(-2.5,10,-11.7);

    //cuernos
    var puntos = [];
    puntos.push(new THREE.Vector3(0.01, 0.01, 0.01));
    puntos.push(new THREE.Vector3(2.5, 0.01, 0.01));
    puntos.push(new THREE.Vector3(1.0, 4.0, 0.01));
    puntos.push(new THREE.Vector3(0.1, 5.0, 0.01));
    puntos.push(new THREE.Vector3(0.001, 5.0, 0.01));

    var cuerno1 = new THREE.Mesh(new THREE.LatheGeometry(puntos, 24 , 0 , Math.PI * 2 ), amarillo);
    cuerno1.scale.set(0.5,0.5,0.5);    
    cuerno1.rotation.set(0,0,-Math.PI/5);
    cuerno1.position.set(2.5,13,-7.1);

    var cuerno2 = new THREE.Mesh(new THREE.LatheGeometry(puntos, 24 , 0 , Math.PI * 2 ), amarillo);
    cuerno2.scale.set(0.5,0.5,0.5);    
    cuerno2.rotation.set(0,0,Math.PI/5);
    cuerno2.position.set(-2.5,13,-7.1);

    var res = new THREE.Object3D;
    res.add(cabeza);
    res.add(cuello);
    res.add(oreja1);
    res.add(oreja2);
    res.add(oreja1rosa);
    res.add(oreja2rosa);
    res.add(hocico);
    res.add(ojo1);
    res.add(ojo2);
    res.add(cuerno1);
    res.add(cuerno2);

    return res;
  }

  setAnimacion(valor) {
    this.animacion = valor;
  }

  createGUI() {
    this.guiControls = {
      rotX: 0.0,
      rotY: 0.0,
      rotZ: 0.0,

      posX: this.iniX,
      posY: this.iniY,
      posZ: this.iniZ,

      movCuello: 2,
      pataDcha: 0.0,
      pataIzqd: 0.0,
      superior: 0.0,
      
      Dcha: false,
      Izqd: false,
      Arriba: false,
      Abajo: false,
      movAndarActive : true,
      dirMovAndar : 1,
      controlAndar : 0,

      reset: () => {
        this.guiControls.movCuello = 0.0;
        this.guiControls.pataDcha = 0.0;
        this.guiControls.pataIzqd = 0.0;
        this.guiControls.superior = 0.0;

        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;

        this.guiControls.posX = this.iniX;
        this.guiControls.posY = this.iniY;
        this.guiControls.posZ = this.iniZ;

        this.guiControls.movAndarActive = true;
        this.guiControls.controlAndar = 0;
      },

      Animacion: false
    }

    // // Se crea una sección para los controles
    // var folder = gui.addFolder(titleGui);
    // folder.add(this.guiControls, 'movCuello', 1.5, 2, 0.08).name('Cuello Vaca : ').listen();
    // folder.add(this.guiControls, 'pataIzqd', -0.08, 0.08, 0.08).name('Pata izquierda : ').listen();
    // folder.add(this.guiControls, 'pataDcha', -0.08, 0.08, 0.08).name('Pata derecha : ').listen();
    // folder.add(this.guiControls, 'superior', 1.0, 0.0, 0.1).name('Superor gallina : ').listen();

    // // folder.add(this.guiControls, 'rotX', 0.0, Math.PI + Math.PI/2, 0.1).name('Rotación X : ').listen();
    // // folder.add(this.guiControls, 'rotY', 0.0, Math.PI+ Math.PI/2, 0.1).name('Rotación Y : ').listen();
    // // folder.add(this.guiControls, 'rotZ', 0.0, Math.PI+ Math.PI/2, 0.1).name('Rotación Z : ').listen();

    // folder.add(this.guiControls, 'posX', -20.0, 20.0, 0.1).name('Posición X : ').listen();
    // folder.add(this.guiControls, 'posY', 0.0, 10.0, 0.1).name('Posición Y : ').listen();
    // folder.add(this.guiControls, 'posZ', -20.0, 20.0, 0.05).name('Posición Z : ').listen();

    // folder.add (this.guiControls, 'movAndarActive')
    // .name ('Andar : ')
    // .onChange ( (value) => this.toggleAndar (value) );

    // folder.add(this.guiControls, 'reset').name('[ Reset ]');
    // folder.add(this.guiControls, 'Animacion')
    //   .name('Animacion : ')
    //   .onChange((value) => this.setAnimacion(value));
  }

  animarVaca() {
    var origen = { r: 0, };
    var destino = { r: 1.5 };
    var bajarCabeza = new TWEEN.Tween(origen).to(destino, 800)
      .onUpdate(() => {
        this.cabeza.rotation.x = -origen.r;
      })
      .onComplete(function () { pastar.start() });

    var origen2 = { r: 1.5 };
    var dest2 = { r: 0 };
    var subirCabeza = new TWEEN.Tween(origen2).to(dest2, 800)
      .onUpdate(() => {
        this.cabeza.rotation.x = -origen2.r;
      })
      .onComplete(function () {
        setTimeout(() => { bajarCabeza.start(); }, Math.floor(Math.random() * 10) * 900);

      })

    var origen1 = { r: 1.5 };
    var dest1 = { r: 1.2 };
    var pastar = new TWEEN.Tween(origen1).to(dest1, 400)
      .onUpdate(() => {
        this.cabeza.rotation.x = -origen1.r;
      })
      .yoyo(true)
      .repeat(5)
      .onComplete(function () {
        subirCabeza.start();
      });

    bajarCabeza.start();
  }

  // toggleAndar (valor) {
  //   this.movAndarActive = valor;
  // }
  // calculargiro(){
  //   if (this.guiControls.Abajo && (this.guiControls.Izqd == this.guiControls.Dcha) && !this.guiControls.Arriba)
  //     this.guiControls.rotY = 1;
  //   if (this.guiControls.Abajo && (!this.guiControls.Izqd) && this.guiControls.Dcha)
  //     this.guiControls.rotY = 1.25;
  //   if (this.guiControls.Dcha && (this.guiControls.Arriba == this.guiControls.Abajo) && !this.guiControls.Izqd)
  //     this.guiControls.rotY = 1.5;
  //   if (this.guiControls.Arriba && (!this.guiControls.Izqd) && this.guiControls.Dcha)
  //     this.guiControls.rotY = 1.75;
  //   if (this.guiControls.Arriba && (this.guiControls.Izqd == this.guiControls.Dcha) && !this.guiControls.Abajo)
  //     this.guiControls.rotY = 0;
  //   if (this.guiControls.Arriba && this.guiControls.Izqd && (!this.guiControls.Dcha))
  //     this.guiControls.rotY = 0.25;
  //   if (this.guiControls.Izqd && (this.guiControls.Arriba == this.guiControls.Abajo) && !this.guiControls.Dcha)
  //     this.guiControls.rotY = 0.5;
  //   if (this.guiControls.Abajo && this.guiControls.Izqd && (!this.guiControls.Dcha))
  //     this.guiControls.rotY = 0.75;
  // }
  // movAndar(dt){
  //   if(this.movAndarActive == true)
  //     if(this.guiControls.Abajo || this.guiControls.Izqd || this.guiControls.Dcha || this.guiControls.Arriba){
  //       if(this.guiControls.controlAndar < -0.08)
  //       this.guiControls.dirMovAndar = 0.5;
  //       if(this.guiControls.controlAndar > 0.08)
  //       this.guiControls.dirMovAndar = -0.5;
  //       this.guiControls.controlAndar +=1*this.guiControls.dirMovAndar*dt;
  //       this.guiControls.pataDcha = this.guiControls.controlAndar;
  //       this.guiControls.pataIzqd = this.guiControls.controlAndar;
  //     }else{
  //       this.guiControls.pataDcha = 0;
  //       this.guiControls.pataIzqd = 0;
  //     }
  // }

  update() {
    // if (this.guiControls.Abajo == true) {//0
    //   this.guiControls.posZ += 20*dt;
    // }
    // if (this.guiControls.Dcha == true) {//0.5
    //   this.guiControls.posX += 20*dt;
    // }
    // if (this.guiControls.Arriba == true) {//1
    //   this.guiControls.posZ -= 20*dt;
    // }
    // if (this.guiControls.Izqd == true) {//1.5
    //   this.guiControls.posX -= 20*dt;
    // }
    // this.calculargiro();
    // this.movAndar(dt);
    this.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);
    // this.cabeza.rotation.set((Math.PI * this.guiControls.movCuello), 0, 0);
    
    this.rotation.set (0,Math.PI *this.guiControls.rotY,0);
    
    // this.pata2.rotation.set(-Math.PI * (this.guiControls.pataDcha), 0, 0);
    // this.pata3.rotation.set(-Math.PI * (this.guiControls.pataDcha), 0, 0);
    
    // this.pata1.rotation.set(Math.PI * (this.guiControls.pataIzqd), 0, 0);
    // this.pata4.rotation.set(Math.PI * (this.guiControls.pataIzqd), 0, 0);
    TWEEN.update();
  }
}

export { Vaca };
