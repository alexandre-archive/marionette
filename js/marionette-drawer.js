function MarionetteDrawer() {
    this.init = init;
    this.addCube = addCube;
    this.animate = animate;
    this.moveObject = moveObject;
    this.rotateObject = rotateObject;
    this.addHorse = addHorse;
    this.stop = stop;
    this.play = play;
    this.addFlamingo = addFlamingo;
    this.addScenario = addScenario;
    this.removeObject = removeObject;
    this.addSound = addSound;

    var container, scene, camera, renderer, stats, objects, animations, listener, backgroundScene, backgroundCamera;
    var SCREEN_WIDTH;
    var SCREEN_HEIGHT;
    var clock = new THREE.Clock();
    var prevTime = Date.now();
    var stopped = false;

    function init(containerElement) {
        objects = {};
        animations = {};
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        scene = new THREE.Scene();
        this.scene = scene;
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = 0;
        renderer.domElement.style.left = 0;
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';

        document.body.appendChild(renderer.domElement);

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 0, 0.5, 1 );
        scene.add(directionalLight);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        /*camera.position.fromArray([0, 100, 500]);
        camera.lookAt(new THREE.Vector3(0, 160, 0));*/

        camera.position.set(0, 300, 500);
        camera.lookAt(new THREE.Vector3(0, 160, 0));

        listener = new THREE.AudioListener();
        camera.add(listener);

        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.render(scene, camera);
        }, false);

        scene.add(camera);

        /*var light1 = new THREE.DirectionalLight(0xefefff, 2);
        light1.position.set(1, 1, 1).normalize();
        scene.add(light1);

        var light2 = new THREE.DirectionalLight(0xffefef, 2);
        light2.position.set(-1, -1, -1).normalize();
        scene.add(light2);*/

        renderer.render(scene, camera);

        initStats();
    }

    function removeObject(id) {
        if (id in objects) {
            var obj = objects[id];
            scene.remove(obj);
        }
    }

    function addCube(id) {
        // Create an array of materials to be used in a cube, one for each side
        var cubeMaterialArray = [];
        // order to add materials: x+,x-,y+,y-,z+,z-
        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
            color: 0xff3333
        }));
        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
            color: 0xff8800
        }));
        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
            color: 0xffff33
        }));
        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
            color: 0x33ff33
        }));
        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
            color: 0x3333ff
        }));
        cubeMaterialArray.push(new THREE.MeshBasicMaterial({
            color: 0x8833ff
        }));
        var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
        var cubeGeometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
        cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
        cube.position.set(0, 0, 0);
        scene.add(cube);

        objects[id] = cube;
    }

    function addScenario() {
        var material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/country.png')
        });

        var geometry = new THREE.PlaneBufferGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
        var backgroundMesh = new THREE.Mesh(geometry, material);

        backgroundMesh.material.depthTest = false;
        backgroundMesh.material.depthWrite = false;

        backgroundScene = new THREE.Scene();
        backgroundCamera = new THREE.Camera();

        /*var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 0, 0.5, 1 );
        backgroundScene.add(directionalLight);*/

        var light1 = new THREE.DirectionalLight(0xefefff, 2);
        light1.position.set(1, 1, 1).normalize();
        backgroundScene.add(light1);

        var light2 = new THREE.DirectionalLight(0xffefef, 2);
        light2.position.set(-1, -1, -1).normalize();
        backgroundScene.add(light2);

        backgroundCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        backgroundCamera.position.set(0, 300, 500);
        backgroundCamera.lookAt(new THREE.Vector3(0, 160, 0));

        backgroundScene.add(backgroundCamera);
        backgroundScene.add(backgroundMesh);
    }

    function addHorse(id, x, y, z) {
        var loader = new THREE.JSONLoader(true);
        loader.load("models/horse.json", function(geometry) {

            var horse = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                color: 0x606060,
                morphTargets: true
            }));

            horse.scale.set(0.8, 0.8, 0.8);

            if (x) {
                horse.position.setX(x);
            }

            if (y) {
                horse.position.setY(y);
            }

            if (z) {
                horse.position.setZ(z);
            }

            var sound = new THREE.Audio(listener);
            sound.load('sounds/HORSE.mp3');
            sound.setRefDistance(20);
            sound.autoplay = true;

            horse.add(sound);
            scene.add(horse);

            objects[id] = horse;

            var animation = new THREE.MorphAnimation(horse);
            animation.play();
            animations[id] = animation;
        });
    }


    function addFlamingo(id, x, y, z) {
        var loader = new THREE.JSONLoader();
        loader.load("models/flamingo.json ", function(geometry) {

            morphColorsToFaceColors(geometry);
            geometry.computeMorphNormals();

            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                morphTargets: true,
                morphNormals: true,
                vertexColors: THREE.FaceColors,
                shading: THREE.FlatShading
            });

            var flamingo = new THREE.MorphAnimMesh(geometry, material);

            flamingo.duration = 5000;
            flamingo.scale.set(1.0, 1.0, 1.0);

            if (x) {
                flamingo.position.setX(x);
            }

            if (y) {
                flamingo.position.setY(y);
            }

            if (z) {
                flamingo.position.setZ(z);
            }

            var rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationY(calculateRad(180));
            flamingo.applyMatrix(rotationMatrix);


            var sound = new THREE.Audio(listener);
            sound.load('sounds/BIRD5.mp3');
            sound.setRefDistance(20);
            sound.autoplay = true;

            flamingo.add(sound);
            scene.add(flamingo);

            objects[id] = flamingo;

            animations[id] = flamingo;
        });
    }

    function addSound(soundPath) {

        var sound = new THREE.Audio(listener);

        if (soundPath) {
            sound.load(soundPath);
        } else {
            sound.load('sounds/358232_j_s_song.ogg');
        }

        sound.setRefDistance(20);
        sound.autoplay = true;
        scene.add(sound);

    }

    function morphColorsToFaceColors(geometry) {
        if (geometry.morphColors && geometry.morphColors.length) {
            var colorMap = geometry.morphColors[0];

            for (var i = 0; i < colorMap.colors.length; i++) {
                geometry.faces[i].color = colorMap.colors[i];
                geometry.faces[i].color.offsetHSL(0, 0.3, 0);
            }
        }
    }

    function calculateRad(angle) {
        return angle * Math.PI / 180;
    }

    function moveObject(id, x, y, z) {
        if (id in objects) {
            var obj = objects[id];

            obj.position.setY(y);
            obj.position.setX(x);
            obj.position.setZ(z);

        }
    }

    function moveLeftHand(id, x, y, z) {
        if (id in objects) {
            var obj = objects[id];
            //TODO
        }
    }

    function moveRightHand(id, x, y, z) {
        if (id in objects) {
            var obj = objects[id];
            //TODO
        }
    }

    function moveLeftLeg(id, x, y, z) {
        if (id in objects) {
            var obj = objects[id];
            //TODO
        }
    }

    function moveRightLeg(id, x, y, z) {
        if (id in objects) {
            var obj = objects[id];
            //TODO
        }
    }

    function rotateObject(id, angleX, angleY, angleZ) {
        if (id in objects) {
            var obj = objects[id];
            obj.rotation.x = toRadian(angleX);
            obj.rotation.y = toRadian(angleY);
            obj.rotation.z = toRadian(angleZ);
        }
    }

    function toRadian(angle) {
        return angle;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {
        if (animations) {
            if (!stopped) {
                var time = Date.now();

                for (var obj in animations) {
                    if (animations[obj].update) {
                        animations[obj].update(time - prevTime);
                    } else {
                        animations[obj].updateAnimation(time - prevTime);
                    }
                }

                prevTime = time;
            }
        }

        renderer.autoClear = false;
        renderer.clear();

        renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.render(backgroundScene, backgroundCamera);
        renderer.render(scene, camera);
    }

    function initStats() {
        stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        //container.appendChild(stats.domElement);
        document.body.appendChild(stats.domElement);

        return stats;
    }

    function onWindowResize(event) {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        camera.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
    }

    function stop() {
        stopped = true;
    }

    function play() {
        stopped = false;
    }
}