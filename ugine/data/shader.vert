//varying vec3 fcolor;
varying vec3 N;
varying vec4 vertexObserver;

attribute vec3 vpos;
attribute vec2 vTexture;
uniform mat4 mvpMatrix;

varying vec2 fTexture;

attribute vec3 vnormal;
uniform mat4 mvMatrix;
uniform mat4 normalsMatrix;


void main() {
	gl_Position = mvpMatrix * vec4(vpos, 1);
	vec4 tempN = normalsMatrix * vec4(vnormal, 0);
	N = tempN.xyz;
	//N = normalize(N);

	vertexObserver = mvMatrix * vec4(vpos, 1);
	
	fTexture = vTexture;
}