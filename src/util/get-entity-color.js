import { Living } from '../lib/components';

export default function getEntityColor(entity) {
  if (entity.hasComponent(Living) && !entity.living.awake) {
    return '#666';
  }

  return '#fff';
}
