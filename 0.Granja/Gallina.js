import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'

class Gallina extends THREE.Object3D {
  constructor(iniX, iniY, iniZ) {
    super();
    // Se crea las variables iniciales con los datos necesarios
    this.iniX = iniX;
    this.iniY = iniY;
    this.iniZ = iniZ
    this.createGUI();

    // Se crean las texturas que se van a utilizar
    var gallinaPlumaje = new THREE.TextureLoader().load('../imgs/plumasGallina2.png');
    var gallinaPlumajeRep = new THREE.TextureLoader().load('../imgs/plumasGallina2.png');
    gallinaPlumajeRep.wrapS = THREE.RepeatWrapping;
    gallinaPlumajeRep.wrapT = THREE.RepeatWrapping;
    gallinaPlumajeRep.repeat.set(0.3, 0.3);
    var MatGallinaPlumas = new THREE.MeshPhongMaterial({ map: gallinaPlumaje });
    var MatGallinaRep = new THREE.MeshPhongMaterial({ map: gallinaPlumajeRep });
    var Orange = new THREE.MeshPhongMaterial({ color: 0xffa600 });
    var Red = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    // Se crean las partes de la gallina
    this.cabezaGallina = this.createCabezaGallina(MatGallinaPlumas, Orange, Red);
    this.cuerpoGallina = this.createCuerpoGallina(MatGallinaPlumas, MatGallinaRep);
    this.pataGallinaDcha = this.createPataGallina(Orange);
    this.pataGallinaIzqd = this.createPataGallina(Orange);
    this.alaDcha = this.createAlaGallina(MatGallinaRep);
    this.alaIzqd = this.createAlaGallina(MatGallinaRep);

    // Se posicionan las partes creadas
    this.alaDcha.position.set(-1.55, 0.5, 0.8);
    this.alaIzqd.position.set(1.55, 0.5, 0.8);
    this.pataGallinaDcha.position.set(-0.8, 2, 0);
    this.pataGallinaIzqd.position.set(0.8, 2, 0);

    // Se ha agrupado la parte superior de la gallina
    this.superiorGallina = new THREE.Object3D();
    this.superiorGallina.add(this.cabezaGallina);
    this.superiorGallina.add(this.cuerpoGallina);
    this.superiorGallina.add(this.alaDcha);
    this.superiorGallina.add(this.alaIzqd);

    // Se une la gallina final
    this.add(this.superiorGallina);
    this.add(this.pataGallinaDcha);
    this.add(this.pataGallinaIzqd);
    this.scale.set(1.5,1.5,1.5);
    this.guiControls.movAndarActive = true;

    setTimeout(() => { this.animarGallina(); }, Math.floor(Math.random() * 10) * 900);
  }

  createCabezaGallina(Mat, Mat2, Mat3) {
    var cabezaGeo = new THREE.SphereGeometry(1, 10, 10);
    var cabeza = new THREE.Mesh(cabezaGeo, Mat);
    cabeza.position.set(0, 0, 4);

    var picoGeo = new THREE.ConeGeometry(0.5, 1.5);
    var pico = new THREE.Mesh(picoGeo, Mat2);
    pico.rotation.set(0, 0, Math.PI);
    pico.position.set(0, -1.2, 4);

    var cuelloGeo = new THREE.CylinderGeometry(0.5, 1.2, 4);
    var cuello = new THREE.Mesh(cuelloGeo, Mat);
    cuello.rotation.set(Math.PI / 2, 0, 0);
    cuello.position.set(0, 0, 2.5);

    var barbaGeo = new THREE.SphereGeometry(0.3, 4, 4);
    var barba = new THREE.Mesh(barbaGeo, Mat3);
    // cuello.rotation.set(Math.PI/2, 0, 0);
    barba.position.set(0, -1.05, 3.7);

    var crestaShape = new THREE.Shape();
    crestaShape
      .moveTo(0, 0).lineTo(0.65, 1)
      .absarc(0.4, 1, 0.2, 0, Math.PI)
      .absarc(0, 1, 0.2, 0, Math.PI)
      .absarc(-0.4, 1, 0.2, 0, Math.PI)
      .moveTo(-0.65, 1).lineTo(0, 0);

    var options = { depth: 0.1 };
    var crestaGeo = new THREE.ExtrudeBufferGeometry(crestaShape, options);
    var cresta = new THREE.Mesh(crestaGeo, Mat3);
    cresta.rotation.set(Math.PI * 0.3, Math.PI * 0.5, 0);
    cresta.position.set(0, 0, 4);

    var Black = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var ojosGeo = new THREE.SphereGeometry(0.15, 4, 4);
    var ojo1 = new THREE.Mesh(ojosGeo, Black);
    var ojo2 = new THREE.Mesh(ojosGeo, Black);
    ojo1.position.set(0.4, -0.8, 4.5);
    ojo2.position.set(-0.4, -0.8, 4.5);

    var cabezaCompleta = new THREE.Object3D;
    cabezaCompleta.add(cabeza);
    cabezaCompleta.add(pico);
    cabezaCompleta.add(cuello);
    cabezaCompleta.add(barba);
    cabezaCompleta.add(cresta);
    cabezaCompleta.add(ojo1);
    cabezaCompleta.add(ojo2);

    return cabezaCompleta;
  }

