import { Location, Solid, Playable, Item, Equippable, Armable } from './components';
import { standingOnItem } from './events';

// Move an entity one square in a direction
export function moveEntity(game, entity, direction) {
  let nextX = entity.location.x;
  let nextY = entity.location.y;

  switch (direction) {
    case 'up':
      nextY--;
      break;
    case 'down':
      nextY++;
      break;
    case 'left':
      nextX--;
      break;
    case 'right':
      nextX++;
      break;
    default:
  }

  placeEntity(game, entity, nextX, nextY);
}

// Place an entity in a specific location
export function placeEntity(game, entity, x, y) {
  const targets = game.getEntitiesAtLocation(x, y);
  const blockingEntities = entity.hasComponent(Solid)
    ? targets.filter(t => t.hasComponent(Solid))
    : targets.filter(t => !t.hasComponent(Solid));

  if (blockingEntities.length === 0) {
    if (!entity.hasComponent(Location)) {
      entity.addComponent(Location);
    }

    entity.location.x = x;
    entity.location.y = y;

    const item = targets.filter(t => t.hasComponent(Item))[0];

    if (entity.hasComponent(Playable) && item) {
      game.dispatchEvent(standingOnItem, item);
    }
  }
}

// Remove an entity from the physical world
export function removeFromWorld(game, entity) {
  entity.removeComponent(Location);
}

// Add an item to an entity's inventory
export function addToInventory(game, entity, item) {
  entity.inventory.add(item);
}

// Remove an item from an entity's inventory
export function removeFromInventory(game, entity, item) {
  entity.inventory.remove(item);
}

// Move an item from the world to an inventory
export function pickUpItem(game, entity) {
  const item = game
    .getEntitiesAtLocation(entity.location.x, entity.location.y)
    .filter(entity => entity.hasComponent(Item))[0];

  if (item) {
    removeFromWorld(game, item);
    addToInventory(game, entity, item);

    // Auto-equip items if user's hands are empty
    if (
      item.hasComponent(Equippable)
      && entity.hasComponent(Armable)
      && entity.armable.item === null
    ) {
      equipItem(game, entity, item);
    }
  }
}

// Equip an item from an entity's inventory
export function equipItem(game, entity, item) {
  if (entity.inventory.has(item) && entity.armable.item !== item) {
    entity.armable.item = item;
  }
}

// Equip an item from an entity's inventory, using the index of the item within the array
export function equipItemByIndex(game, entity, index) {
  const item = entity.inventory.contents[index];

  if (item) {
    equipItem(game, entity, item);
  }
}

// Unequip an entity's equipped item
export function unequipItem(game, entity) {
  entity.armable.item = null;
}

// Drop the currently-equipped item into the world
export function dropEquippedItem(game, entity) {
  const { item } = entity.armable;

  if (item) {
    dropItem(game, entity, item);
  }
}

// Drop an item into the world
export function dropItem(game, entity, item) {
  const { x, y } = entity.location;

  if (entity.hasComponent(Armable) && entity.armable.item === item) {
    unequipItem(game, entity);
  }

  removeFromInventory(game, entity, item);
  placeEntity(game, item, x, y);
}
