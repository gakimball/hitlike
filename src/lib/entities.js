import { Drawable, Living, Location, Solid, Playable, Item, Equippable, Inventory, Armable } from './components';
import componentPropertyName from '../util/component-property-name';

export default manager => (type, props = {}) => {
  const entity = manager.createEntity();

  type.forEach(component => {
    if (Array.isArray(component)) {
      const [comp, defaultProps] = component;

      entity.addComponent(comp);
      Object.assign(entity[componentPropertyName(comp)], defaultProps);
    } else {
      entity.addComponent(component);
    }
  });

  Object.assign(entity, props);

  return entity;
};

export const Player = [[Drawable, { character: '@' }], Solid, Location, Living, Playable, Inventory, Armable];

export const Wall = [[Drawable, { character: '#' }], Solid, Location];

export const Pistol = [[Drawable, { character: 'O' }], [Item, { name: 'Pistol' }], Equippable];

export const Enemy = [[Drawable, { character: 'E' }], Solid, Location, Living, Inventory];