  createCuerpoGallina(Mat, matCola) {
    var cuerpoGeo = new THREE.SphereGeometry(2.2, 12, 12);
    var cuerpoCentral = new THREE.Mesh(cuerpoGeo, Mat);
    // cuerpo.position.set(0, 0, 3);
    var quitGeo = new THREE.BoxGeometry(1, 4, 4);
    var cuerpoQuit1 = new THREE.Mesh(quitGeo, Mat);
    var cuerpoQuit2 = new THREE.Mesh(quitGeo, Mat);
    cuerpoQuit1.position.set(-2, 0, 0);
    cuerpoQuit2.position.set(2, 0, 0);

    var cuerpoSubs = new CSG();
    cuerpoSubs.subtract([cuerpoCentral, cuerpoQuit1, cuerpoQuit2]);
    var cuerpo = cuerpoSubs.toMesh();

    var colaShape = new THREE.Shape();
    colaShape
      .absarc(0, 0, 0.85, Math.PI, Math.PI * 2)
      .moveTo(0.9, 0).lineTo(1.5, 2)
      .absarc(1, 2, 0.5, 0, Math.PI)
      .absarc(0, 2, 0.5, 0, Math.PI)
      .absarc(-1, 2, 0.5, 0, Math.PI)
      .lineTo(-1.5, 2).lineTo(-0.9, 0);

    var options = { depth: 0.1 };
    var colaGeo = new THREE.ExtrudeBufferGeometry(colaShape, options);
    var cola = new THREE.Mesh(colaGeo, matCola);
    cola.rotation.set(Math.PI * 1.85, 0, 0);
    cola.position.set(0, 0, -2);

    var cuerpoCompleto = new THREE.Object3D;
    cuerpoCompleto.add(cuerpo);
    cuerpoCompleto.add(cola);

    return cuerpoCompleto;
  }

  createAlaGallina(Mat) {
    var alaShape = new THREE.Shape();
    alaShape.absellipse(0, -1.5, 1.2, 2);
    var options = { depth: 0.1 };
    var alaGeo = new THREE.ExtrudeBufferGeometry(alaShape, options);
    var ala = new THREE.Mesh(alaGeo, Mat);
    ala.rotation.set(Math.PI * 0.3, Math.PI * 0.5, 0);

    var alaCompleta = new THREE.Object3D;
    alaCompleta.add(ala);

    return alaCompleta;
  }

  createPataGallina(Mat) {
    var pataGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 4, 4);
    var pata = new THREE.Mesh(pataGeo, Mat);
    pata.position.set(0, -2, 0);

    var pieShape = new THREE.Shape();
    pieShape
      .moveTo(0.2, 0)
      .lineTo(0.45, 1).lineTo(0.15, 0.4)
      .lineTo(0, 1.2)
      .lineTo(-0.15, 0.4).lineTo(-0.45, 1)
      .lineTo(-0.2, 0)
      .lineTo(-0.1, -0.1)
      .lineTo(0, -0.8).lineTo(0.1, -0.1)
      .lineTo(0.2, 0);

