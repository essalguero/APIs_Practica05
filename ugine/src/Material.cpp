#include "Material.h"
#include "State.h"

Material::Material(const std::shared_ptr<Texture>& tex, 
	const std::shared_ptr<Shader>& shader)
{
	materialTexture = tex;
	materialShader = shader;
}

const std::shared_ptr<Shader>& Material::getShader() const
{
	if (!materialShader)
		return State::defaultShader;

	return materialShader;
}

std::shared_ptr<Shader>& Material::getShader()
{
	if (!materialShader)
		return State::defaultShader;

	return materialShader;
}

void Material::setShader(const std::shared_ptr<Shader>& shader)
{
	materialShader = shader;
}

const std::shared_ptr<Texture>& Material::getTexture() const
{
	return materialTexture;
}

void Material::setTexture(const std::shared_ptr<Texture>& tex)
{
	materialTexture = tex;
}

void Material::prepare()
{ 
	std::shared_ptr<Shader> shader = getShader();

	shader->use();


	glm::mat4 mvMatrix = State::viewMatrix * State::modelMatrix;
	glm::mat4 mvpMatrix = State::projectionMatrix * mvMatrix;

	glm::mat4 normalsMatrix(mvMatrix);
	glm::transpose(glm::inverse(normalsMatrix));


	shader->setMatrix(shader->getLocation("mvMatrix"), mvMatrix);
	shader->setMatrix(shader->getLocation("normalsMatrix"), normalsMatrix);
	shader->setMatrix(shader->getLocation("mvpMatrix"), mvpMatrix);

	// Set other variables
	int isTexturizedLoc = getShader()->getLocation("isTexturized");
	int hasColorLoc = getShader()->getLocation("hasColor");
	int textureLoc = getShader()->getLocation("texSampler");
	int colorLoc = getShader()->getLocation("color");

	// Check if there is a texture to be used
	if (isTexturizedLoc != -1)
	{
		if (materialTexture)
		{
			
			shader->setInt(isTexturizedLoc, 1);

			shader->setInt(textureLoc, 0);

			materialTexture->bind();
		}
		else
		{
			shader->setInt(isTexturizedLoc, 0);
		}
	}

	// Check if there is a texture to be used
	if (hasColorLoc != -1)
	{
		if (!materialTexture)
		{

			shader->setInt(hasColorLoc, 1);
			shader->setVec4(colorLoc, materialColor);
		}
		else
		{
			shader->setInt(hasColorLoc, 0);
		}
	}

	/*
	uniform int numberLights;
uniform vec4 diffuse;
uniform int shininess;
uniform vec3 ambientLight;
uniform LightInfo lights[MAX_LIGHTS];
*/
	int variableLocation = shader->getLocation("numberLights");
	shader->setInt(variableLocation, State::lights.size());
	variableLocation = shader->getLocation("diffuse");
	shader->setVec4(variableLocation, materialColor);
	variableLocation = shader->getLocation("shininess");
	shader->setInt(variableLocation, materialShininess);
	variableLocation = shader->getLocation("ambientLight");
	shader->setVec3(variableLocation, State::ambient);

	/*shader->setInt(shader->getLocation("numberLights"), State::lights.size());
	shader->setVec4(shader->getLocation("diffuse"), materialColor);
	shader->setInt(shader->getLocation("shininess"), materialShininess);
	shader->setVec3(shader->getLocation("ambientLight"), State::ambient);*/

	for (int i = 0; i < State::lights.size(); ++i)
	{
		State::lights.at(i)->prepare(i, shader);
	}
}

const glm::vec4& Material::getColor() const
{
	return materialColor;
}

void Material::setColor(const glm::vec4& color)
{
	materialColor = color;
}

uint8_t Material::getShininess() const
{
	return materialShininess;
}

void Material::setShininess(uint8_t shininess)
{
	materialShininess = shininess;
}

