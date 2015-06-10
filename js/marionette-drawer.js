function MarionetteDrawer(){

    this.init = init;
    this.addCube = addCube;
    this.animate = animate;
    this.moveObject = moveObject;
    this.rotateObject = rotateObject;


    var container, scene, camera, renderer, stats, objects;

    var SCREEN_WIDTH;
    var SCREEN_HEIGHT;

    var clock = new THREE.Clock();          


    function init(containerElement){

        container = containerElement;
        objects = {};

        /* CENA */
        scene = new THREE.Scene();

        /* CAMERA */
        
        SCREEN_WIDTH = window.innerWidth; 
        SCREEN_HEIGHT = window.innerHeight; 
        
        // atributos da câmera
        var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 1000;
        
        // setup camera
        camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        
        // adiciona a camera à cena
        scene.add(camera);
        camera.position.y = 100;
        camera.position.x = 300;
        camera.position.z = 300;
        camera.target = new THREE.Vector3( 0, 150, 0 );

        camera.lookAt(scene.position);  
        

        /* RENDERIZADOR */
        
        // cria e inicializa o renderizador.
        renderer = new THREE.WebGLRenderer( {antialias:true} );
        
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); 

        container.appendChild(renderer.domElement);  

        /* LUZ */

        var light = new THREE.PointLight(0xffffff);
        light.position.set(-100,100,100);
        scene.add(light);


        var light = new THREE.DirectionalLight( 0xffffff, 1.3 );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0xffffff, 0.1 );
        light.position.set( 0.25, -1, 0 );
        scene.add( light );

        initStats();

        window.addEventListener( 'resize', onWindowResize, false );

    }

    
    function addCube(id){
        // Create an array of materials to be used in a cube, one for each side
        var cubeMaterialArray = [];
        // order to add materials: x+,x-,y+,y-,z+,z-
        cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
        cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
        cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
        cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
        cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
        cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
        var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
        var cubeGeometry = new THREE.CubeGeometry( 100, 100, 100, 1, 1, 1 );
        cube = new THREE.Mesh( cubeGeometry, cubeMaterials );
        cube.position.set(0, 0, 0);
        scene.add( cube );   

        objects[id] = cube;   

    }


    function moveObject(id, x, y, z){

        if(id in objects){
           var obj = objects[id];


           obj.position.setX(x);
           obj.position.setY(y);
           obj.position.setZ(z);

        }
        
    }


    function rotateObject(id, angle){

        if(id in objects){
           var obj = objects[id];

            var rotationMatrixY = new THREE.Matrix4();
            rotationMatrixY.makeRotationY(calculateRad(angle));
            obj.applyMatrix(rotationMatrixY);
    
        }
        
    }

    function calculateRad(angle){
        return angle * Math.PI / 180;
    }


    function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

    }   

    function render() {

        // TODO

        renderer.clear();

        renderer.setViewport( 0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
        renderer.render( scene, camera );
    }



    function initStats() {

        stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        container.appendChild( stats.domElement );
        
        return stats;
    }

    function onWindowResize( event ) {

        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

        camera.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

    }

}