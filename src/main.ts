import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {vec4, mat4} from 'gl-matrix';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentially
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;

let currentShader: ShaderProgram;
let lambert: ShaderProgram;
let cool: ShaderProgram;

let startTime: number;

function hexToRgb(hex: string) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

function changeColor(hex: string) {
  let rgb = hexToRgb(hex);
  rgb.r /= 255.0;
  rgb.g /= 255.0;
  rgb.b /= 255.0;
  lambert.changeColor(vec4.fromValues(rgb.r,rgb.g,rgb.b,1));
  cool.changeColor(vec4.fromValues(rgb.r,rgb.g,rgb.b,1));
}

function changeShaderProgram(program: string) {
  if (program == "Lambert") {
    currentShader = lambert;
  } else if (program == "Cool") {
    currentShader = cool;
  }
}

function loadScene() {
  //icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  //icosphere.create();
  // square = new Square(vec3.fromValues(0, 0, 0));
  // square.create();
   cube = new Cube(vec3.fromValues(0,0,0));
   cube.create();
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.add({'Shader': 'Cool'}, 'Shader', { 'Lambert': 'Lambert', 'Cool': 'Cool' }).onChange(changeShaderProgram);
  gui.addColor({'Lambert Color': "#1861b3" }, 'Lambert Color').onChange(changeColor);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  cool = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/cool-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/cool-frag.glsl')),
  ]);

  currentShader = cool;

  startTime = Date.now();

  // This function will be called every frame
  function tick() {
    currentShader.setTime(Date.now() - startTime);

    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, currentShader, [
      //icosphere,
      //square,
      cube
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
