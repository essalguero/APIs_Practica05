#pragma once

#include "common.h"
#include "Entity.h"
#include "Shader.h"

class Light : Entity
{
	enum Type {DIRECTIONAL = 0, POINT};
public:
	Type			getType() const;
	void			setType(Type type);
	const glm::vec3& getColor() const;
	void			setColor(const glm::vec3& color);
	float			getLinearAttenuation() const;
	void			setLinearAttenuation(float att);
	void			prepare(int index, std::shared_ptr<Shader>& shader) const;

private:
	Type lightType;
	glm::vec3 lightColor;
	float linearAttenuation;

};