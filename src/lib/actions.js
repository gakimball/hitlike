export default function moveEntity(entity, manager, direction) {
  let nextX = this.x;
  let nextY = this.y;

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

  const target = this.getSpace(nextX, nextY);

  if (target instanceof Entity) {
    if (this.player) {
      this.damage(target);
    }
  } else if (target === true) {
    this.x = nextX;
    this.y = nextY;
  }
}
