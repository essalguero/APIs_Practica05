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

	std::string indexString = std::to_string(index);
	std::string variableName = "lights[" + indexString + "]";

	int location = shader->getLocation(variableName.c_str());

	

	if (location != -1)
		std::cout << location << std::endl;
}