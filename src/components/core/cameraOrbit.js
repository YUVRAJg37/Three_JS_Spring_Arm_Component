import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import camera from "./camera";
import canvas from "./canvas";

const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.enableZoom = false;
controls.rotateSpeed = 0.5;

export default controls;
