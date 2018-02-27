import { Location, Solid, Playable, Item } from './components';
import { standingOnItem } from './events';

// Move an entity
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

export function placeEntity(game, entity, x, y) {
  const targets = game.getEntitiesAtLocation(x, y);
  const blockingEntities = targets.filter(t => t.hasComponent(Solid));

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
