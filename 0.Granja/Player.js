import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Herramientas } from './Herramientas.js'

class Player extends THREE.Object3D {
  constructor() {
    super();
    // Se crea la parte de la interfaz
    this.createGUI();
    // Se crean las texturas que se van a utilizar
    var playerFace = new THREE.TextureLoader().load('../imgs/face1.jpg');
    var MatFace = new THREE.MeshPhongMaterial({ map: playerFace });

    var MatPiel = new THREE.MeshPhongMaterial({ color: 0xF7C597 });
    var MatCamiseta = new THREE.MeshPhongMaterial({ color: 0x39A0D1 });
    var MatZapatos = new THREE.MeshPhongMaterial({ color: 0xffa600 });
    var MatPantalones = new THREE.MeshPhongMaterial({ color: 0x8C1D1D });

    // Se crean las partes de la player
    this.cabezaPlayer = this.createCabezaPlayer(MatPiel, MatZapatos);
    this.cabezaPlayer.position.set(0, 25, 0);
    this.cuerpoPlayer = this.createCuerpoPlayer(MatPiel, MatCamiseta, MatPantalones);

    this.brazoBajoDcha = this.createParteBrazoBajo(MatPiel, MatCamiseta);
    this.brazoAltoDcha = this.createParteBrazoAlto(MatCamiseta);
    this.brazoDcha = new THREE.Object3D;
    this.brazoDcha.add(this.brazoBajoDcha, this.brazoAltoDcha);

    this.brazoBajoIzqd = this.createParteBrazoBajo(MatPiel, MatCamiseta);
    this.brazoAltoIzqd = this.createParteBrazoAlto(MatCamiseta);
    this.brazoIzqd = new THREE.Object3D;
    this.brazoIzqd.add(this.brazoBajoIzqd, this.brazoAltoIzqd);

    this.herramienta = new Herramientas();
    this.brazoBajoIzqd.add(this.herramienta);
    this.herramienta.scale.set(1.2, 1.2, 1.2);
    this.herramienta.rotation.set(-Math.PI*0.5, Math.PI*1.5, -Math.PI*0.5);
    this.herramienta.position.set(0, -7, 0);

    this.piernaBajoDcha = this.createPartePiernaBajo(MatZapatos, MatPantalones);
    this.piernaAltoDcha = this.createPartePiernaAlto(MatPantalones);
    this.piernaDcha = new THREE.Object3D;
    this.piernaDcha.add(this.piernaBajoDcha, this.piernaAltoDcha);

    this.piernaBajoIzqd = this.createPartePiernaBajo(MatZapatos, MatPantalones);
    this.piernaAltoIzqd = this.createPartePiernaAlto(MatPantalones);
    this.piernaIzqd = new THREE.Object3D;
    this.piernaIzqd.add(this.piernaBajoIzqd, this.piernaAltoIzqd);
    
    this.brazoDcha.position.set(-4.8,20.5,2);
    this.brazoIzqd.position.set( 4.8,20.5,2);
    this.piernaDcha.position.set(-2.8, 8.5,2);
    this.piernaIzqd.position.set( 2.8, 8.5,2);

    // Se ha agrupado la parte superior del player
    this.superiorPlayer = new THREE.Object3D();
    this.superiorPlayer.add(this.cabezaPlayer);
    this.superiorPlayer.add(this.cuerpoPlayer);
    this.superiorPlayer.add(this.brazoDcha);
    this.superiorPlayer.add(this.brazoIzqd);

    // Se une todo
    this.add(this.piernaDcha);
    this.add(this.piernaIzqd);
    this.add(this.superiorPlayer);

    this.movAndarActive = true;
  }

