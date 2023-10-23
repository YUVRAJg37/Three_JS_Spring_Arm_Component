import * as THREE from "three";
import renderScene from "./renderer";
import controls from "./cameraOrbit";
import SpringArmComponent from "../springArm";
import camera from "./camera";
import scene from "./scene";
import gui from "../debug/debug";
import obj from "./../worldGen";

const player = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.2, 0.4, 8, 32),
  new THREE.MeshBasicMaterial()
);
player.position.y = -0.1;
scene.add(player);

const springArmComponent = new SpringArmComponent(player, camera);
const properties = {
  springArmLength: 3,
};

gui
  .add(properties, "springArmLength", 1, 10, 0.01)
  .name("Spring Arm Length")
  .onChange((val) => {
    springArmComponent.SetSpringArmLength(val);
  });

const tick = () => {
  renderScene();
  controls.update();
  springArmComponent.CheckCollision(obj);
  window.requestAnimationFrame(tick);
};

tick();
