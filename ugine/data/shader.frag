varying vec3 fnormal;

varying vec2 fTexture;
uniform bool isTexturized;
uniform bool hasColor;
uniform sampler2D texSampler;
uniform vec4 color;

const int MAX_LIGHTS = 8;

struct LightInfo                                                           
{  
    int lightType;
	vec3 lightColor;
	float linearAttenuation;

	vec3 position;
	vec3 rotation;
	vec3 scale;
};

uniform LightInfo lights[MAX_LIGHTS];

uniform int numberLights;
uniform vec4 diffuse;
uniform int shininess;
uniform vec3 ambientLight;


void main() {
	if (isTexturized) {
		gl_FragColor = texture2D(texSampler, fTexture);
	} 
	else if (hasColor)
	{
		gl_FragColor = color;
	}
	else {
		gl_FragColor = vec4(1, 1, 1, 1);
	}

}
