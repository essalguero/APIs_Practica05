varying vec3 fnormal;
varying vec3 N;
varying vec4 vertexObserver;

varying vec2 fTexture;
uniform bool isTexturized;
uniform bool hasColor;
uniform sampler2D texSampler;
uniform vec4 color;

const int MAX_LIGHTS = 8;

uniform int numberLights;
uniform vec4 diffuse;
uniform int shininess;
uniform vec3 ambientLight;

struct LightInfo                                                           
{  
	vec4 lightColor;
	int linearAttenuation;

	vec4 position;
	vec3 rotation;
};
uniform LightInfo lights[MAX_LIGHTS];

float NdotL;
vec3 L;
float att;

vec4 calculateDiffuse(LightInfo light)
{
	L = light.position.xyz;
	float att = 1.0;

	if (light.position[3] == 1.0f)
	{
		L = L - vertexObserver;
		att = 1 / (1.0 + light.linearAttenuation * length(L));
	}

	normalize(L);

	NdotL = max(dot(N, L), 0.0f);

	vec4 color = diffuse * light.lightColor * att * NdotL;

	return color;
}

void main() {

	vec4 newColor;
	float specular = 0.0f;
	for (int i = 0; i < numberLights; ++i)
	{
		
		
		vec4 diffuseColor = calculateDiffuse(lights[i]);

		if (shininess > 0 && NdotL > 0.0f)
		{
			vec3 vertexPosition = vertexObserver.xyz;
			normalize(vertexPosition);
			vec3 H = L - vertexPosition;
			normalize(H);

			float NdotH = max(dot(N, H), 0.0f);

			specular += pow(NdotH, shininess) * att;
		}

		//newColor = newColor + ((diffuse * lights[i].lightColor * att * NdotL) + specular);
		newColor += diffuseColor + specular;
	}

	if (numberLights > 0)
	{
		//gl_FragColor = (newColor * diffuse * texture2D(texSampler, fTexture)) + ambientLight;
		if (isTexturized)
		{
			gl_FragColor = (newColor * diffuse * texture2D(texSampler, fTexture) * vec4(ambientLight, 0)) + specular;
		}
		else
		{
			gl_FragColor = (newColor * diffuse * vec4(ambientLight, 0)) + specular;
		}
	}
	else
	{
		if (isTexturized) {
			gl_FragColor = (texture2D(texSampler, fTexture) * diffuse);
		} 
		else if (hasColor)
		{
			gl_FragColor = color;
		}
		else {
			gl_FragColor = vec4(1, 1, 1, 1);
		}
	}

}
