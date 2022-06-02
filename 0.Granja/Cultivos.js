import * as THREE from '../libs/three.module.js'
import { Zanahoria } from './Zanahoria.js'
import { Trigo } from './Trigo.js'
import { Vaca } from './Vaca.js'
import { Gallina } from './Gallina.js'

// Tipos cultivos
const Tipo = {
  ZANAHORIA: 1,
  TRIGO: 2,
  VACA: 3,
  POLLO: 4
};

class Cultivos extends THREE.Object3D {
  constructor( iniPosX, iniPosY, iniPosZ, iniRotY = 0) {
    super();
    // Se crea la parte de la interfaz que corresponde
    // this.gui = gui;
    // this.titlegui = titlegui;
    this.iniPosX = iniPosX;
    this.iniPosY = iniPosY;
    this.iniPosZ = iniPosZ;
    this.createGUI( iniPosX, iniPosZ);
    var cultGeo = new THREE.BoxGeometry (50,0.5,70);

    // Materiales
    this.arado = new THREE.TextureLoader().load('../imgs/plow.jpg');
    this.tierra = new THREE.TextureLoader().load('../imgs/dirt.png');
    this.paja = new THREE.TextureLoader().load('../imgs/hay.png');
    var matArado = new THREE.MeshPhongMaterial ({map:  this.arado});
    var matTierra = new THREE.MeshPhongMaterial ({map: this.tierra});
    var matPaja =  new THREE.MeshPhongMaterial ({map: this.paja});
    
    // Ya construir partes
    this.cultivo = new THREE.Mesh (cultGeo, matTierra);
    this.cultivo.userData = this;
    this.zanahorias = this.crearZanahorias();
    this.trigal = this.crearTrigal();
    this.vaca = this.crearVaca();
    this.gallinero = this.crearGallinero();
    this.vallas = this.crearValla();
    this.luz = this.crearLuz();

    this.luz.visible = false;
    this.zanahorias.visible = false;
    this.trigal.visible = false; 
    this.vaca.visible = false;  
    this.gallinero.visible = false;
    this.timer;

    var HitBoxGeo = new THREE.BoxGeometry (51,32,71);
    this.HitBox = new THREE.Mesh (HitBoxGeo, matTierra);
    this.HitBox.position.set(0, 15, 0);
    this.HitBox.visible = false;
    this.HitBox.userData = this;

    this.add(this.HitBox);
    this.add(this.cultivo);
    this.add(this.zanahorias);
    this.add(this.trigal);
    this.add(this.vaca);
    this.add(this.gallinero);
    this.add (this.vallas);
    this.add (this.luz);
    this.rotation.set(0, iniRotY*Math.PI, 0);
  }

  crearValla(){
    var valla = new THREE.TextureLoader().load('../imgs/fence.jpeg');
    var matValla = new THREE.MeshPhongMaterial ({map: valla});
    var geomLado1 = new THREE.BoxGeometry (50,15,0.5);
    var geomLado2 = new THREE.BoxGeometry (0.5,15,70);
  
    var valla1 = new THREE.Mesh(geomLado1, matValla);
    var valla2 = new THREE.Mesh(geomLado1, matValla);
    var valla3 = new THREE.Mesh(geomLado2, matValla);
    var valla4 = new THREE.Mesh(geomLado2, matValla);
  
    valla1.position.set(0, 7.5, 35);
    valla2.position.set(0,7.5,-35);
    valla3.position.set(25,7.5,0);
    valla4.position.set(-25,7.5,0);

    var vallado = new THREE.Object3D();
    vallado.add(valla1);
    vallado.add(valla2);
    vallado.add(valla3);
    vallado.add(valla4);
    return vallado;
  }
  
