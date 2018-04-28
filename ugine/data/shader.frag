
varying vec2 fTexture;
uniform bool isTexturized;
uniform sampler2D texSampler;

void main() {
	if (!isTexturized) {
		gl_FragColor = vec4(1, 1, 1, 1);
	} else {
		gl_FragColor = texture2D(texSampler, fTexture);
	}

}
