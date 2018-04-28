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

	glm::mat4 mvpMatrix = State::projectionMatrix * State::viewMatrix * State::modelMatrix;

	shader->setMatrix(shader->getLocation("mvpMatrix"), mvpMatrix);
	
	// Set other variables
	int isTexturizedLoc = getShader()->getLocation("isTexturized");
	int textureLoc = getShader()->getLocation("texSampler");

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
}
