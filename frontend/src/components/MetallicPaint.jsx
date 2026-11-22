import React, { useRef, useEffect } from 'react';

const MetallicPaint = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl');

        if (!gl) return;

        const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Simple noise function
      float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float t = u_time * 0.5;
        
        // Metallic liquid distortion
        vec2 pos = st * 3.0;
        float n = noise(pos + t);
        
        vec2 flow = vec2(
            sin(pos.x * 2.0 + t + n),
            cos(pos.y * 3.0 + t * 1.5 + n)
        );
        
        // Color palette mimicking metallic iridescence
        // Silver, Blue, Purple
        vec3 color1 = vec3(0.9, 0.9, 0.95); // Silver
        vec3 color2 = vec3(0.1, 0.2, 0.8);  // Deep Blue
        vec3 color3 = vec3(0.6, 0.1, 0.8);  // Purple
        
        // Mix colors based on flow
        vec3 finalColor = mix(color1, color2, flow.x * 0.5 + 0.5);
        finalColor = mix(finalColor, color3, flow.y * 0.5 + 0.5);
        
        // Add specular highlight
        float specular = pow(max(0.0, dot(normalize(vec3(flow, 1.0)), vec3(0.0, 0.0, 1.0))), 8.0);
        finalColor += vec3(specular) * 0.5;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

        // Compile shaders
        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        // Set up buffers
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.useProgram(program);

        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const timeLocation = gl.getUniformLocation(program, 'u_time');

        let startTime = Date.now();

        const render = () => {
            if (!canvas) return;

            // Resize logic
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            }

            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };

        render();

        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ touchAction: 'none' }}
        />
    );
};

export default MetallicPaint;
