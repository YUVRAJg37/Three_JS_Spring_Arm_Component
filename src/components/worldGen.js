import * as THREE from "three";
import scene from "./core/scene";

const collisionGeometry = [];

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 8, 8),
  new THREE.MeshBasicMaterial({
    color: "green",
  })
);
floor.position.y = -0.5;
floor.rotation.x = -Math.PI / 2;

const box = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({
    color: "red",
  })
);
box.position.z = -2;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3, 8, 8),
  new THREE.MeshBasicMaterial({
    color: "red",
    side: THREE.DoubleSide,
  })
);
plane.position.x = -2;
plane.position.z = 2;
plane.rotation.z = Math.PI / 2;

scene.add(floor, box, plane);

collisionGeometry.push(floor);
collisionGeometry.push(box);
collisionGeometry.push(plane);

export default collisionGeometry;
