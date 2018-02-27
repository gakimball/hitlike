const keys = {
  w: 'up',
  a: 'left',
  s: 'down',
  d: 'right',
};

export default function getDirection(key) {
  return keys[key];
}
