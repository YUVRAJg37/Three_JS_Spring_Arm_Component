import * as THREE from "three";
import scene from "./core/scene";

//Array to store collision geometry
const collisionGeometry = [];

/*----------------------------------------
------------------------------------------
----------------Floor---------------------
------------------------------------------
----------------------------------------*/
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(30, 0.01, 30),
  new THREE.MeshBasicMaterial({
    color: "green",
    side: THREE.DoubleSide,
  })
);
floor.position.y -= 0.5;

//Create a bounding box for the floor
const boundingFloor = new THREE.Box3();
boundingFloor.setFromObject(floor);

scene.add(floor);
collisionGeometry.push(floor);

//Random Number Generator between interval
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/*----------------------------------------
------------------------------------------
-----------------Box----------------------
------------------------------------------
----------------------------------------*/
const boxGroup = new THREE.Group();
for (let i = 0; i < 8; i++) {
  const randomX = randomIntFromInterval(1, 2);
  const randomY = randomIntFromInterval(1, 4);
  const randomZ = randomIntFromInterval(1, 2);
  const angle = (i / 8) * Math.PI * 2;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(randomX, randomY, randomZ),
    new THREE.MeshBasicMaterial({
      color: "blue",
    })
  );
  const x = 5 * Math.cos(angle);
  const z = 5 * Math.sin(angle);
  box.position.set(x, 1.2, z);

  boxGroup.add(box);
  collisionGeometry.push(box);
}

scene.add(boxGroup);

/*----------------------------------------
------------------------------------------
----------------Plane---------------------
------------------------------------------
----------------------------------------*/

const plane1Group = new THREE.Group();
const plane2Group = new THREE.Group();
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const random = randomIntFromInterval(1, 5);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, random, 8, 8),
    new THREE.MeshBasicMaterial({
      color: "red",
      side: THREE.DoubleSide,
      wireframe: true,
    })
  );

  const x = 3 * Math.cos(angle);
  const z = 3 * Math.sin(angle);
  const y = random;

  if ((i + 1) % 2 == 0) {
    plane.rotation.y = angle;
  } else {
    plane.rotation.y = angle + Math.PI / 2;
  }

  plane.position.set(x, y, z);
  collisionGeometry.push(plane);
  plane1Group.add(plane);
}

for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const random = randomIntFromInterval(1, 3);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(random, random, 8, 8),
    new THREE.MeshBasicMaterial({
      color: "red",
      side: THREE.DoubleSide,
      wireframe: true,
    })
  );

  const x = 7 * Math.cos(angle);
  const z = 7 * Math.sin(angle);
  const y = random;

  if ((i + 1) % 2 == 0) {
    plane.rotation.y = angle;
  } else {
    plane.rotation.y = angle + Math.PI / 2;
  }

  plane.position.set(x, y, z);
  collisionGeometry.push(plane);
  plane2Group.add(plane);
}

scene.add(plane1Group);
scene.add(plane2Group);

/*----------------------------------------
------------------------------------------
------------------------------------------
------------------------------------------
----------------------------------------*/

const Geometry = {
  collisionGeometry: collisionGeometry,
  boundingFloor: boundingFloor,
  floor: floor,
  boxGroup: boxGroup,
  plane1Group: plane1Group,
  plane2Group: plane2Group,
};
export default Geometry;
