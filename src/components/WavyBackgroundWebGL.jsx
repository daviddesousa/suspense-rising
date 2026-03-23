import { useEffect, useRef } from 'react';

const WavyBackgroundWebGL = ({ imageUrl }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Vertex shader
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        // Map vertex position [-1, 1] to UV [0, 1] with Y flipped (0 at top)
        vUv = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with improved noise and object-fit logic
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;

      // Simple 2D Noise
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        // Handle background-size: cover
        vec2 s = uResolution;
        vec2 i = uImageResolution;
        float rs = s.x / s.y;
        float ri = i.x / i.y;
        vec2 newUv = vUv;
        if (rs > ri) {
          newUv.y = (vUv.y - 0.5) * (ri / rs) + 0.5;
        } else {
          newUv.x = (vUv.x - 0.5) * (rs / ri) + 0.5;
        }

        // Apply wavy effect
        vec2 displacedUv = newUv;
        
        // Combine a few layers of noise for organic motion
        float n = noise(newUv * 3.5 + uTime * 0.15);
        float n2 = noise(newUv * 6.0 - uTime * 0.1);
        
        float dist = (n + n2 * 0.5) * 0.012;
        displacedUv.x += dist;
        displacedUv.y += dist;

        gl_FragColor = texture2D(uTexture, displacedUv);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const uTextureLocation = gl.getUniformLocation(program, 'uTexture');
    const uTimeLocation = gl.getUniformLocation(program, 'uTime');
    const uResolutionLocation = gl.getUniformLocation(program, 'uResolution');
    const uImageResolutionLocation = gl.getUniformLocation(
      program,
      'uImageResolution',
    );

    const texture = gl.createTexture();
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
    };

    let animationId;
    const render = (time) => {
      time *= 0.001; // Convert to seconds

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTextureLocation, 0);
      gl.uniform1f(uTimeLocation, time);
      gl.uniform2f(uResolutionLocation, width, height);
      gl.uniform2f(
        uImageResolutionLocation,
        image.width || 1,
        image.height || 1,
      );

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    };
  }, [imageUrl]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  );
};

export default WavyBackgroundWebGL;