  cuboTrigo(){
    var z1 = new Trigo();
    var z2 = new Trigo();
    var z3 = new Trigo();
    var z4 = new Trigo();
    var z5 = new Trigo();
    var z6 = new Trigo();
    var z7 = new Trigo();
    var z8 = new Trigo();

    z1.position.set(0,10,0);
    z2.position.set(4,10,0);
    z3.position.set(-4,10,0);
    z4.position.set(2,10,4);
    z5.position.set(-2,10,4);
    z6.position.set(0,10,8);
    z7.position.set(4,10,8);
    z8.position.set(-4,10,8);

    z1.rotation.set(0,Math.PI/4,0);
    z2.rotation.set(0,Math.PI/4,0);
    z3.rotation.set(0,Math.PI/4,0);
    z4.rotation.set(0,Math.PI,0);
    z5.rotation.set(0,Math.PI,0);
    z6.rotation.set(0,Math.PI/4,0);
    z7.rotation.set(0,Math.PI/4,0);
    z8.rotation.set(0,Math.PI/4,0);

    var res = new THREE.Object3D();
    res.add(z1);
    res.add(z2);
    res.add(z3);
    res.add(z4);
    res.add(z5);
    res.add(z6);
    res.add(z7);
    res.add(z8);

    return res;
  }

  crearTrigal(){
    var z1 = this.cuboTrigo();
    var z2 = this.cuboTrigo();
    var z3 = this.cuboTrigo();
    var z4 = this.cuboTrigo();
    var z5 = this.cuboTrigo();
    var z6 = this.cuboTrigo();

    z1.position.set(-9,0,18);
    z2.position.set(9,0,18);
    z3.position.set(-9,0,-2);
    z4.position.set(9,0,-2);
    z5.position.set(-9,0,-22);
    z6.position.set(9,0,-22);

    var res = new THREE.Object3D();
    res.add(z1);
    res.add(z2);
    res.add(z3);
    res.add(z4);
    res.add(z5);
    res.add(z6);

    return res;
  }

  crearZanahorias(){
    var z1 = new Zanahoria();
    var z2 = new Zanahoria();
    var z3 = new Zanahoria();
    var z4 = new Zanahoria();
    var z5 = new Zanahoria();
    var z6 = new Zanahoria();

    z1.position.set(-9,0,20);
    z2.position.set(9,0,20);
    z3.position.set(-9,0,0);
    z4.position.set(9,0,0);
    z5.position.set(-9,0,-20);
    z6.position.set(9,0,-20);

    var res = new THREE.Object3D();
    res.add(z1);
    res.add(z2);
    res.add(z3);
    res.add(z4);
    res.add(z5);
    res.add(z6);

    return res;
  }

  crearVaca(){
    var vaca = new Vaca( 0, 0, 0);
    // vaca.position.set(0, -1, 0);
    // vaca.rotation.set(0, Math.PI, 0);
    return vaca;
  }

  crearGallinero(){
    this.g1 = new Gallina( -8, +2, +10);
    this.g2 = new Gallina(  0, +2, -5);
    this.g3 = new Gallina( +8, +2, +10);

    // this.g1.position.set(-8,5,10);
    // this.g2.position.set( 0,5,-5);
    // this.g3.position.set( 8,5,10);

    var res = new THREE.Object3D();
    res.add(this.g1);
    res.add(this.g2);
    res.add(this.g3);

    return res;
  }

