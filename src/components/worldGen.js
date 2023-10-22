import * as THREE from "three";
import scene from "./core/scene";

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 8, 8),
  new THREE.MeshBasicMaterial({
    color: "green",
  })
);
floor.position.y = -0.5;
floor.rotation.x = -Math.PI / 2;

scene.add(floor);
