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

  const target = game.getEntityAtLocation(nextX, nextY);

  if (!target) {
    entity.location.x = nextX;
    entity.location.y = nextY;
  }
}
