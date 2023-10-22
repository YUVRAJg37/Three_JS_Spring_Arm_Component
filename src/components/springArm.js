import * as THREE from "three";
import camera from "./core/camera";
import controls from "./core/cameraOrbit";
import gui from "./debug/debug";

class SpringArmComponent {
  constructor(obj, cam) {
    this.SpringArmLength = 10;
    this.TargetPosition = new THREE.Vector3(0, 0, 0);
    this.cam = cam;
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

  SetSpringArmLength(newLen) {
    this.SpringArmLength = newLen;
    this.UpdateSpringArmPosition();
  }
}

export default SpringArmComponent;
