import { Item } from '../lib/components';

export default function standingOnItem(game, player) {
  const entities = game.getEntitiesAtLocation(player.location.x, player.location.y);

  for (const entity of entities) {
    if (entity.hasComponent(Item)) {
      return entity;
    }
  }

  return null;
}