  createCabezaPlayer(Mat, Mat2) {
    var MatNariz = new THREE.MeshPhongMaterial({ color: 0xF88277 });
    var cabezaGeo = new THREE.SphereGeometry(4, 10, 10);
    var cabeza = new THREE.Mesh(cabezaGeo, Mat);
    cabeza.scale.set(1, 1.1, 1);
    cabeza.rotation.set(0, Math.PI * 1.5, 0);
    cabeza.position.set(0, 2.7, 2);

    var cascoSombreroGeo = new THREE.SphereGeometry(4, 10, 10,0,Math.PI,0,Math.PI);
    var cascoSombrero = new THREE.Mesh(cascoSombreroGeo, Mat2);
    cascoSombrero.rotation.set(Math.PI * 1.4, 0, 0);
    cascoSombrero.position.set(0, 4.5, 1.5);

    var alaSombreroShape = new THREE.Shape();
    alaSombreroShape
    .absarc(0, 0, 7, 0, Math.PI * 2);
    var quitAlaSombreroShape = new THREE.Shape();
    quitAlaSombreroShape
    .absarc(0, 0, 3, 0, Math.PI * 2);
    alaSombreroShape.holes.push(quitAlaSombreroShape);
    var options = { depth: 0.1 };
    var alaSombreroGeo = new THREE.ExtrudeBufferGeometry(alaSombreroShape, options);
    var alaSombrero = new THREE.Mesh(alaSombreroGeo, Mat2);
    alaSombrero.rotation.set(Math.PI * 0.4, 0, 0);
    alaSombrero.position.set(0, 4.5, 2);

    var narizGeo = new THREE.ConeGeometry(2, 6);
    var nariz = new THREE.Mesh(narizGeo, MatNariz);
    nariz.rotation.set( Math.PI*0.5, 0,0);
    nariz.position.set(0, 1.5, 5);

    var cabezaCompleta = new THREE.Object3D;
    cabezaCompleta.add(cabeza);
    cabezaCompleta.add(cascoSombrero);
    cabezaCompleta.add(alaSombrero);
    cabezaCompleta.add(nariz);

    return cabezaCompleta;
  }

  createCuerpoPlayer(Mat, Mat2, Mat3) {
    var cuelloGeo = new THREE.CylinderGeometry(1.2, 1.5, 5);
    var cuello = new THREE.Mesh(cuelloGeo, Mat);
    cuello.position.set(0, 23, 1.5);

    var puntos = [];
    var puntos1 = [];
    puntos1.push(new THREE.Vector3(0.01, -1.01  , 0));
    puntos1.push(new THREE.Vector3( 2  , -1  , 0));
    puntos1.push(new THREE.Vector3( 3  , -0.5, 0));
    puntos1.push(new THREE.Vector3( 3.5, -0.3 , 0));
    puntos1.push(new THREE.Vector3( 4.0,  0  , 0));
    puntos1.push(new THREE.Vector3( 4.5,  0.3, 0));
    puntos1.push(new THREE.Vector3( 4.7,  0.5, 0));
    puntos1.push(new THREE.Vector3( 4.9,  1.5, 0));
    puntos.push(new THREE.Vector3( 4.9,  1.5, 0));
    puntos.push(new THREE.Vector3( 4.8,  3  , 0));
    puntos.push(new THREE.Vector3( 4.7,  4.5, 0));
    puntos.push(new THREE.Vector3( 4.6,  6.0, 0));
    puntos.push(new THREE.Vector3( 4.7,  7.5, 0));
    puntos.push(new THREE.Vector3( 4.8,  9  , 0));
    puntos.push(new THREE.Vector3( 4.5, 10.5, 0));
    puntos.push(new THREE.Vector3( 3.5, 12.5, 0));
    puntos.push(new THREE.Vector3( 3.3, 13.0, 0));
    puntos.push(new THREE.Vector3( 2.5, 13.5, 0));
    puntos.push(new THREE.Vector3(0.01, 13.5, 0));
    var cuerpo1 = new THREE.Mesh(new THREE.LatheGeometry(puntos1, 32, 1, Math.PI * 2), Mat3);
    cuerpo1.position.set(0, 9, 1.5);
    var cuerpo = new THREE.Mesh(new THREE.LatheGeometry(puntos, 32, 1, Math.PI * 2), Mat2);
    cuerpo.position.set(0, 9, 1.5);
    
    var cuerpoCompleto = new THREE.Object3D;
    cuerpoCompleto.add(cuello);
    cuerpoCompleto.add(cuerpo);
    cuerpoCompleto.add(cuerpo1);

    return cuerpoCompleto;
  }

