#version 300 es

//This is a vertex shader. While it is called a "shader" due to outdated conventions, this file
//is used to apply matrix transformations to the arrays of vertex data passed to it.
//Since this code is run on your GPU, each vertex is transformed simultaneously.
//If it were run on your CPU, each vertex would have to be processed in a FOR loop, one at a time.
//This simultaneous transformation allows your program to run much faster, especially when rendering
//geometry with millions of vertices.

uniform mat4 u_Model;       // The matrix that defines the transformation of the
                            // object we're rendering. In this assignment,
                            // this will be the result of traversing your scene graph.

uniform mat4 u_ModelInvTr;  // The inverse transpose of the model matrix.
                            // This allows us to transform the object's normals properly
                            // if the object has been non-uniformly scaled.

uniform mat4 u_ViewProj;    // The matrix that defines the camera's transformation.
                            // We've written a static matrix for you to use for HW2,
                            // but in HW3 you'll have to generate one yourself

uniform int u_Time;

uniform vec4 u_Color;

in vec4 vs_Pos;             // The array of vertex positions passed to the shader

in vec4 vs_Nor;             // The array of vertex normals passed to the shader

in vec4 vs_Col;             // The array of vertex colors passed to the shader.

out vec4 fs_Nor;            // The array of normals that has been transformed by u_ModelInvTr. This is implicitly passed to the fragment shader.
out vec4 fs_LightVec;       // The direction in which our virtual light lies, relative to each vertex. This is implicitly passed to the fragment shader.
out vec4 fs_Col;            // The color of each vertex. This is implicitly passed to the fragment shader.

const vec4 lightPos = vec4(5, 5, 3, 1); //The position of our virtual light, which is used to compute the shading of
                                        //the geometry in the fragment shader.

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

void main()
{
    mat3 invTranspose = mat3(u_ModelInvTr);
    fs_Nor = vec4(invTranspose * vec3(vs_Nor), 0);          // Pass the vertex normals to the fragment shader for interpolation.
                                                            // Transform the geometry's normals by the inverse transpose of the
                                                            // model matrix. This is necessary to ensure the normals remain
                                                            // perpendicular to the surface after the surface is transformed by
                                                            // the model matrix.


    vec4 new_Pos = vs_Pos;
    if(noise(vec2(u_Model * vs_Pos)) > 0.5) {
      new_Pos += vec4(sin(float(u_Time)/100.0) * 0.1,
                                                     cos(float(u_Time)/100.0) * 0.03,
                                                     sin(float(u_Time)/100.0) * 0.08,
                                                     cos(float(u_Time)/100.0) * 0.04)
                  + 0.05*vec4(cos(float(u_Time)/100.0), sin(float(u_Time)/100.0), 
                  cos(float(u_Time)/100.0), sin(float(u_Time)/100.0));
    } else {
      new_Pos += vec4(cos(float(u_Time)/100.0) * 0.1,
                                                      sin(float(u_Time)/100.0) * 0.03,
                                                      cos(float(u_Time)/100.0) * 0.08,
                                                      sin(float(u_Time)/100.0) * 0.04)
                  + 0.1*vec4(sin(float(u_Time)/100.0), cos(float(u_Time)/100.0), 
                  sin(float(u_Time)/100.0), cos(float(u_Time)/100.0));;
    }

    vec4 modelposition = u_Model * new_Pos;   // Temporarily store the transformed vertex positions for use below

    fs_LightVec = lightPos - modelposition;
    /*
    fs_LightVec = lightPos * vec4(clamp(sin(float(u_Time)/500.0), 0.25, 1.0), 
                                  clamp(sin(float(u_Time)/500.0), 0.25, 1.0), 
                                  clamp(sin(float(u_Time)/500.0), 0.25, 1.0), 
                                  clamp(sin(float(u_Time)/500.0), 0.25, 1.0))
                                   - modelposition;  // Compute the direction in which the light source lies
    */

    gl_Position = u_ViewProj * modelposition;

    fs_Col = u_Color + vec4(noise(vec2(modelposition) * sin(float(u_Time)/1000.0)) * 0.8*sin(float(u_Time)/1000.0), 
                            noise(vec2(modelposition) * sin(float(u_Time)/1000.0)) * 0.8*sin(float(u_Time)/1000.0), 
                            noise(vec2(modelposition) * sin(float(u_Time)/1000.0)) * 0.8*sin(float(u_Time)/1000.0), 0); 
}
