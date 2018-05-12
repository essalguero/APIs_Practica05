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

//vec4 diffuseComponent;
//vec4 specularComponent;

struct calculatedLight
{
	vec4 calculated;
	vec4 diffuseComponent;
	vec4 specularComponent;
};

/*vec4 calculateDirectional(int i)
{
	vec4 calculated;
	vec4 diffuseComponent = vec4(ambientLight, 1.0);
	vec4 specularComponent = vec4(0, 0, 0, 1.0);

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

	}
	//calculated = diffuseComponent;
	//calculated = specularComponent;
	calculated = diffuseComponent + specularComponent;

	return calculated;
}

vec4 calculatePoint(int i)
{
	vec4 calculated;
	vec4 diffuseComponent = vec4(ambientLight, 1.0);
	vec4 specularComponent = vec4(0.0, 0.0, 0.0, 1.0);

	calculatedLight currentLightInfo;

	vec3 normalizedN = normalize(N);

	vec3 L = lights[i].position.xyz;

	float attenuationFactor = 1.0;

	L = L - vertexObserver.xyz;
	attenuationFactor = 1.0 / (1.0 + (lights[i].linearAttenuation * length(L)));
	L = normalize(L);
	NdotL = max(dot(normalizedN, L), 0.0);

	diffuseComponent += NdotL * lights[i].lightColor * attenuationFactor;


	if ((shininess > 0) && (NdotL > 0.0))
	{
		vec4 vertexObserverNorm = normalize(vertexObserver);
		vec3 H = L - vertexObserverNorm.xyz;
		H = normalize(H);
		
		float NdotH = max(dot(normalizedN, H), 0.0);

		specularComponent += pow(NdotH, float(shininess)) * attenuationFactor;
	}

	calculated = diffuseComponent + specularComponent;
	return calculated;
}*/


calculatedLight calculateLight(int i)
{

	calculatedLight currentLight;

	vec4 calculated;
	vec4 diffuseComponent = vec4(ambientLight, 1.0);
	vec4 specularComponent = vec4(0.0, 0.0, 0.0, 1.0);

	vec3 normalizedN = normalize(N);

	vec3 L = lights[i].position.xyz;

	float attenuationFactor = 1.0;

	if (lights[i].position.w == 1.0)
	{
		L = L - vertexObserver.xyz;
		attenuationFactor = 1.0 / (1.0 + (lights[i].linearAttenuation * length(L)));
	} else {
		L = lights[i].rotation.xyz;
	}

	L = normalize(L);
	NdotL = max(dot(normalizedN, L), 0.0);

	diffuseComponent += NdotL * lights[i].lightColor * attenuationFactor;

	if ((shininess > 0) && (NdotL > 0.0))
	{
		vec4 vertexObserverNorm = normalize(vertexObserver);
		vec3 H = L - vertexObserverNorm.xyz;
		H = normalize(H);
		
		float NdotH = max(dot(normalizedN, H), 0.0);

		specularComponent += pow(NdotH, float(shininess)) * attenuationFactor;
	}


	calculated = diffuseComponent + specularComponent;

	currentLight.calculated = calculated;
	currentLight.diffuseComponent = diffuseComponent;
	currentLight.specularComponent = specularComponent;

	return currentLight;
}


void main()
{
	vec4 diffuseComponent = vec4(0, 0, 0, 1);
	vec4 specularComponent = vec4(0, 0, 0, 1);
	calculatedLight currentLight; 

	if (numberLights > 0)
	{
		

		vec4 totalIlumination = vec4(0, 0, 0, 0);

		

		for (int i = 0; i < numberLights; ++i)
		{
			/*if (lights[i].position.w == 1.0)
				totalIlumination += calculatePoint(i);
			else
				totalIlumination += calculateDirectional(i);*/

			//if (lights[i].position.w == 0.0)
			//{
				currentLight = calculateLight(i);
			
				specularComponent += currentLight.specularComponent;
				//totalIlumination += currentLight.calculated;
				diffuseComponent += currentLight.diffuseComponent;
			//}
		}

		if (hasColor)
		{
			if (isTexturized)
			{
				//gl_FragColor = totalIlumination * color * texture2D(texSampler, fTexture);
				gl_FragColor = (diffuseComponent * color * texture2D(texSampler, fTexture)) + specularComponent;
			}
			else
			{
				gl_FragColor = (diffuseComponent * color) + specularComponent;
				//gl_FragColor = diffuseComponent * color;
				//gl_FragColor = specularComponent;
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