  createParteBrazoBajo(Mat, Mat2){
    var manoGeo = new THREE.SphereGeometry(1.7, 8, 8);
    var mano = new THREE.Mesh( manoGeo, Mat);
    mano.position.set(0, -6, 0);

    var antebrazoGeo = new THREE.CylinderGeometry(1.2, 1.1, 6);
    var antebrazo = new THREE.Mesh( antebrazoGeo, Mat2);
    antebrazo.position.set(0, -3, 0);

    var brazoBajo = new THREE.Object3D;
    brazoBajo.add(mano);
    brazoBajo.add(antebrazo);
    brazoBajo.position.set(0,-6,0);
    return brazoBajo;
  }
  createParteBrazoAlto(Mat){
    var codoGeo = new THREE.SphereGeometry(1.2, 8, 8);
    var codo = new THREE.Mesh( codoGeo, Mat);
    codo.position.set(0, -6, 0);

    var supbrazoGeo = new THREE.CylinderGeometry(1.5, 1.2, 6);
    var supbrazo = new THREE.Mesh( supbrazoGeo, Mat);
    // supbrazo.rotation.set(0, 0, Math.PI*0.5);
    supbrazo.position.set(0, -3, 0);

    var hombroGeo = new THREE.SphereGeometry(1.5, 8, 8);
    var hombro = new THREE.Mesh(hombroGeo, Mat);

    var brazoAlto = new THREE.Object3D;
    brazoAlto.add(codo);
    brazoAlto.add(supbrazo);
    brazoAlto.add(hombro);

    return brazoAlto;
  }
  
  createPartePiernaBajo(Mat, Mat2){
    var pieGeo = new THREE.SphereGeometry(1.9, 8, 8);
    var pie = new THREE.Mesh( pieGeo, Mat);
    var quitPieGeo = new THREE.BoxGeometry(4, 2, 6);
    var quitPie = new THREE.Mesh( quitPieGeo, Mat2);

    pie.scale.set(1, 1, 1.5);
    quitPie.position.set(0, -1.3, 0);

    var pieCompletoCSG = new CSG();
    pieCompletoCSG.subtract([pie, quitPie])
    var pieCompleto = pieCompletoCSG.toMesh();

    pieCompleto.position.set(0, -6, 1);

    var antepiernaGeo = new THREE.CylinderGeometry(1.4, 1.1, 6);
    var antepierna = new THREE.Mesh( antepiernaGeo, Mat2);
    antepierna.position.set(0, -3, 0);

    var piernaBajo = new THREE.Object3D;
    piernaBajo.add(pieCompleto);
    piernaBajo.add(antepierna);
    piernaBajo.position.set(0,-5.5,0);

    return piernaBajo;
  }  
  
  createPartePiernaAlto(Mat){
    var rodillaGeo = new THREE.SphereGeometry(1.4, 8, 8);
    var rodilla = new THREE.Mesh( rodillaGeo, Mat);
    rodilla.position.set(0, -5.5, 0);

    var suppiernaGeo = new THREE.CylinderGeometry(1.8, 1.4, 5.5);
    var suppierna = new THREE.Mesh( suppiernaGeo, Mat);
    suppierna.position.set(0, -3, 0);

    var unionPiernaGeo = new THREE.SphereGeometry(1.8, 8, 8);
    var unionPierna = new THREE.Mesh( unionPiernaGeo, Mat);

    var piernaAlto = new THREE.Object3D;
    piernaAlto.add(rodilla);
    piernaAlto.add(suppierna);
    piernaAlto.add(unionPierna);

    return piernaAlto;
  }

