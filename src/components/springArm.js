import * as THREE from "three";
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
    this.SpringArmLength = 4;
    this.Cam = cam;
    this.doCollisionTest = true;
    this.SpringArmDistance = this.#targetPosition.distanceTo(this.Cam.position);
    this.#rayCaster = new THREE.Raycaster();
  }

  GetNewCamPosition(currentPosition, len) {
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

  CamLerpToPoint(point) {
    this.Cam.position.lerp(point, 0.1);
  }

  SetToOriginalPoint() {
    if (
      !this.Comparator(
        this.Cam.position,
        this.GetNewCamPosition(this.Cam.position, this.SpringArmLength),
        0.01
      )
    ) {
      this.CamLerpToPoint(
        this.GetNewCamPosition(this.Cam.position, this.SpringArmLength)
      );
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
      const point = new THREE.Vector3(
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z
      );

      this.CamLerpToPoint(point);
    } else {
      this.SetToOriginalPoint();
    }
  }

  Update() {
    if (this.Target == null) return;
    if (this.doCollisionTest) this.CheckCollision();
  }

  SetSpringArmLength(newLen) {
    this.SpringArmLength = newLen;
    this.Cam.position.copy(
      this.GetNewCamPosition(this.Cam.position, this.SpringArmLength)
    );
    this.SpringArmDistance = this.#targetPosition.distanceTo(this.Cam.position);
  }
}

export default SpringArmComponent;
