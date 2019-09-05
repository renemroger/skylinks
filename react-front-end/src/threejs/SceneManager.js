import * as THREE from "three";
import Earth from "./components/earth";
import StarsBackGround from "./components/stars";
import Clouds from "./components/clouds";
import FlightRoutes from "./components/flightRoutes";
import GeneralLights from "./GeneralLights";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default canvas => {
  const clock = new THREE.Clock();

  const screenDimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const mousePosition = {
    x: 0,
    y: 0
  };

  const scene = buildScene();
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const controls = buildControls(camera);
  const sceneSubjects = createSceneSubjects(scene);
  let sceneRoutes = createSceneRoute(scene);
  let remove = false;

  function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FFF");

    return scene;
  }

  function buildRender({ width, height }) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      powerPreference: "high-performance"
    });
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    return renderer;
  }

  function buildControls(camera) {
    var controls = new OrbitControls(camera);
    controls.minPolarAngle = 1.52;
    controls.maxPolarAngle = 1.52;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 0.5;
    controls.maxDistance = 50;
    controls.minDistance = 6;
    controls.enablePan = false;

    return controls;
  }

  function buildCamera({ width, height }) {
    const aspectRatio = width / height;
    const fieldOfView = 75;
    const nearPlane = 0.2;
    const farPlane = 10000;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.z = 10;

    return camera;
  }

  function toggleRemove() {
    console.log(`${remove} before`);
    remove = !remove;
    console.log(`${remove} after`);
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [
      new Earth(scene),
      new Clouds(scene),
      new GeneralLights(scene),
      new StarsBackGround(scene)
    ];
    return sceneSubjects;
  }

  function createSceneRoute(scene) {
    return [new FlightRoutes(scene)];
  }

  function addEntity() {
    console.log("New Flight Was added");
    sceneRoutes.push(createSceneRoute(scene));
  }

  function printScene() {
    console.log(scene);
  }

  function removeEntity() {
    console.log("New Flight Was removed");
    var selectedObject = scene.getObjectByName("routes");
    var children_to_remove = [];
    console.log(scene.getObjectByName("routes"));

    //add each line to be removed

    selectedObject &&
      selectedObject.traverse(line => {
        if (line.type === "Line") {
          console.log("removed");
          children_to_remove.push(line);
        }
      });
    //remove all children
    children_to_remove.forEach(function(child) {
      scene.remove(child);
      child.geometry.dispose();
      child.material.dispose();
    });

    sceneRoutes.length = 0;
    scene.remove(selectedObject);
  }

  function update() {
    const elapsedTime = clock.getElapsedTime();
    if (remove) {
      removeEntity();
      console.log("removing");
      toggleRemove();
    }
    for (let i = 0; i < sceneSubjects.length; i++) {
      sceneSubjects[i].update();
    }

    for (let i = 0; i < sceneRoutes.length; i++) {
      sceneRoutes[i].update();
    }

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  function onMouseDown(event) {
    event.preventDefault();

    // var mouse3D = new THREE.Vector3(
    //   sceneSubjects.reduce((acc, cur) => {
    //     if (cur.name === "EARTH") {
    //       return cur;FlightRoutes
    //     }
    //   })(event.clientX / window.innerWidth) *
    //     2 -
    //     1,
    //   -(event.clientY / window.innerHeight) * 2 + 1,
    //   0.5
    // );
    // var raycaster = new THREE.Raycaster();
    // raycaster.setFromCamera(mouse3D, camera);
    // var intersects = raycaster.intersectObjects([sceneSubjects[1]]);

    // if (intersects.length > 0) {
    //   intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    // }
  }

  function onMouseMove(x, y) {
    mousePosition.x = x;
    mousePosition.y = y;
  }

  return {
    update,
    onWindowResize,
    onMouseDown,
    removeEntity,
    addEntity,
    printScene,
    toggleRemove
  };
};
