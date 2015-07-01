function MarionetteDrawer() {
    var objects = {},
        animations = {},
        stopped = false,
        prevTime = Date.now(),
        clock = new THREE.Clock()
        _self = this;

    function morphColorsToFaceColors(geometry) {
        if (geometry.morphColors && geometry.morphColors.length) {
            var colorMap = geometry.morphColors[0];

            for (var i = 0; i < colorMap.colors.length; i++) {
                geometry.faces[i].color = colorMap.colors[i];
                geometry.faces[i].color.offsetHSL(0, 0.3, 0);
            }
        }
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

        _self.renderer.autoClear = false;
        _self.renderer.clear();

        _self.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        _self.renderer.render(_self.backgroundScene, _self.backgroundCamera);
        _self.renderer.render(_self.scene, _self.camera);
    }

    this.setup = function () {
        var scene = new THREE.Scene(),
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

        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0.5, 1);
        scene.add(directionalLight);

       var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

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

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
    };

    this.setBackground = function (img) {
        if (typeof img === 'undefined') {
            img = 'images/country.png';
        }

        var material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(img)
        });

        var geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
        var backgroundMesh = new THREE.Mesh(geometry, material);

        backgroundMesh.material.depthTest = false;
        backgroundMesh.material.depthWrite = false;

        var backgroundScene = new THREE.Scene();
        //backgroundCamera = new THREE.Camera();

        /*var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 0, 0.5, 1 );
        backgroundScene.add(directionalLight);*/

        var light1 = new THREE.DirectionalLight(0xefefff, 2);
        light1.position.set(1, 1, 1).normalize();
        backgroundScene.add(light1);

        var light2 = new THREE.DirectionalLight(0xffefef, 2);
        light2.position.set(-1, -1, -1).normalize();
        backgroundScene.add(light2);

        var backgroundCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        backgroundCamera.position.set(0, 300, 300);
        backgroundCamera.lookAt(new THREE.Vector3(0, 160, 0));
        // var backgroundCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        // backgroundCamera.position.set(0, 300, 500);
        // backgroundCamera.lookAt(new THREE.Vector3(0, 160, 0));

        backgroundScene.add(backgroundCamera);
        backgroundScene.add(backgroundMesh);

        this.backgroundCamera = backgroundCamera;
        this.backgroundScene = backgroundScene;
    };

    this.addCube = function (id) {
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
        _self.scene.add(cube);

        objects[id] = cube;
    };

    this.addHorse = function (id, x, y, z) {
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
            sound.load('sounds/horse.mp3');
            sound.setRefDistance(20);
            sound.autoplay = true;

            horse.add(sound);
            _self.scene.add(horse);

            objects[id] = horse;

            var animation = new THREE.MorphAnimation(horse);
            animation.play();
            animations[id] = animation;
        });
    };

    this.addFlamingo = function (id, x, y, z) {
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

            var sound = new THREE.Audio(listener);
            sound.load('sounds/flamingo.mp3');
            sound.setRefDistance(20);
            sound.autoplay = true;

            flamingo.add(sound);

            _self.scene.add(flamingo);

            objects[id] = flamingo;

            animations[id] = flamingo;
        });
    }

    this.removeObject = function (id) {
        if (id in objects) {
            var obj = objects[id];
            _self.scene.remove(obj);
        }
    };

    this.moveObject = function (id, x, y, z) {
        if (id in objects) {
            var obj = objects[id];
            obj.position.setX(x);
            obj.position.setY(y - obj.geometry.boundingSphere.radius);
            obj.position.setZ(z);
        }
    };

    this.rotateObject = function (id, angleX, angleY, angleZ) {
        if (id in objects) {
            var obj = objects[id];
            obj.rotation.x = angleX;
            obj.rotation.y = angleY;
            obj.rotation.z = angleZ;
        }
    };

    this.animate = function () {
        requestAnimationFrame(_self.animate);
        render();

        if (_self.stats) {
            _self.stats.update();
        }
    };

    this.setupStats = function () {
        var stats = new Stats();

        this.stats = stats;

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        //container.appendChild(stats.domElement);
        document.body.appendChild(stats.domElement);
    };

    this.stop = function () {
        stopped = true;
    };

    this.play = function () {
        stopped = false;
    };
}
