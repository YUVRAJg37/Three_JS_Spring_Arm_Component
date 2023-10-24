import * as THREE from "three";
import scene from "./core/scene";
import { Plane } from "cannon-es";

const collisionGeometry = [];

//-------------Floor---------------------
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

scene.add(floor);
collisionGeometry.push(floor);

//--------------------------------------------

//-----------------Box--------------------------
const boxGroup = new THREE.Group();
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 1),
    new THREE.MeshBasicMaterial({
      color: "blue",
    })
  );
  const x = 5 * Math.cos(angle);
  const z = 5 * Math.sin(angle);
  box.position.set(x, 1, z);

  boxGroup.add(box);
  collisionGeometry.push(box);
}

scene.add(boxGroup);

//----------------------------------------------
//-----------------Plane------------------------

const plane1Group = new THREE.Group();
const plane2Group = new THREE.Group();
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 3, 8, 8),
    new THREE.MeshBasicMaterial({
      color: "red",
      side: THREE.DoubleSide,
      wireframe: true,
    })
  );

  const x = 3 * Math.cos(angle);
  const z = 3 * Math.sin(angle);

  if ((i + 1) % 2 == 0) {
    plane.rotation.y = angle;
  } else {
    plane.rotation.y = angle + Math.PI / 2;
  }

  plane.position.set(x, 1, z);
  collisionGeometry.push(plane);
  plane1Group.add(plane);
}

for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3, 8, 8),
    new THREE.MeshBasicMaterial({
      color: "red",
      side: THREE.DoubleSide,
      wireframe: true,
    })
  );

  const x = 7 * Math.cos(angle);
  const z = 7 * Math.sin(angle);

  if ((i + 1) % 2 == 0) {
    plane.rotation.y = angle;
  } else {
    plane.rotation.y = angle + Math.PI / 2;
  }

  plane.position.set(x, 1, z);
  collisionGeometry.push(plane);
  plane2Group.add(plane);
}

scene.add(plane1Group);
scene.add(plane2Group);

//----------------------------------------------

const Geometry = {
  collisionGeometry: collisionGeometry,
  boundingFloor: boundingFloor,
  floor: floor,
  boxGroup: boxGroup,
  plane1Group: plane1Group,
  plane2Group: plane2Group,
};
export default Geometry;
