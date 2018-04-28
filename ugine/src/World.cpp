#include "World.h"

#include <algorithm>


void World::addEntity(const std::shared_ptr<Entity>& entity)
{
	std::shared_ptr<Camera> camera = nullptr;

	if (entity == nullptr)
		return;

	// Search if the element is already stored
	std::vector<std::shared_ptr<Entity>>::iterator entityToAdd;

	// Search the element in the vector
	entityToAdd = std::find(entitiesVector.begin(), entitiesVector.end(), entity);

	// If the element was not found, store it
	if (entityToAdd == entitiesVector.end())
	{

		entitiesVector.push_back(entity);

		// Check if it is also a camera
		camera = std::dynamic_pointer_cast<Camera>(entity);
		if (camera != nullptr)
		{
			camerasVector.push_back(camera);
		}
	}
}


void World::removeEntity(const std::shared_ptr<Entity>& entity)
{
	if (entity == nullptr)
		return;

	// Iterator to keep the position to delete
	std::vector<std::shared_ptr<Entity>>::iterator entityToDelete;

	// Search the element in the vector
	entityToDelete = std::find(entitiesVector.begin(), entitiesVector.end(), entity);

	// Delete the element if it was found
	if (entityToDelete != entitiesVector.end())
	{
		entitiesVector.erase(entityToDelete);

		// If it is a Camera, also delete it from the camerasVector
		std::shared_ptr<Camera> camera = nullptr;

		camera = std::dynamic_pointer_cast<Camera>(entity);

		if (camera)
		{
			// Iterator to keep the position to delete
			std::vector<std::shared_ptr<Camera>>::iterator cameraToDelete;

			// Search the camera in the vector
			cameraToDelete = std::find(camerasVector.begin(), camerasVector.end(), entity);

			// Delete the element (If it is a camera, it must be also contained in the vector as it is in the entitiesVector)
			camerasVector.erase(cameraToDelete);
		}
	}
}


size_t World::getNumEntities() const
{
	return entitiesVector.size();
}


const std::shared_ptr<Entity>& World::getEntity(size_t index) const
{
	std::shared_ptr<Entity> entity = nullptr;

	if (entitiesVector.size() > index) {
		return entitiesVector.at(index);
	}

	return entity;
}


std::shared_ptr<Entity>& World::getEntity(size_t index)
{
	std::shared_ptr<Entity> entity = nullptr;

	if (entitiesVector.size() > index) {
		return entitiesVector.at(index);
	}

	return entity;
}


void World::update(float deltaTime)
{
	for(auto &entity : entitiesVector)
	{
		entity->update(deltaTime);
	}
}


void World::draw()
{
	for (auto &camera : camerasVector)
	{
		camera->prepare();

		for (auto &entity : entitiesVector)
		{
			entity->draw();
		}
	}
}