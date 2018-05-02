#include "Light.h"
#include "State.h"

#include <string>

Light::Type Light::getType() const
{
	return lightType;
}

void Light::setType(Light::Type type)
{
	lightType = type;
}

const glm::vec3& Light::getColor() const
{
	return lightColor;
}

void Light::setColor(const glm::vec3& color)
{
	lightColor = color;
}

float Light::getLinearAttenuation() const
{
	return linearAttenuation;
}

void Light::setLinearAttenuation(float att)
{
	linearAttenuation = att;
}

void Light::prepare(int index, std::shared_ptr<Shader>& shader) const
{

	/*location = shader->getLocation("numberLights");
	shader->setInt(location, 8);
	if (location != -1)
	std::cout << location << std::endl;
	*/

	std::string indexString = std::to_string(index);
	std::string variableName = "lights[" + indexString + "].position";

	// Pass the position in observer space
	glm::vec4 positionForShader;
	glm::mat4 mvMatrix = State::viewMatrix * State::modelMatrix;
	positionForShader = glm::vec4(1, 1, 1, lightType);
	positionForShader = glm::rotate(glm::translate(glm::mat4(), position), glm::angle(rotationQuat), glm::axis(rotationQuat)) * positionForShader;
	positionForShader = mvMatrix * positionForShader;
	int location = shader->getLocation(variableName.c_str());
	shader->setVec4(location, positionForShader);

	glm::vec4 rotationForShader;
	rotationForShader = glm::vec4(rotation, lightType);
	rotationForShader = mvMatrix * positionForShader;
	variableName = "lights[" + indexString + "].rotation";
	location = shader->getLocation(variableName.c_str());
	shader->setVec4(location, rotationForShader);

	variableName = "lights[" + indexString + "].linearAttenuation";
	location = shader->getLocation(variableName.c_str());
	shader->setInt(location, linearAttenuation);

	variableName = "lights[" + indexString + "].lightColor";
	location = shader->getLocation(variableName.c_str());
	shader->setVec4(location, glm::vec4(lightColor, 1.0f));
}



glm::vec4 Light::calculateDirectional(std::shared_ptr<Light> light, glm::vec4 diffuse, int shininess)
{
	glm::vec4 calculated;
	glm::vec4 diffuseComponent = glm::vec4(0.2f, 0.2f, 0.2f, 1.0f);
	glm::vec4 specularComponent = glm::vec4(0, 0, 0, 1.0f);

	glm::vec3 N;
	glm::vec3 intermL = glm::vec3(light->position);
	glm::vec3 L(intermL);
	
	L = glm::normalize(L);
	float NdotL = glm::dot<float>(N, L);
	NdotL = (NdotL > 0.0f) ? NdotL : 0.0f;

	diffuseComponent += NdotL * glm::vec4(light->lightColor, 1.0f);

	if (shininess > 0 && NdotL > 0.0f)
	{
		glm::vec3 vertexObserver = glm::vec3(0, 0, 0.2);
		//glm::vec4 temp = State::viewMatrix * State::modelMatrix * glm::vec4(vertexObserver, 1.0f);
		//vertexObserver = glm::vec3(temp.x, temp.y, temp.z);
		vertexObserver = glm::normalize(vertexObserver);
		glm::vec3 H = L - vertexObserver;
		H = normalize(H);

		float NdotH = (glm::dot<float>(N, H) > 0.0f ? glm::dot<float>(N, H) : 0.0f);

		specularComponent += pow(NdotH, shininess) * glm::vec4(1.0f, 1.0f, 1.0f, 0.0f);
	}

	calculated = diffuseComponent + specularComponent;

	return calculated;
}