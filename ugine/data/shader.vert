//varying vec3 fcolor;

attribute vec3 vpos;
attribute vec2 vTexture;
uniform mat4 mvpMatrix;

varying vec2 fTexture;

attribute vec3 vnormal;
uniform mat4 mvMatrix;
uniform mat4 normalMatrix;

varying vec3 fnormal;

void main() {
	gl_Position = mvpMatrix * vec4(vpos, 1);
	fnormal = normalMatrix * vec4(vnormal, 1);
	normalize(fnormal);
	
	fTexture = vTexture;
}