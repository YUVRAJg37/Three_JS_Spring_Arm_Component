import * as THREE from "three";
import scene from "./scene";
import viewport from "./viewport";

const camera = new THREE.PerspectiveCamera(
  50,
  viewport.width / viewport.height
);

camera.position.y = 5;
camera.position.x = 5;
camera.position.z = 1;
camera.updateProjectionMatrix();
scene.add(camera);

window.addEventListener("resize", () => {
  camera.aspect = viewport.width / viewport.height;
  camera.updateProjectionMatrix();
});

export default camera;