  createGUI() {
    // Controles para el tamaño, la orientación y la posición de la player y sus componentes
    this.guiControls = {
      movCuello: 0,
      piernaDcha: 0.0,
      piernaIzqd: 0.0,
      brazos: 0,
      piernas: 0.0,
      rotY: 0.0,
      posX: 0.0,
      posY: 1.0,
      posZ: 0.0,
      dimX: 20,
      dimY: 30,
      dimZ: 20,

      Dcha: false,
      Izqd: false,
      Arriba: false,
      Abajo: false,
      movAndarActive : true,
      dirMovAndar : 1,
      controlAndar : 0,

      // Un botón para dejarlo todo en su posición inicial
      reset: () => {
        this.guiControls.movCuello = 0;
        this.guiControls.piernaDcha = 0.0;
        this.guiControls.piernaIzqd = 0.0;
        this.guiControls.brazo = 0.2;
        this.guiControls.piernas = 0.0;
        this.guiControls.superior = 2.5;
        this.guiControls.rotY = 0.0;
        this.guiControls.posX = 0.0;
        this.guiControls.posY = 1.0;
        this.guiControls.posZ = 0.0;
        this.guiControls.movAndarActive = true;
        this.guiControls.controlAndar = 0;
      }
    }

    // // Se crea una sección para los controles
    // var folder = gui.addFolder(titleGui);
    // // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // // El método listen() permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    // folder.add(this.guiControls, 'movCuello', 1.76, 2.16, 0.08).name('Cuello Player : ').listen();
    // folder.add(this.guiControls, 'piernaIzqd', -0.32, 0.24, 0.08).name('Pierna izquierda : ').listen();
    // folder.add(this.guiControls, 'piernaDcha', -0.32, 0.24, 0.08).name('Pierna derecha : ').listen();
    // folder.add(this.guiControls, 'piernas', -0.5, 0.5, 0.08).name('Mov de las piernas : ').listen();
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
    return this.guiControls.rotY;
  }
  movAndar(dt){
    if(this.movAndarActive == true)
      if(this.guiControls.Abajo || this.guiControls.Izqd || this.guiControls.Dcha || this.guiControls.Arriba){
        if(this.guiControls.controlAndar < -0.32)
        this.guiControls.dirMovAndar = 1;
        if(this.guiControls.controlAndar > 0.32)
        this.guiControls.dirMovAndar = -1;
        this.guiControls.controlAndar +=2*this.guiControls.dirMovAndar*dt;
        this.guiControls.piernaDcha = this.guiControls.controlAndar;
        this.guiControls.piernaIzqd = this.guiControls.controlAndar;
      }else{
        this.guiControls.piernaDcha = 0;
        this.guiControls.piernaIzqd = 0;
      }
  }

  animarAccion(){
    var origen1 = { r: 0 };
    var dest1 = { r: 2 };
    var accion = new TWEEN.Tween(origen1).to(dest1, 400)
      .onUpdate(() => {
        this.brazoBajoIzqd.rotation.x = -origen1.r;
      })
      .yoyo(true)
      .repeat(1)
      .onComplete(function () {
        accion.start();
      });
    accion.start();
  }

  animarNo(){
    var origen1 = { r: 0 };
    var dest1 = { r: 0.6 };
    var accion = new TWEEN.Tween(origen1).to(dest1, 200)
      .onUpdate(() => {
        this.cabezaPlayer.rotation.y = origen1.r;
      })
      .yoyo(true)
      .repeat(1)
      .onComplete(function () {
        accion2.start();
      });
    var origen2 = { r: 0 };
    var dest2 = { r: -0.6 };
    var accion2 = new TWEEN.Tween(origen2).to(dest2, 200)
    .onUpdate(() => {
      this.cabezaPlayer.rotation.y = origen2.r;
    })
    .yoyo(true)
    .repeat(1);
    accion.chain(accion2);

    accion.start();
  }

