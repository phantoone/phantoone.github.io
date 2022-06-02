// Clases de la biblioteca
import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { OrbitControls, MapControls } from '../libs/OrbitControls.js'
// import { Vector3 } from '../libs/Vector3js.js'
import { Stats } from '../libs/stats.module.js'

// Clases de mi proyecto
import { Gallina } from './Gallina.js'
import { Herramientas } from './Herramientas.js'
import { Cultivos } from './Cultivos.js'
import { Vaca } from './Vaca.js'
import { Player } from './Player.js'
import { Zanahoria } from './Zanahoria.js'
import { Trigo } from './Trigo.js'

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */
class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    // Crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    this.posPlayer = new THREE.Vector3 (0,0,0);
    this.initStats();
    // Construimos los distinos elementos que tendremos en la escena
    this.createLights ();
    this.zoom=200;
    this.createCamera ();
    this.createGround ();
    this.createSkybox ();
    
    //Reloj
    this.clock = new THREE.Clock();
    
    // Por último creamos los modelos
    this.player = new Player( "Controles player");
    this.hbplayer = new THREE.Box3().setFromObject(this.player);
    this.posPlayer = this.player.getPosition();
    this.add (this.player);

    this.cultivos = [
      new Cultivos( -100,  0, -80, 1),
      new Cultivos(    0,  0, -80, 1),
      new Cultivos(  100,  0, -80, 1),
      new Cultivos( -100,  0,  80),
      new Cultivos(    0,  0,  80),
      new Cultivos(  100,  0,  80)
    ];
    this.hbcultivos = [];
    this.buscar = [];
    for(var i=0 ; i<this.cultivos.length ; i++){
      this.cultivos[i].update();
      this.add(this.cultivos[i]);
      this.hbcultivos.push(new THREE.Box3().setFromObject(this.cultivos[i]));
      this.buscar = this.buscar.concat(this.cultivos[i].children);
    }

    this.saldo = 100;
    this.historial = ["-","-","-","-","-"];
    this.tipoCultivo = 0;
    this.stringCultivos = ["eliminar", "zanahoria", "trigo", "vaca", "gallina"];
    this.precioCultivos = [ 8, 5, 25, 20];
    this.tipoHerramienta = 0;
    this.stringHerramientas = [ "nada","regadera", "pala"];
    this.precioHerramientas = [15, 15];
    this.obtenidoHerramientas = [false, false];
    
    this.hbescena = new THREE.Box3().setFromObject(this);
  }
  
  initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }

  createCamera () {
    // Para crear una cámara le indicamos
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (0, 100, 100);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new OrbitControls (this.camera, this.renderer.domElement);
  }

  createGround () {
    var valla = new THREE.TextureLoader().load('../imgs/fence.jpeg');
    valla.wrapS = THREE.RepeatWrapping;
    valla.wrapT = THREE.RepeatWrapping;
    valla.repeat.set(20, 2);
    var matValla = new THREE.MeshPhongMaterial ({map: valla});
    var geomLado1 = new THREE.BoxGeometry (400,20,0.5);

    var valla1 = new THREE.Mesh(geomLado1, matValla);
    var valla2 = new THREE.Mesh(geomLado1, matValla);
    var valla3 = new THREE.Mesh(geomLado1, matValla);
    var valla4 = new THREE.Mesh(geomLado1, matValla);

    valla1.position.set(0, 10, 200);
    valla2.position.set(0,10,-200);
    valla3.position.set(200,10,0);
    valla3.rotation.set(0,Math.PI/2,0);
    valla4.position.set(-200,10,0);
    valla4.rotation.set(0,Math.PI/2,0);

    var geometryGround = new THREE.BoxGeometry (400,0.2,400);
    var texture = new THREE.TextureLoader().load('../imgs/skybox/ny.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});

    var ground = new THREE.Mesh (geometryGround, materialGround);
    var collisionBox = new THREE.Mesh (geometryGround, materialGround);
    collisionBox.scale.set(1,100,1);
    collisionBox.position.y = 50;
    collisionBox.visible = false;

    this.add(valla1);
    this.add(valla2);
    this.add(valla3);
    this.add(valla4);
    this.add (ground);
    this.add(collisionBox);
  }

  createSkybox () {
    var urls = 
    [
      '../imgs/skybox/px.png',
      '../imgs/skybox/nx.png',
      '../imgs/skybox/py.png',
      '../imgs/skybox/ny.png',
      '../imgs/skybox/pz.png',
      '../imgs/skybox/nz.png'
    ];

    var textureCube = new THREE. CubeTextureLoader( ).load(urls) ;
    this.background = textureCube;
  }
  
  createLights () {
    // Se crea una luz ambiental
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.6);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    this.spotLight = new THREE.SpotLight( 0xffffff, 0.5);//this.guiControls.lightIntensity );
    this.spotLight.position.set( 600, 600, 400 );
    this.add (this.spotLight);
  }
  
  setLightIntensity (valor) {
    this.spotLight.intensity = valor;
  }
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  setMessage(where, str){
    document.getElementById(where).innerHTML = str ;
  }

  update () {
    var dt = this.clock.getDelta();
    if (this.stats) this.stats.update();
  
    var newPosPlayer = this.player.getPosition();
    // Se actualiza el resto del modelo
    this.player.update(dt);
    this.hbplayer.setFromObject(this.player);
    for(var i=0 ; i<this.cultivos.length ; i++){
      this.cultivos[i].update(dt);
    }

    // Y calculando colisiones
    var colision = false;
    for(var i=0 ; i<this.cultivos.length && !colision; i++){
      colision = this.hbcultivos[i].intersectsBox(this.hbplayer)
    }
    this.player.colisiona(colision);
    var salirse = false;
    salirse = !this.hbescena.containsBox(this.hbplayer);
    if(salirse)
      this.player.limiteMapa();

    // Actualizamos mensajes
    if(this.historial.length>5)
      this.historial.splice(0, this.historial.length-5);
    var whr;
    for(var i=0; i<5 ; i++){
      var whr = "h"+(5-(i));
    this.setMessage(whr, this.historial[i]);
    }
    this.setMessage("Saldo", this.saldo.toFixed(2));

    // Actualizamos cámara
    this.cameraControl.object.position.set(
      0 + this.player.position.x,
      this.zoom + this.player.position.y,
      this.zoom + this.player.position.z
    );
    this.cameraControl.target.copy(this.player.position);
    this.cameraControl.update();
      
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());
    requestAnimationFrame(() => this.update())
  }

  // Rastreo de la pulsación de teclas
  onKeyDown(event){
    var dt = this.clock.getDelta();
    var x = event.which;
    if (String.fromCharCode (x) == "A"){
      this.player.guiControls.Izqd=true;
    }
    if (String.fromCharCode (x) == "W" ){
      this.player.guiControls.Arriba=true;
    }
    if (String.fromCharCode (x) == "S" ){
      this.player.guiControls.Abajo=true;
    }
    if (String.fromCharCode (x) == "D"){
      this.player.guiControls.Dcha=true;
    }
  
    if (String.fromCharCode (x) == "Q"){
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.remove("selectBorder");
      this.tipoCultivo = 0;
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.add("selectBorder");
    }
    if (String.fromCharCode (x) == "1"){
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.remove("selectBorder");
      this.tipoCultivo = 1;
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.add("selectBorder");
    }
    if (String.fromCharCode (x) == "2"){
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.remove("selectBorder");
      this.tipoCultivo = 2;
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.add("selectBorder");
    }
    if (String.fromCharCode (x) == "3" ){
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.remove("selectBorder");
      this.tipoCultivo = 3;
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.add("selectBorder");
    }
    if (String.fromCharCode (x) == "4" ){
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.remove("selectBorder");
      this.tipoCultivo = 4;
      document.getElementById(this.stringCultivos[this.tipoCultivo ]).classList.add("selectBorder");
    }
  
    if (String.fromCharCode (x) == "5"){
      if(this.obtenidoHerramientas[0]){
        if(this.tipoHerramienta == 1){
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.remove("selectBorder");
          this.tipoHerramienta = 0;
          this.player.quit();
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.add("selectBorder");
        }else{
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.remove("selectBorder");
          this.tipoHerramienta = 1;
          this.player.regadera();
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.add("selectBorder");
        }
      }else{
        if(this.saldo >= this.precioHerramientas[0]){
          this.saldo -= this.precioHerramientas[0];
          document.getElementById(this.stringHerramientas[1]).classList.remove("Oscuro");
          document.getElementById(this.stringHerramientas[1]+"Precio").innerHTML = "";
          this.obtenidoHerramientas[0] = true;
          this.historial.push("- ¡Compraste la regadera! Pulse 5 para equiparla");
        }else{
          this.historial.push("- Dinero insuficiente para comprar la regadera, te faltan "+(this.precioHerramientas[0]-this.saldo)+"$");
          this.player.animarNo();
        }
      }
    }
    if(String.fromCharCode (x) == "6"){
      if(this.obtenidoHerramientas[1]){
        if(this.tipoHerramienta == 2){
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.remove("selectBorder");
          this.tipoHerramienta = 0;
          this.player.quit();
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.add("selectBorder");
        }else{
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.remove("selectBorder");
          this.tipoHerramienta = 2;
          this.player.pala();
          document.getElementById(this.stringHerramientas[this.tipoHerramienta ]).classList.add("selectBorder");
        }
      }else{
        if(this.saldo >= this.precioHerramientas[1]){
          this.saldo -= this.precioHerramientas[1];
          document.getElementById(this.stringHerramientas[2]).classList.remove("Oscuro");
          document.getElementById(this.stringHerramientas[2]+"Precio").innerHTML = "";
          this.obtenidoHerramientas[1] = true;
          this.historial.push("- ¡Compraste la pala! Pulse 6 para equiparla");
        }else{
          this.historial.push("- Dinero insuficiente para comprar la pala, te faltan "+(this.precioHerramientas[1]-this.saldo)+"$");
          this.player.animarNo();
        }
      }
    }
    this.player.update(dt);
  };

  onKeyUp(event){
    var dt = this.clock.getDelta();
    var x = event.which;
    if (String.fromCharCode (x) == "M"){
      this.player.guiControls.posX-=0.1;
    }
    if (String.fromCharCode (x) == "A"){
      
      this.player.guiControls.Izqd=false;
    }
    if (String.fromCharCode (x) == "W" ){
      this.player.guiControls.Arriba=false;
    }
    if (String.fromCharCode (x) == "S" ){
      this.player.guiControls.Abajo=false;
    }
    if(String.fromCharCode (x) == "D"){
      this.player.guiControls.Dcha=false;
    }
    this.player.update(dt);
  }
  
  onDocumentMouseDown(event){
    // Se obtiene la posición del clic en coordenadas de dispositivo normalizado
    // La esquina inferior izquierda (-1,-1), superior derecha (1, 1)
    var mouse = new THREE.Vector2 ();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = 1 - 2 * (event.clientY / window.innerHeight);

    // Se construye un rayo que parte de la cámara (ojo del usuario) y pasa por la posición clic
    var raycaster = new THREE.Raycaster ();
    raycaster.setFromCamera(mouse, this.camera);
    // Busca los objetos que intersecan con el rayo. Costoso, busca los objetos de picableObjects.
    // Las referencias de los alcanzados se devuelven en otro array ordenados del cercano al lejano
    var buscar = [];
    var pickedObjects = raycaster.intersectObjects(this.buscar, true);
        
    if(pickedObjects.length > 0 ) {
      var seleccionado = pickedObjects[0].object.userData;
      if(seleccionado.activar(this.player.getPosition())){
        var retAccion = seleccionado.ponerElemento(this.tipoCultivo, this.saldo, this.tipoHerramienta );
        switch(retAccion){
          case "NADA":
          break;
          case "QUITADO":
            this.historial.push("- Se ha eliminado el contenido de la finca");
            this.player.animarAccion();
          break;
          case "NO_SALDO":
            this.historial.push("- No tienes suficiente saldo para colocar el item: "+this.stringCultivos[this.tipoCultivo-1]);
            this.player.animarNo();
            break;
          case "OCUPADO":
            this.historial.push("- Aún no se puede recoger los materiales de esta finca");
            this.player.animarNo();
            break;
          default:
            if(retAccion<0){
              this.historial.push("- Se ha colocado el item en la finca por valor de: "+-retAccion+"$");
              this.player.animarAccion();
            }
            else{
              this.historial.push("- Se han recogido y vendido los productos por "+retAccion+"$");
              this.player.animarAccion();
            }
            this.saldo += retAccion;
          break;
        }
      }
    }
  }
    mouseWheel(event){
      if( event.deltaY >= 0){
        this.zoom += 5;
      }else{
        this.zoom -= 5;
      }
      if(this.zoom > 300){
        this.zoom = 300;
      }else if(this.zoom < 120){
        this.zoom = 120;
      }
    }
  }  

  /// La función main
  $(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");
  
  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  window.addEventListener("keydown",(event)=>scene.onKeyDown(event));
  window.addEventListener("keyup",(event)=>scene.onKeyUp(event));
  window.addEventListener ("mousedown", (event) => scene.onDocumentMouseDown(event), true);
  window.addEventListener("mousewheel",(event)=>scene.mouseWheel(event));

  // Que no se nos olvide, la primera visualización.
  scene.update();
  });
  