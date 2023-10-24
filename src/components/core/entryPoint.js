import * as THREE from "three";
import renderScene from "./renderer";
import controls from "./cameraOrbit";
import SpringArmComponent from "../springArm";
import camera from "./camera";
import scene from "./scene";
import gui from "../debug/debug";
import geo from "./../worldGen";

//Clock to measure elapsed time
const clock = new THREE.Clock();
const elapsedTime = clock.getElapsedTime;

//Create Player Mesh
const player = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.2, 0.4, 8, 32),
  new THREE.MeshBasicMaterial()
);
player.position.y = -0.1;
scene.add(player);

//Initializing the SpringArmComponent
const springArmComponent = new SpringArmComponent(player, camera);

// Define properties for the GUI and interaction
const properties = {
  springArmLength: 5,
  doCollision: true,
  rotate: false,
  innerWallSpeed: 0.001,
  outerWallSpeed: 0.005,
};
//Create a folder for Spring Arm settings in the GUI
const springArmProps = gui.addFolder("Spring Arm");

//Add controls for Spring Arm settings in the GUI
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

//Set the initial Spring Arm length
springArmComponent.SetSpringArmLength(properties.springArmLength);

//Add controls for world settings in the GUI
const worldSettings = gui.addFolder("World Settings");
worldSettings.add(properties, "rotate").name("Rotate Walls");
worldSettings
  .add(properties, "innerWallSpeed", 0.001, 0.01, 0.001)
  .name("Rotate Inner Walls");
worldSettings
  .add(properties, "outerWallSpeed", 0.001, 0.01, 0.001)
  .name("Rotate Outer Walls");

//Game loop
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
