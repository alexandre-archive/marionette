function MarionetteDrawer(){

    this.init = init;
    this.addCube = addCube;
    this.animate = animate;
    this.moveObject = moveObject;
    this.rotateObjectY = rotateObjectY;
    this.rotateObjectX = rotateObjectX;
    this.addHorse = addHorse;    
    this.stop = stop;
    this.play = play;
    this.addFlamingo = addFlamingo;
    this.addCenario = addCenario;
    this.removeObject = removeObject;

    var container, scene, camera, renderer, stats, objects, animations;

    var SCREEN_WIDTH;
    var SCREEN_HEIGHT;

    var clock = new THREE.Clock();     

    var prevTime = Date.now();     

    var stopped = false;


    function init(containerElement){

        container = containerElement;
        objects = {};
        animations = {};

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
        camera.position.y = 0;
        camera.position.x = 0;
        camera.position.z = 400;
        camera.target = new THREE.Vector3( 0, 150, 0 );

        camera.lookAt(scene.position);  
        

        /* RENDERIZADOR */
        
        // cria e inicializa o renderizador.
        renderer = new THREE.WebGLRenderer( {antialias:true} );
        renderer.setClearColor( 0xf0f0f0 );
        renderer.setPixelRatio( window.devicePixelRatio );        
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); 

        container.appendChild(renderer.domElement);  

        /* LUZ */
        var light = new THREE.DirectionalLight( 0xefefff, 2 );
        light.position.set( 1, 1, 1 ).normalize();
        scene.add( light );

        var light = new THREE.DirectionalLight( 0xffefef, 2 );
        light.position.set( -1, -1, -1 ).normalize();
        scene.add( light );

        initStats();

        window.addEventListener( 'resize', onWindowResize, false );

    }

     function removeObject(id){

        if(id in objects){
           var obj = objects[id];
           scene.remove(obj);

        }

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

     function addCenario(){


            // FLOOR
        /*var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);*/
        // SKYBOX/FOG
        /*var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
        var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
        var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
        scene.add(skyBox);
        scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
        */

        var floorMaterial = new THREE.MeshBasicMaterial( { color: 0x99D9EA, side: THREE.DoubleSide } );
        
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        //floor.position.y = -0.5;
        //floor.rotation.x = Math.PI / 2;
        scene.add(floor);
        // SKYBOX/FOG

    }

    function addHorse(id){

        var loader = new THREE.JSONLoader( true );
        loader.load( "models/horse.js", function( geometry ) {

            var horse = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } ) );
            horse.scale.set( 1.0, 1.0, 1.0 );
            scene.add( horse );

            objects[id] = horse;

            var animation = new THREE.MorphAnimation( horse );
            animation.play();
            animations[id] = animation;


        } );
    }


    function addFlamingo(id){

        var loader = new THREE.JSONLoader();
        loader.load( "models/flamingo.js", function( geometry ) {

            morphColorsToFaceColors( geometry );
            geometry.computeMorphNormals();

            var material = new THREE.MeshLambertMaterial( { color: 0xffffff, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
            var meshAnim = new THREE.MorphAnimMesh( geometry, material );

            meshAnim.duration = 5000;

            meshAnim.scale.set( 1.5, 1.5, 1.5 );
            meshAnim.position.y = 150;

            scene.add( meshAnim );
            objects[id] = meshAnim;
            animations[id] = meshAnim;

        } );

    }

    function morphColorsToFaceColors( geometry ) {

        if ( geometry.morphColors && geometry.morphColors.length ) {

            var colorMap = geometry.morphColors[ 0 ];

            for ( var i = 0; i < colorMap.colors.length; i ++ ) {

                geometry.faces[ i ].color = colorMap.colors[ i ];
                geometry.faces[ i ].color.offsetHSL( 0, 0.3, 0 );

            }

        }

    }


    function moveObject(id, x, y, z){

        if(id in objects){
           var obj = objects[id];


           obj.position.setX(x);
           obj.position.setY(y);
           obj.position.setZ(z);

        }
        
    }

     function moveLeftHand(id, x, y, z){

        if(id in objects){
           var obj = objects[id];

           //TODO

        }
        
    }

    function moveRightHand(id, x, y, z){

        if(id in objects){
           var obj = objects[id];

           //TODO

        }
        
    }

    function moveLeftLeg(id, x, y, z){

        if(id in objects){
           var obj = objects[id];

           //TODO

        }
        
    }

    function moveRightLeg(id, x, y, z){

        if(id in objects){
           var obj = objects[id];

           //TODO

        }
        
    }



    function rotateObjectX(id, angle){

        if(id in objects){
           var obj = objects[id];

            var rotationMatrixX = new THREE.Matrix4();
            rotationMatrixX.makeRotationX(calculateRad(angle));
            obj.applyMatrix(rotationMatrixX);
    
        }
        
    }


    function rotateObjectY(id, angle){

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

        if ( animations ) {

            if(!stopped){
                var time = Date.now();

                for (obj in animations) {

                    if(animations[obj].update){
     
                        animations[obj].update( time - prevTime );

                    }else{
                        animations[obj].updateAnimation(time - prevTime);

                    }
                        
                 };

                
                prevTime = time;
            }
        }   

        renderer.clear();

        renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
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


    function stop(){

        stopped = true;

    }

    function play(){

        stopped = false;
    }

}