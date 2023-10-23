import * as THREE from "three";
import camera from "./core/camera";
import controls from "./core/cameraOrbit";
import gui from "./debug/debug";

class SpringArmComponent {
  constructor(obj, cam) {
    this.SpringArmLength = 10;
    this.TargetPosition = new THREE.Vector3(
      obj.position.x,
      obj.position.y,
      obj.position.z
    );
    this.cam = cam;
    this.raycaster = new THREE.Raycaster();
    this.temp = new THREE.Vector3(0, 0, 0);
    controls.target = obj.position;
  }

  UpdateSpringArmPosition() {
    const currentPosition = this.cam.position;
    const directionVector = new THREE.Vector3(
      currentPosition.x - this.TargetPosition.x,
      currentPosition.y - this.TargetPosition.y,
      currentPosition.z - this.TargetPosition.z
    );

    const normalizedDirection = directionVector;
    normalizedDirection.normalize();

    const newPos = new THREE.Vector3(
      this.TargetPosition.x + normalizedDirection.x * this.SpringArmLength,
      this.TargetPosition.y + normalizedDirection.y * this.SpringArmLength,
      this.TargetPosition.z + normalizedDirection.z * this.SpringArmLength
    );
    this.cam.position.copy(newPos);
  }

  PerformLerp(coord) {
    const targetPosition = new THREE.Vector3(
      this.cam.position.x,
      this.cam.position.y,
      this.cam.position.z
    );
    targetPosition.lerp(coord, 0.1);
    this.cam.position.copy(targetPosition);
  }

  PerformRayIntersections(objects) {
    const rayOrigin = this.TargetPosition;
    const currentPosition = this.cam.position;
    const rayDirection = new THREE.Vector3(
      currentPosition.x - this.TargetPosition.x,
      currentPosition.y - this.TargetPosition.y,
      currentPosition.z - this.TargetPosition.z
    );
    rayDirection.normalize();
    this.raycaster.set(rayOrigin, rayDirection);
    return this.raycaster.intersectObjects(objects);
  }

  HandleSpringCollision(objects) {
    const intersections = this.PerformRayIntersections(objects);
    if (intersections.length > 0) {
      const closestIntersection = intersections[0];
      const closestContactPoint = closestIntersection.point;
      this.PerformLerp(closestContactPoint);
    }
  }

  SetSpringArmLength(newLen) {
    this.SpringArmLength = newLen;
    this.UpdateSpringArmPosition();
  }
}

export default SpringArmComponent;
