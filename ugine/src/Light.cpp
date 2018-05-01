#include "Light.h"

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

	glm::vec4 positionForShader;
	if (lightType == Type::DIRECTIONAL)
		positionForShader = glm::vec4(position, 0.0f);
	else if (lightType == Type::POINT)
		positionForShader = glm::vec4(position, 1.0f);

	int location = shader->getLocation(variableName.c_str());
	shader->setVec4(location, positionForShader);

	variableName = "lights[" + indexString + "].rotation";
	location = shader->getLocation(variableName.c_str());
	shader->setVec3(location, rotation);

	variableName = "lights[" + indexString + "].linearAttenuation";
	location = shader->getLocation(variableName.c_str());
	shader->setInt(location, linearAttenuation);

	variableName = "lights[" + indexString + "].lightColor";
	location = shader->getLocation(variableName.c_str());
	shader->setVec3(location, lightColor);
}