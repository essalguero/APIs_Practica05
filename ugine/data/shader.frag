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
	float linearAttenuation;

	vec4 position;
	vec4 rotation;
};
uniform LightInfo lights[MAX_LIGHTS];

float NdotL;
vec3 L;
float att;

vec4 diffuseComponent;
vec4 specularComponent;


vec4 calculateDirectional(int i)
{
	vec4 calculated;
	diffuseComponent = vec4(ambientLight, 1.0);
	specularComponent = vec4(0, 0, 0, 1.0);

	vec3 normalizedN = normalize(N);

	vec3 L = -lights[i].rotation.xyz;
	//vec3 L = lights[i].position.xyz;

	L = normalize(L);
	NdotL = max(dot(normalizedN, L), 0.0);
	diffuseComponent += NdotL * lights[i].lightColor;

	if (shininess > 0 && NdotL > 0.0)
	{
		vec4 vertexObserverNorm = normalize(vertexObserver);
		vec3 H = L - vertexObserverNorm.xyz;
		H = normalize(H);
		
		float NdotH = max(dot(normalizedN, H), 0.0);
		specularComponent += pow(NdotH, float(shininess));

		/*calculated = vec4(shininess, shininess, shininess, 1.0);
		return calculated;*/

		

		//calculated = specularComponent;
		//return calculated;

	}
	//calculated = diffuseComponent;
	//calculated = specularComponent;
	calculated = diffuseComponent + specularComponent;

	return calculated;
}

vec4 calculatePoint(int i)
{
	vec4 calculated;
	diffuseComponent = vec4(ambientLight, 1.0);
	specularComponent = vec4(0.0, 0.0, 0.0, 1.0);

	vec3 normalizedN = normalize(N);

	vec3 L = lights[i].position.xyz;

	float attenuationFactor = 1.0;

	vec3 LLL = L - vertexObserver.xyz;
	attenuationFactor = 1.0 / (1.0 + (lights[i].linearAttenuation * length(LLL)));
	L = normalize(L);
	NdotL = max(dot(normalizedN, L), 0.0);

	diffuseComponent += NdotL * lights[i].lightColor * attenuationFactor;
	//return diffuseComponent;

	//shininess += 0;
	//return vec4(shininess / 255.0, shininess / 255.0, shininess / 255.0, 1.0);
	//return vec4(NdotL, NdotL, NdotL, 1.0);

	if ((shininess > 0) && (NdotL > 0.0))
	{
		vec4 vertexObserverNorm = normalize(vertexObserver);
		vec3 H = L - vertexObserverNorm.xyz;
		H = normalize(H);
		
		float NdotH = max(dot(normalizedN, H), 0.0);

		specularComponent += pow(NdotH, float(shininess)) * attenuationFactor;

		//calculated = specularComponent;
		//return calculated;
	}

	//return vec4(0.0, 1.0, 0.0, 1.0);
	//calculated = specularComponent;
	calculated = diffuseComponent + specularComponent;
	return calculated;
}


void main()
{
	if (numberLights > 0)
	{
		

		vec4 totalIlumination = vec4(0, 0, 0, 0);

		for (int i = 0; i < numberLights; ++i)
		{
			if (lights[i].position.w == 1.0)
				totalIlumination += calculatePoint(i);
			else
				totalIlumination += calculateDirectional(i);
		}

		if (hasColor)
		{
			if (isTexturized)
			{
				gl_FragColor = totalIlumination * color * texture2D(texSampler, fTexture);
				//gl_FragColor = vec4(ambientLight, 1.0f) * color;
			}
			else
			{
				gl_FragColor = totalIlumination * color;
				//gl_FragColor = vec4(ambientLight, 1.0f) * color;
			}
		}
	}
	else
	{
		if (isTexturized)
		{
			//vec4 tex = vec4(fTexture.x, fTexture.y, 0.0f, 0.0f);
			gl_FragColor = diffuse * texture2D(texSampler, fTexture);
		}
		else
		{
			gl_FragColor = color;
		}
	}
}

