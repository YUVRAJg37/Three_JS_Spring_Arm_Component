import * as THREE from "three";
class SpringArmComponent {
  //Private Fields
  #rayCaster;
  #targetPosition;
  #boundingCameraSphere;

  constructor(obj, cam) {
    this.Target = obj;
    this.#targetPosition = new THREE.Vector3(
      this.Target.position.x,
      this.Target.position.y,
      this.Target.position.z
    );
    this.SpringArmLength = 4;
    this.Cam = cam;
    this.doCollisionTest = true;
    this.SpringArmDistance = this.#targetPosition.distanceTo(this.Cam.position);

    //Initializing Private Fields
    this.#rayCaster = new THREE.Raycaster();
    this.#boundingCameraSphere = new THREE.Sphere(this.Cam.position, 0.5);
  }

  //Calulate new camera position based on length
  #GetNewCamPosition(currentPosition, len) {
    const directionVector = new THREE.Vector3(
      currentPosition.x - this.Target.position.x,
      currentPosition.y - this.Target.position.y,
      currentPosition.z - this.Target.position.z
    );
    const normalizedDirection = directionVector;
    normalizedDirection.normalize();

    const newPos = new THREE.Vector3(
      this.Target.position.x + normalizedDirection.x * len,
      this.Target.position.y + normalizedDirection.y * len,
      this.Target.position.z + normalizedDirection.z * len
    );
    return newPos;
  }

  //Linearly Interpolating the camera position
  #CamLerpToPoint(point, lerp) {
    this.Cam.position.lerp(point, lerp);
  }

  //Set the camera back to its original position
  #SetToOriginalPoint(ler) {
    if (
      !this.#Comparator(
        this.Cam.position,
        this.#GetNewCamPosition(this.Cam.position, this.SpringArmLength),
        0.01
      )
    ) {
      this.#CamLerpToPoint(
        this.#GetNewCamPosition(this.Cam.position, this.SpringArmLength),
        ler
      );
    }
  }

  //Handle Collision with camer bounding box
  #HandleCameraBoundingBoxCollision(target) {
    const camPosition = new THREE.Vector3(
      this.Cam.position.x,
      this.Cam.position.y,
      this.Cam.position.z
    );
    camPosition.y -= 0.5;
    const directionVector = new THREE.Vector3(
      camPosition.x - this.Target.position.x,
      camPosition.y - this.Target.position.y,
      camPosition.z - this.Target.position.z
    );
    directionVector.normalize();
    this.#rayCaster.set(this.Target.position, directionVector);
    const intersects = this.#rayCaster.intersectObject(target);
    if (intersects.length > 0) {
      const point = new THREE.Vector3(
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z
      );
      point.y += 0.5;
      let distance = point.distanceTo(this.#targetPosition);
      const dis = this.Cam.position.distanceTo(intersects[0].point);
      if (dis > 4) {
        this.#CamLerpToPoint(this.#GetNewCamPosition(point, distance), 0.5);
      } else
        this.#CamLerpToPoint(this.#GetNewCamPosition(point, distance), 0.1);
    }
  }

  //Handle collision with raycasting
  #HandleRayCastCollision(target) {
    const directionVector = new THREE.Vector3(
      this.Cam.position.x - this.Target.position.x,
      this.Cam.position.y - this.Target.position.y,
      this.Cam.position.z - this.Target.position.z
    );
    directionVector.normalize();
    this.#rayCaster.set(this.Target.position, directionVector);
    const intersects = this.#rayCaster.intersectObjects(target);
    if (
      intersects.length > 0 &&
      intersects[0].distance <= this.SpringArmDistance
    ) {
      const point = new THREE.Vector3(
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z
      );
      let distance = point.distanceTo(this.#targetPosition);
      distance -= 0.2;
      this.#CamLerpToPoint(this.#GetNewCamPosition(point, distance), 0.9);
    } else {
      this.#SetToOriginalPoint(0.1);
    }
  }

  //Handle Collision based on context
  #HandleCollision(geo) {
    const collisionGeometry = geo.collisionGeometry;
    if (this.#boundingCameraSphere.intersectsBox(geo.boundingFloor)) {
      this.#HandleCameraBoundingBoxCollision(geo.floor);
    } else {
      this.#HandleRayCastCollision(collisionGeometry);
    }
  }

  //Update the camera and handle collision
  Update(geo) {
    if (this.Target == null) return;
    if (this.doCollisionTest) this.#HandleCollision(geo);
  }

  //Compare two vectors with a tolerance
  #Comparator(first, second, tolerance) {
    if (
      Math.abs(first.x - second.x) < tolerance &&
      Math.abs(first.y - second.y) < tolerance &&
      Math.abs(first.z - second.z) < tolerance
    )
      return true;
    return false;
  }

  //Set the spring arm length
  SetSpringArmLength(newLen) {
    this.SpringArmLength = newLen;
    this.Cam.position.copy(
      this.#GetNewCamPosition(this.Cam.position, this.SpringArmLength)
    );
    this.SpringArmDistance = this.#targetPosition.distanceTo(this.Cam.position);
  }
}

export default SpringArmComponent;
