var engine;
var scene;
var camera;
var EARTH_ROTATION_MS = 10000.0;
var MOON_ROTATION_MS = EARTH_ROTATION_MS * 27.32;

window.onload = function() {

    if (BABYLON.Engine.isSupported()) {

        var canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;
        camera = new BABYLON.ArcRotateCamera("Camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.checkCollisions = true;
        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        camera.attachControl(canvas);

        var universe = new BABYLON.Mesh.CreateBox("universe", 1000, scene);
        universe.material = new BABYLON.StandardMaterial("", scene);
        universe.material.backFaceCulling = false;
        universe.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        universe.material.specularColor = new BABYLON.Color3(0, 0, 0);
        universe.material.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
        universe.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

//        var sun = new BABYLON.Mesh.CreateSphere("earth", 20, 3 * 109, scene);
        var sunlight = new BABYLON.PointLight('sun', new BABYLON.Vector3(0, 0, 190), scene);
//        sun.material = new BABYLON.StandardMaterial("", scene);
//        sun.material.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.3);
//        sun.position.x = 190;

        var earthframe = new BABYLON.Mesh("earthframe", scene);
        var earth = new BABYLON.Mesh.CreateSphere("earth", 40, 3, scene);
        earth.material = new BABYLON.StandardMaterial("default", scene);
        earth.material.diffuseTexture = new BABYLON.Texture("earth.jpg", scene);
        earth.material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        earth.checkCollisions = true;
        earth.parent = earthframe;
        earthframe.rotation.z = 0.408;  // axial tilt

        var moonframe = new BABYLON.Mesh('moonframe', scene);
        var moon = new BABYLON.Mesh.CreateSphere("moon", 20, 0.81, scene);
        moon.material = new BABYLON.StandardMaterial("default", scene);
        moon.material.diffuseTexture = new BABYLON.Texture("phobos.gif", scene);
        moon.material.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        moon.checkCollisions = true;
        moon.translate(new BABYLON.Vector3(1, 0, 0), 5);
        moon.parent = moonframe;

        var renderLoop = function() {
            scene.render();
        };

        scene.beforeRender = function() {
            now = new Date().getTime();
            revs = now % EARTH_ROTATION_MS;
            earth.rotation.y = (revs / EARTH_ROTATION_MS) * -(2 * Math.PI);
            moonframe.rotation.y = ((now % MOON_ROTATION_MS) / MOON_ROTATION_MS) * -(2 * Math.PI);
        };
        engine.runRenderLoop(renderLoop);

        window.addEventListener("resize", function() {
            engine.resize();
        });
    }
};
