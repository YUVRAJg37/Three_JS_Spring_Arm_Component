import * as THREE from "three";
import camera from "./core/camera";
import controls from "./core/cameraOrbit";
import gui from "./debug/debug";

class SpringArmComponent {
  #rayCaster;
  #targetPosition;
  constructor(obj, cam) {
    this.Target = obj;
    this.#targetPosition = new THREE.Vector3(
      this.Target.position.x,
      this.Target.position.y,
      this.Target.position.z
    );
    this.SpringArmLength = 3;
    this.SocketOffset = new THREE.Vector3(0, 0, 0);
    this.WorldOffset = new THREE.Vector3(0, 0, 0);
    this.Cam = cam;
    this.doCollisionTest = true;
    this.SpringArmDistance = this.#targetPosition.distanceTo(cam.position);
    this.#rayCaster = new THREE.Raycaster();
  }

  GetNewCamPosition() {
    const currentPosition = this.Cam.position;
    const directionVector = new THREE.Vector3(
      currentPosition.x - this.Target.position.x,
      currentPosition.y - this.Target.position.y,
      currentPosition.z - this.Target.position.z
    );
    const normalizedDirection = directionVector;
    normalizedDirection.normalize();

    const newPos = new THREE.Vector3(
      this.Target.position.x + normalizedDirection.x * this.SpringArmLength,
      this.Target.position.y + normalizedDirection.y * this.SpringArmLength,
      this.Target.position.z + normalizedDirection.z * this.SpringArmLength
    );
    return newPos;
  }

  CamLerpToPoint(point) {
    this.Cam.position.lerp(point, 0.1);
  }

  SetToOriginalPoint() {
    if (!this.Comparator(this.Cam.position, this.GetNewCamPosition(), 0.01)) {
      this.CamLerpToPoint(this.GetNewCamPosition());
    }
  }

  Comparator(first, second, tolerance) {
    if (
      Math.abs(first.x - second.x) < tolerance &&
      Math.abs(first.y - second.y) < tolerance &&
      Math.abs(first.z - second.z) < tolerance
    )
      return true;
    return false;
  }

  CheckCollision(objects) {
    const directionVector = new THREE.Vector3(
      this.Cam.position.x - this.Target.position.x,
      this.Cam.position.y - this.Target.position.y,
      this.Cam.position.z - this.Target.position.z
    );
    directionVector.normalize();
    this.#rayCaster.set(this.Target.position, directionVector);
    const intersects = this.#rayCaster.intersectObjects(objects);
    if (
      intersects.length > 0 &&
      intersects[0].distance <= this.SpringArmDistance
    ) {
      this.CamLerpToPoint(intersects[0].point);
    } else {
      this.SetToOriginalPoint();
    }
  }

  Update() {
    if (this.Target == null) return;
    if (this.doCollisionTest) this.CheckCollision();

    this.Cam.position.lerp();
  }

  SetSpringArmLength(newLen) {
    this.SpringArmLength = newLen;
    this.Cam.position.copy(this.GetNewCamPosition());
  }
}

export default SpringArmComponent;
