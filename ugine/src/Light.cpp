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
	positionForShader = State::viewMatrix * positionForShader;
	int location = shader->getLocation(variableName.c_str());
	shader->setVec4(location, positionForShader);

	glm::vec4 rotationForShader;
	rotationForShader = glm::vec4(rotation, lightType);
	rotationForShader = State::viewMatrix * rotationForShader;
	variableName = "lights[" + indexString + "].rotation";
	location = shader->getLocation(variableName.c_str());
	shader->setVec4(location, rotationForShader);

	variableName = "lights[" + indexString + "].linearAttenuation";
	location = shader->getLocation(variableName.c_str());
	shader->setFloat(location, linearAttenuation);

	variableName = "lights[" + indexString + "].lightColor";
	location = shader->getLocation(variableName.c_str());
	shader->setVec4(location, glm::vec4(lightColor, 1.0f));
}
