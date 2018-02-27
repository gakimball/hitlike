export default function getDirectionalCoords(x, y, direction) {
  let nextX = x;
  let nextY = y;

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

  return {
    x: nextX,
    y: nextY,
  };
}