    var options = { depth: 0.1 };
    var pieGeo = new THREE.ExtrudeBufferGeometry(pieShape, options);
    var pie = new THREE.Mesh(pieGeo, Mat);
    pie.rotation.set(Math.PI * 0.5, 0, 0);
    pie.position.set(0, -3, 0);

    var pataCompleta = new THREE.Object3D;
    pataCompleta.add(pata);
    pataCompleta.add(pie);

    return pataCompleta;
  }

  createGUI() {
    // Controles para el tamaño, la orientación y la posición de la gallina y sus componentes
    this.guiControls = {
      movCuello: 1.65,
      pataDcha: 0.0,
      pataIzqd: 0.0,
      alas: 0.2,
      superior: 2.5,
      rotY: 1.0,
      posX: this.iniX,
      posY: this.iniY,
      posZ: this.iniZ,

      Dcha: false,
      Izqd: false,
      Arriba: false,
      Abajo: false,
      movAndarActive : true,
      dirMovAndar : 1,
      controlAndar : 0,

      // Un botón para dejarlo todo en su posición inicial
      reset: () => {
        this.guiControls.movCuello = 1.65;
        this.guiControls.pataDcha = 0.0;
        this.guiControls.pataIzqd = 0.0;
        this.guiControls.ala = 0.2;
        this.guiControls.patas = 0.0;
        this.guiControls.superior = 2.5;
        this.guiControls.rotY = 0.0;
        this.guiControls.posX = this.iniX;
        this.guiControls.posY = this.iniY;
        this.guiControls.posZ = this.iniZ;
        this.guiControls.movAndarActive = true;
        this.guiControls.controlAndar = 0;
      }
    }

    // // Se crea una sección para los controles
    // var folder = gui.addFolder(titleGui);
    // // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // // El método listen() permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    // folder.add(this.guiControls, 'movCuello', 1.5, 2.15, 0.08).name('Cuello Gallina : ').listen();
    // folder.add(this.guiControls, 'pataIzqd', -0.32, 0.32, 0.08).name('Pata izquierda : ').listen();
    // folder.add(this.guiControls, 'pataDcha', -0.32, 0.32, 0.08).name('Pata derecha : ').listen();
    // // folder.add(this.guiControls, 'patas', -0.5, 0.5, 0.08).name('Mov de las patas : ').listen();
    // // folder.add (this.guiControls, 'alaDcha', 0.1, 5.0, 0.1).name ('Ala derecha : ').listen();
    // // folder.add (this.guiControls, 'alaIzqd', 0.1, 5.0, 0.1).name ('Ala izquierda : ').listen();
    // folder.add(this.guiControls, 'alas', 0, 0.9, 0.1).name('Mov de las alas : ').listen();
    // folder.add(this.guiControls, 'superior', 1.0, 2.5, 0.1).name('Superor gallina : ').listen();
    // folder.add(this.guiControls, 'rotY', 0.0, 2, 0.1).name('Rotación Y : ').listen();
    // folder.add(this.guiControls, 'posX', -20.0, 20.0, 0.1).name('Posición X : ').listen();
    // folder.add(this.guiControls, 'posY', 0.0, 10.0, 0.1).name('Posición Y : ').listen();
    // folder.add(this.guiControls, 'posZ', -20.0, 20.0, 0.05).name('Posición Z : ').listen();
    // folder.add (this.guiControls, 'movAndarActive')
    //         .name ('Andar : ')
    //         .onChange ( (value) => this.toggleAndar (value) );
    // folder.add(this.guiControls, 'reset').name('[ Reset ]');
  }

  toggleAndar (valor) {
    this.movAndarActive = valor;
  }
  calculargiro(){
    if (this.guiControls.Abajo && (this.guiControls.Izqd == this.guiControls.Dcha) && !this.guiControls.Arriba)
      this.guiControls.rotY = 0;
    if (this.guiControls.Abajo && (!this.guiControls.Izqd) && this.guiControls.Dcha)
      this.guiControls.rotY = 0.25;
    if (this.guiControls.Dcha && (this.guiControls.Arriba == this.guiControls.Abajo) && !this.guiControls.Izqd)
      this.guiControls.rotY = 0.5;
    if (this.guiControls.Arriba && (!this.guiControls.Izqd) && this.guiControls.Dcha)
      this.guiControls.rotY = 0.75;
    if (this.guiControls.Arriba && (this.guiControls.Izqd == this.guiControls.Dcha) && !this.guiControls.Abajo)
      this.guiControls.rotY = 1;
    if (this.guiControls.Arriba && this.guiControls.Izqd && (!this.guiControls.Dcha))
      this.guiControls.rotY = 1.25;
    if (this.guiControls.Izqd && (this.guiControls.Arriba == this.guiControls.Abajo) && !this.guiControls.Dcha)
      this.guiControls.rotY = 1.5;
    if (this.guiControls.Abajo && this.guiControls.Izqd && (!this.guiControls.Dcha))
      this.guiControls.rotY = 1.75;
  }
  movAndar(dt){
    if(this.movAndarActive == true)
      if(this.guiControls.Abajo || this.guiControls.Izqd || this.guiControls.Dcha || this.guiControls.Arriba){
        if(this.guiControls.controlAndar < -0.32)
        this.guiControls.dirMovAndar = 1;
        if(this.guiControls.controlAndar > 0.32)
        this.guiControls.dirMovAndar = -1;
        this.guiControls.controlAndar +=3*this.guiControls.dirMovAndar*dt;
        this.guiControls.pataDcha = this.guiControls.controlAndar;
        this.guiControls.pataIzqd = this.guiControls.controlAndar;
      }else{
        this.guiControls.pataDcha = 0;
        this.guiControls.pataIzqd = 0;
      }
  }

  animarGallina(){
    var origen = { r: 1.1, };
    var destino = { r: 0 };
    var bajarCabeza = new TWEEN.Tween(origen).to(destino, 400)
      .onUpdate(() => {
        this.cabezaGallina.rotation.x = -origen.r;
      })
      .onComplete(function () { pastar.start() });

    var origen2 = { r: 0 };
    var dest2 = { r: 1.1 };
    var subirCabeza = new TWEEN.Tween(origen2).to(dest2, 400)
      .onUpdate(() => {
        this.cabezaGallina.rotation.x = -origen2.r;
      })
      .onComplete(function () {
        setTimeout(() => { bajarCabeza.start(); }, Math.floor(Math.random() * 10) * 900);

      })

    var origen1 = { r: 0 };
    var dest1 = { r: -0.5 };
    var pastar = new TWEEN.Tween(origen1).to(dest1, 200)
      .onUpdate(() => {
        this.cabezaGallina.rotation.x = -origen1.r;
      })
      .yoyo(true)
      .repeat(5)
      .onComplete(function () {
        subirCabeza.start();
      });

    bajarCabeza.start();
  }

  update(dt) {
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
    this.rotation.set(0, Math.PI * this.guiControls.rotY, 0);
    this.cabezaGallina.rotation.set((Math.PI * this.guiControls.movCuello), 0, 0);
    // this.alaDcha.rotation.set(0, 0, -Math.PI * (this.guiControls.alas));
    // this.alaIzqd.rotation.set(0, 0, Math.PI * (this.guiControls.alas));
    // this.pataGallinaDcha.rotation.set(-Math.PI * (this.guiControls.pataDcha), 0, 0);
    // this.pataGallinaIzqd.rotation.set(Math.PI * (this.guiControls.pataIzqd), 0, 0);
    // if (
    //   this.guiControls.pataDcha > 0.18 ||
    //   this.guiControls.pataIzqd > 0.18 ||
    //   this.guiControls.pataDcha < -0.1 ||
    //   this.guiControls.pataIzqd < -0.1
    // )
    //   this.guiControls.superior = 2.5;
    this.superiorGallina.position.set(0, this.guiControls.superior, 0);
    TWEEN.update();
  }
}


export { Gallina };
