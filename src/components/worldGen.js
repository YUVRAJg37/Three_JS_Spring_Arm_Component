import * as THREE from "three";
import scene from "./core/scene";

//Array to store collision geometry
const collisionGeometry = [];

let cubeMat, floorMat, bulbLight, bulbMat;

//Materials
floorMat = new THREE.MeshStandardMaterial({
  roughness: 0.8,
  color: 0xffffff,
  metalness: 0.2,
  bumpScale: 0.0005,
});

cubeMat = new THREE.MeshStandardMaterial({
  roughness: 0.7,
  color: 0xffffff,
  bumpScale: 0.002,
  metalness: 0.2,
  side: THREE.DoubleSide,
});

//Textures
const textureLoader = new THREE.TextureLoader();
textureLoader.load("textures/wood/hardwood2_diffuse.jpg", function (map) {
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(10, 24);
  map.colorSpace = THREE.SRGBColorSpace;
  floorMat.map = map;
  floorMat.needsUpdate = true;
});
textureLoader.load("textures/wood/hardwood2_bump.jpg", function (map) {
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(10, 24);
  floorMat.bumpMap = map;
  floorMat.needsUpdate = true;
});
textureLoader.load("textures/wood/hardwood2_roughness.jpg", function (map) {
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(10, 24);
  floorMat.roughnessMap = map;
  floorMat.needsUpdate = true;
});

textureLoader.load("textures/brick/brick_diffuse.jpg", function (map) {
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(1, 1);
  map.colorSpace = THREE.SRGBColorSpace;
  cubeMat.map = map;
  cubeMat.needsUpdate = true;
});
textureLoader.load("textures/brick/brick_bump.jpg", function (map) {
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(1, 1);
  cubeMat.bumpMap = map;
  cubeMat.needsUpdate = true;
});

//-----------------Light Bulb------------------------------

const createLightBulb = (pos) => {
  const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
  bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
  bulbMat = new THREE.MeshStandardMaterial({
    emissive: 0xffffee,
    emissiveIntensity: 20,
    color: 0x000000,
  });
  bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
  bulbLight.position.set(pos.x, pos.y, pos.z);
  bulbLight.castShadow = true;

  return bulbLight;
};

scene.add(createLightBulb({ x: 0, y: 2, z: 0 }));

//-------------------------------------------------------------

/*----------------------------------------
------------------------------------------
----------------Floor---------------------
------------------------------------------
----------------------------------------*/
const floor = new THREE.Mesh(new THREE.BoxGeometry(30, 0.01, 30), floorMat);
floor.receiveShadow = true;
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
    cubeMat
  );
  box.castShadow = true;
  const x = 5 * Math.cos(angle);
  const z = 5 * Math.sin(angle);
  box.position.set(x, 1.2, z);

  boxGroup.add(box);
  collisionGeometry.push(box);

  scene.add(createLightBulb({ x: x, y: randomY + 0.2, z: z }));
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
    cubeMat
  );
  plane.castShadow = true;
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
    cubeMat
  );
  cubeMat.castShadow = true;
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
