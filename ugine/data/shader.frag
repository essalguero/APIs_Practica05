//varying vec3 fnormal;
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
	vec4 rotation;
};
uniform LightInfo lights[MAX_LIGHTS];

float NdotL;
vec3 L;
float att;

vec4 diffuseComponent;
vec4 specularComponent;

/*vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
	vec3 lightDir = normalize(-light.direction);
	// diffuse shading
	float diff = max(dot(normal, lightDir), 0.0);
	// specular shading
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
	// combine results
	vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
	vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
	vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
	return (ambient + diffuse + specular);
}

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
	vec3 lightDir = normalize(light.position - fragPos);
	// diffuse shading
	float diff = max(dot(normal, lightDir), 0.0);
	// specular shading
	vec3 reflectDir = reflect(-lightDir, normal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
	// attenuation
	float distance = length(light.position - fragPos);
	float attenuation = 1.0 / (light.constant + light.linear * distance +
	light.quadratic * (distance * distance));
	// combine results
	vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
	vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
	vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;
	return (ambient + diffuse + specular);
}*/

vec4 calculateDirectional(int i)
{
	vec4 calculated;
	diffuseComponent = vec4(ambientLight, 1.0f);
	specularComponent = vec4(0, 0, 0, 1.0f);

	vec3 L = -lights[i].rotation.xyz;
	//vec3 L = lights[i].position.xyz;

	L = normalize(L);
	NdotL = max(dot(N, L), 0.0f);
	diffuseComponent += NdotL * lights[i].lightColor;

	if (shininess > 0 && NdotL > 0.0f)
	{
		vec4 vertexObserverNorm = normalize(vertexObserver);
		vec3 H = L - vertexObserverNorm;
		H = normalize(H);
		
		float NdotH = max(dot(N, H), 0.0f);
		specularComponent += pow(NdotH, shininess);
	}

	calculated = diffuseComponent + specularComponent;

	return calculated;
}

vec4 calculatePoint(int i)
{
	vec4 calculated;
	diffuseComponent = vec4(ambientLight, 1.0f);
	specularComponent = vec4(0.0f, 0.0f, 0.0f, 1.0f);

	vec3 L = lights[i].position.xyz;

	float attenuationFactor = 1.0f;

	L = L - vertexObserver.xyz;
	attenuationFactor = 1.0f / (1.0f + (lights[i].linearAttenuation * length(L)));
	L = normalize(L);
	NdotL = max(dot(N, L), 0.0f);

	diffuseComponent += NdotL * lights[i].lightColor * attenuationFactor;

	if (shininess > 0 && NdotL > 0.0f)
	{
		vec4 vertexObserverNorm = normalize(vertexObserver);
		vec3 H = L - vertexObserverNorm;
		H = normalize(H);
		
		float NdotH = max(dot(N, H), 0.0f);

		specularComponent += pow(NdotH, shininess) * attenuationFactor;
	}

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
			if (lights[i].position.w == 1)
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


/*void main()
{
	// properties
	vec3 norm = normalize(N);
	vec3 viewDir = normalize(viewPos - FragPos);
	
	vec3 result;

	for (int i = 0; i < numberLights; ++i)
	{
		// phase 1: Directional lighting
		if (lights[i].position.w == 0)
		{
			result += CalcDirLight(dirLight, norm, viewDir);
		}
		else
		{
			// phase 2: Point lights
			result += CalcPointLight(lights[i], norm, FragPos, viewDir);
		}
	}
	FragColor = vec4(result, 1.0);
}*/