  crearLuz(){
  var light = new THREE.PointLight( 0xffff00, 1, 100 );
  light.position.set( 0, 50, 0 );
  return light;
  }
  createGUI ( iniPosX,iniPosZ) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiCtrl = {
      posX : this.iniPosX,
      posY : this.iniPosY,
      posZ : this.iniPosZ,
      dimX: 51,
      dimY: 30,
      dimZ: 71,

      tiempo : [8500, 6000, 18000, 12000],
      precio : [8, 5, 25, 20],
      tbonus: 1,

      tipoCultivo : 0,
      libre : true,
    } 
  }

  ponerZanahorias(){
    this.cultivo.material.map = this.arado;
    this.cultivo.material.needsUpdate = true;
    this.zanahorias.visible = true;
  }

  ponerTrigal(){
    this.cultivo.material.map = this.arado;
    this.cultivo.material.needsUpdate = true;
    this.trigal.visible = true;
  }

  ponerVaca(){
    this.cultivo.material.map = this.paja;
    this.cultivo.material.needsUpdate = true;
    this.vaca.visible = true;
  }

  ponerGallinero(){
    this.cultivo.material.map = this.paja;
    this.cultivo.material.needsUpdate = true;
    this.gallinero.visible = true;
  }

  quitar(){
    this.cultivo.material.map = this.tierra;
    this.cultivo.material.needsUpdate = true;
    this.zanahorias.visible = false;
    this.trigal.visible = false;
    this.vaca.visible = false;
    this.gallinero.visible = false;
  }
  terminado(luz){
    luz.visible = true;
    // debugger;
  }

  ponerElemento(num, saldo, herramienta){
    var ret = 0;
    if(num == 0){
      if(this.guiCtrl.tipoCultivo != 0){
        clearTimeout(this.timer);
        this.guiCtrl.libre = true;
        this.luz.visible = false;
        this.guiCtrl.tipoCultivo=0;
        this.quitar();
        ret="QUITADO";
      }else
        ret="NADA";
    }else{
      if(this.guiCtrl.libre){
        if(herramienta == 1)
          this.guiCtrl.tbonus = 0.75;
        else
          this.guiCtrl.tbonus = 1;
        if(saldo >= this.guiCtrl.precio[num-1]){
          this.guiCtrl.tipoCultivo=num;
          this.guiCtrl.libre = false;
          switch(num){
            case 1: case Tipo.ZANAHORIA:
              this.quitar();
              this.ponerZanahorias();
            break;
            case 2: case Tipo.TRIGO:
              this.quitar();
              this.ponerTrigal();
              break;
            case 3: case Tipo.VACA:
              this.quitar();
              this.ponerVaca();
              break;
            case 4: case Tipo.POLLO:
              this.quitar();
              this.ponerGallinero();
            break;
          }
          this.timer=setTimeout(this.terminado, this.guiCtrl.tiempo[this.guiCtrl.tipoCultivo-1]*this.guiCtrl.tbonus, this.luz);
          ret = -this.guiCtrl.precio[num-1];
        }else{
          ret="NO_SALDO";
        }
      }else{
        if(this.luz.visible==true){
          this.luz.visible=false;
          var mbonus = 1.2;
          if(herramienta == 2)
            mbonus = 1.4;
          ret = this.guiCtrl.precio[this.guiCtrl.tipoCultivo-1] * mbonus;
          this.timer=setTimeout(this.terminado, this.guiCtrl.tiempo[this.guiCtrl.tipoCultivo-1]*this.guiCtrl.tbonus, this.luz);
        }else{
          ret="OCUPADO";
        }
      }
    }
    return ret;
  }

  activar(posicion){
    if(  ( (this.guiCtrl.posX-55) < posicion[0] && posicion[0] < this.guiCtrl.posX+55 )
      && ( (this.guiCtrl.posZ-65) < posicion[2] && posicion[2] < this.guiCtrl.posZ+65 ) ){
        return true;
      }
      return false;
  }

  colisiona(posicion, dimensiones){
    if(  ( (this.guiCtrl.posX-this.guiCtrl.dimX/2) < posicion[0]+dimensiones[0]/2 && posicion[0]-dimensiones[0]/2 < this.guiCtrl.posX+this.guiCtrl.dimX/2 )
      && ( (this.guiCtrl.posZ+this.guiCtrl.dimZ/2) < posicion[2]-dimensiones[2]/2 && posicion[2]+dimensiones[2]/2 < this.guiCtrl.posZ-this.guiCtrl.dimZ/2/2 ) ){
        return true;
      }
      return false;
  }

  update () {
    if(this.guiCtrl.tipoCultivo == 3)
    this.vaca.update();
    if(this.guiCtrl.tipoCultivo == 4){
      this.g1.update();
      this.g2.update();
      this.g3.update();
    }
    this.position.set (this.guiCtrl.posX, this.guiCtrl.posY, this.guiCtrl.posZ);
  }
}

export { Cultivos };
