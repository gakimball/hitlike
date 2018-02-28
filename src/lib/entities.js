import { Drawable, Living, Location, Solid, Playable, Item, Equippable, Inventory, Armable } from './components';
import componentPropertyName from '../util/component-property-name';

/**
 * Create an entity-creating function. Pick an entity type to create, and optionally pass default
 * attributes for the entity's components.
 */

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

/**
 * These functions take common sets of components and bundle them together.
 */

// Any living thing that moves around the world and interacts with the player.
const character = char => [[Drawable, { character: char }], Solid, Living, Location, Inventory];

// Any item that can be equipped
const item = (name, char = 'O', equippable = true) => [[Drawable, { character: char }], [Item, { name }]].concat(equippable ? [Equippable] : []);

/**
 * These are the entities themselves.
 */

export const Player = [...character('@'), Playable, Armable];

export const Wall = [[Drawable, { character: '#' }], Solid, Location];

export const Pistol = [...item('Pistol')];

export const Enemy = [...character('E')];
