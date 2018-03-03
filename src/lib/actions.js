import { Location, Solid, Playable, Item, Equippable, Armable, Living, Fireable, Damaging, Dead, Concussive, Throwable } from './components';
import { standingOnItem } from './events';
import getDirectionalCoords from '../util/get-directional-coords';

// Move an entity one square in a direction
export function moveEntity(game, entity, direction) {
  const { x, y } = getDirectionalCoords(entity.location.x, entity.location.y, direction);

  placeEntity(game, entity, x, y);
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
  if (
    entity.inventory.has(item)
    && item.hasComponent(Equippable)
    && entity.armable.item !== item
  ) {
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

// Peform a combat action in a cardinal direction, depending on what is equipped
export function doCombat(game, entity, direction) {
  const { item } = entity.armable;

  // Knock out move
  if (item === null) {
    const { x, y } = getDirectionalCoords(entity.location.x, entity.location.y, direction);
    const target = game.getEntitiesAtLocation(x, y).filter(e => e.hasComponent(Solid))[0];

    if (target) {
      knockOut(game, target);
    }
  } else if (item.hasComponent(Fireable)) {
    fireWeapon(game, entity, item, direction);
  } else if (item.hasComponent(Throwable)) {
    throwItem(game, entity, item, direction);
  }
}

// Knock out an entity
export function knockOut(game, entity) {
  if (entity.hasComponent(Living) && entity.living.awake) {
    entity.living.awake = false;
  }
}

// Fire a weapon in a direction
export function fireWeapon(game, entity, weapon, direction) {
  if (weapon.fireable.ammo === 0) {
    return;
  }

  const target = game.findEntityAlongPath(entity.location, direction, weapon.fireable.range);
  weapon.fireable.ammo--;

  if (target) {
    if (weapon.hasComponent(Damaging)) {
      damageEntity(game, target, weapon.damaging.damage);
    }
  }
}

export function throwItem(game, entity, item, direction) {
  const target = game.findEntityAlongPath(entity.location, direction, item.throwable.range);
  removeFromInventory(game, entity, item);

  if (target) {
    if (item.hasComponent(Damaging)) {
      damageEntity(game, target, item.damaging.damage);
    }

    if (item.hasComponent(Concussive)) {
      knockOut(game, target);
    }

    placeEntity(game, item, target.location.x, target.location.y);
  }
}

// Damage a living entity
export function damageEntity(game, entity, damage) {
  if (entity.hasComponent(Living) && !entity.hasComponent(Dead)) {
    entity.living.health -= damage;

    if (entity.living.health <= 0) {
      killEntity(game, entity);
    }
  }
}

// Kill a living entity
export function killEntity(game, entity) {
  entity.living.health = 0;
  entity.living.awake = false;
  entity.addComponent(Dead);
}