  update(dt = 1) {
    var mov = 40;
    if (this.guiControls.Abajo == true) {//0
      this.guiControls.posZ += mov*dt;
    }
    if (this.guiControls.Dcha == true) {//0.5
      this.guiControls.posX += mov*dt;
    }
    if (this.guiControls.Arriba == true) {//1
      this.guiControls.posZ -= mov*dt;
    }
    if (this.guiControls.Izqd == true) {//1.5
      this.guiControls.posX -= mov*dt;
    }
    this.calculargiro();
    this.movAndar(dt);
    this.position.set(this.guiControls.posX, this.guiControls.posY+2.2, this.guiControls.posZ);
    this.rotation.set(0, Math.PI * this.guiControls.rotY, 0);
    this.cabezaPlayer.rotation.set(0, (Math.PI * this.guiControls.movCuello), 0);
    this.brazoDcha.rotation.set(  Math.PI * (this.guiControls.piernaDcha), 0, -Math.PI*0.1);
    this.brazoIzqd.rotation.set( -Math.PI * (this.guiControls.piernaIzqd), 0,  Math.PI*0.1); 
    this.piernaDcha.rotation.set(-Math.PI * (this.guiControls.piernaDcha), 0, 0);
    this.piernaIzqd.rotation.set( Math.PI * (this.guiControls.piernaIzqd), 0, 0); 
    TWEEN.update();
  }

  colisiona(colisiona){
    if(colisiona){
      switch(this.calculargiro()){
        case 0:
          this.guiControls.posZ-= 5.0;
        break;
        case 0.25:
          this.guiControls.posX-= 2.0;
          this.guiControls.posZ-= 2.0;
        break;
        case 0.5:
          this.guiControls.posX-= 5.0;
        break;
        case 0.75:
          this.guiControls.posX-= 2.0;
          this.guiControls.posZ+= 2.0;
        break;
        case 1:
          this.guiControls.posZ+= 5.0;
        break;
        case 1.25:
          this.guiControls.posX+= 2.0;
          this.guiControls.posZ+= 2.0;
        break;
        case 1.5:
          this.guiControls.posX+= 5.0;
        break;
        case 1.75:
          this.guiControls.posX+= 2.0;
          this.guiControls.posZ-= 2.0;
        break;
      }
    this.position.set(this.guiControls.posX, this.guiControls.posY+2.2, this.guiControls.posZ);
    }
  }

  limiteMapa(){
    var px = 195-this.guiControls.posX,
        nx = this.guiControls.posX+195,
        pz = 195-this.guiControls.posZ,
        nz = this.guiControls.posZ+195;

    if(px<0){
      this.guiControls.posX=180;
    }  
    if(nx<0){
      this.guiControls.posX=-180;
    }
    if(pz<0){
      this.guiControls.posZ=180;
    }
    if(nz<0){
      this.guiControls.posZ=-180;
    }

    this.position.set(this.guiControls.posX, this.guiControls.posY+2.2, this.guiControls.posZ);
  }

  getPosition(){
    var posicion=[];
    posicion.push(this.guiControls.posX);
    posicion.push(this.guiControls.posY);
    posicion.push(this.guiControls.posZ);
    return posicion;
  }
  getDimensiones(){
    var posicion=[];
    posicion.push(this.guiControls.dimX);
    posicion.push(this.guiControls.dimY);
    posicion.push(this.guiControls.dimZ);
    return posicion;
  }
  regadera(){
    this.herramienta.regadera.visible=true;
    this.herramienta.pala.visible=false;
  }
  
  pala(){
    this.herramienta.regadera.visible=false;
    this.herramienta.pala.visible=true;
  }
  
  quit(){
    this.herramienta.regadera.visible=false;
    this.herramienta.pala.visible=false;
  }
}

export { Player };
