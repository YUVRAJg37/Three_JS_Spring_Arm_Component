import * as THREE from "three";
import scene from "./scene";
import camera from "./camera";
import viewport from "./viewport";
import canvas from "./canvas";

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(viewport.width, viewport.height);

window.addEventListener("resize", () => {
  renderer.setSize(viewport.width, viewport.height);
});

const renderScene = () => {
  renderer.render(scene, camera);
};

export default renderScene;
