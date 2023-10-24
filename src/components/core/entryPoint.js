import * as THREE from "three";
import renderScene from "./renderer";
import controls from "./cameraOrbit";
import SpringArmComponent from "../springArm";
import camera from "./camera";
import scene from "./scene";
import gui from "../debug/debug";
import geo from "./../worldGen";

const clock = new THREE.Clock();
const elapsedTime = clock.getElapsedTime;

const player = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.2, 0.4, 8, 32),
  new THREE.MeshBasicMaterial()
);
player.position.y = -0.1;
scene.add(player);
const springArmComponent = new SpringArmComponent(player, camera);
const properties = {
  springArmLength: 15,
  doCollision: true,
  rotate: false,
  innerWallSpeed: 0.001,
  outerWallSpeed: 0.005,
};

const springArmProps = gui.addFolder("Spring Arm");
springArmProps
  .add(properties, "springArmLength", 1, 15, 0.01)
  .name("Spring Arm Length")
  .onChange((val) => {
    springArmComponent.SetSpringArmLength(val);
  });

springArmProps
  .add(properties, "doCollision")
  .name("Perform Collision Test")
  .onChange((val) => {
    springArmComponent.doCollisionTest = val;
  });

springArmComponent.SetSpringArmLength(properties.springArmLength);

const worldSettings = gui.addFolder("World Settings");
worldSettings.add(properties, "rotate").name("Rotate Walls");
worldSettings
  .add(properties, "innerWallSpeed", 0.001, 0.01, 0.001)
  .name("Rotate Walls");
worldSettings
  .add(properties, "outerWallSpeed", 0.001, 0.01, 0.001)
  .name("Rotate Walls");

const tick = () => {
  renderScene();
  controls.update();

  if (properties.rotate) {
    geo.plane1Group.rotation.y -= properties.innerWallSpeed;
    geo.boxGroup.rotation.y += properties.outerWallSpeed;
  }
  springArmComponent.Update(geo);
  window.requestAnimationFrame(tick);
};

tick();
