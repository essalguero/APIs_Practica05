//varying vec3 fcolor;

attribute vec3 vpos;
attribute vec2 vTexture;
uniform mat4 mvpMatrix;

varying vec2 fTexture;

void main() {
	gl_Position = mvpMatrix * vec4(vpos, 1);
	
	fTexture = vTexture;
}