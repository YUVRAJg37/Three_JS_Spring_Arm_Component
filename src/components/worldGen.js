import * as THREE from "three";
import scene from "./core/scene";

const collisionGeometry = [];
const boundingVolumeBoxes = [];

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(30, 0.01, 30),
  new THREE.MeshBasicMaterial({
    color: "green",
    side: THREE.DoubleSide,
  })
);
floor.position.y -= 0.5;

const boundingFloor = new THREE.Box3();
boundingFloor.setFromObject(floor);
boundingVolumeBoxes.push(boundingFloor);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({
    color: "red",
  })
);
box.position.z = -4;
box.position.x = 1;

const boundingBox = new THREE.Box3();
boundingBox.setFromObject(box);

const plane = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 0.01),
  new THREE.MeshBasicMaterial({
    color: "red",
    side: THREE.DoubleSide,
  })
);

plane.position.x = -2;
plane.position.z = 2;

const boundingPlane = new THREE.Box3();
boundingPlane.setFromObject(plane);

scene.add(floor, box, plane);

collisionGeometry.push(box);
collisionGeometry.push(plane);
collisionGeometry.push(floor);

const Geometry = {
  collisionGeometry: collisionGeometry,
  boundingVolumeBoxes: boundingVolumeBoxes,
  floor: floor,
};
export default Geometry;
