import rot from 'rot-js';
import { EntityManager } from 'tiny-ecs';
import times from 'lodash/times';
import { Drawable, Playable, Location, Solid } from './components';
import createEntityFactory, { Player, Wall, Pistol, Enemy, FireExtinguisher } from './entities';
import { moveEntity, placeEntity, pickUpItem, unequipItem, dropEquippedItem, equipItemByIndex, doCombat } from './actions';
import standingOnItem from '../util/standing-on-item';
import getDirection from '../util/get-direction';
import getEntityColor from '../util/get-entity-color';
import getDirectionalCoords from '../util/get-directional-coords';

export default class Game {
  constructor() {
    this.display = new rot.Display({
      width: 80,
      height: 27,
      fontSize: 16,
      bg: '#333',
      fg: '#fff',
    });
    this.entities = new EntityManager();
    this.map = new rot.Map.Arena(40, 20);
    this.createEntity = createEntityFactory(this.entities);
    this.logText = '';
    this.setup();
    this.tick();
  }

  setup() {
    this.map.create((x, y, wall) => {
      if (wall) {
        this.createEntity(Wall, {
          location: { x, y },
        });
      }
    });

    this.createEntity(Player, {
      location: {
        x: 10,
        y: 10,
      },
    });

    const pistol = this.createEntity(Pistol);
    this.runAction(placeEntity, pistol, 10, 12);

    const fireExtinguisher = this.createEntity(FireExtinguisher);
    this.runAction(placeEntity, fireExtinguisher, 10, 13);

    this.createEntity(Enemy, {
      location: {
        x: 12,
        y: 12,
      },
    });
  }

  getCanvas() {
    return this.display.getContainer();
  }

  handleKey = (e) => {
    const player = this.entities.queryComponents([Playable])[0];
    let handled = true;

    switch (e.key) {
      case 'ArrowUp':
        this.runAction(moveEntity, player, 'up');
        break;
      case 'ArrowDown':
        this.runAction(moveEntity, player, 'down');
        break;
      case 'ArrowLeft':
        this.runAction(moveEntity, player, 'left');
        break;
      case 'ArrowRight':
        this.runAction(moveEntity, player, 'right');
        break;
      case ' ':
        this.runAction(pickUpItem, player);
        break;
      case 'z':
        this.runAction(unequipItem, player);
        break;
      case 'x':
        this.runAction(dropEquippedItem, player);
        break;
      case 'w':
      case 'a':
      case 's':
      case 'd':
        this.runAction(doCombat, player, getDirection(e.key));
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.runAction(equipItemByIndex, player, parseInt(e.key, 10) - 1);
        break;
      default:
        handled = false;
    }

    if (handled) {
      this.log('');
      e.preventDefault();
    }
  }

  runAction(action, ...args) {
    action(this, ...args);
    this.tick();
  }

  dispatchEvent(event, ...args) {
    event(this, ...args);
  }

  log(text) {
    this.logText = text;
  }

  getEntitiesAtLocation(targetX, targetY) {
    const entities = this.entities.queryComponents([Location]);
    const found = [];

    for (const entity of entities) {
      const { x, y } = entity.location;

      if (targetX === x && targetY === y) {
        found.push(entity);
      }
    }

    return found;
  }

  findEntityAlongPath(origin, direction, range) {
    const newRange = range - 1;

    // If nothing has been found yet, we're out of range
    if (newRange < 0) {
      return null;
    }

    const coords = getDirectionalCoords(origin.x, origin.y, direction);
    const target = this
      .getEntitiesAtLocation(coords.x, coords.y)
      .filter(entity => entity.hasComponent(Solid))[0];

    // If we found a target, return it
    if (target) {
      return target;
    }

    // If we didn't find anything, move one more square in the same direction
    return this.findEntityAlongPath(coords, direction, newRange);
  }

  tick() {
    this.display.clear();

    // Draw empty space
    this.map.create((x, y, wall) => {
      if (!wall) {
        this.display.draw(x, y, '.', '#666');
      }
    });

    const deferredDrawables = [];
    const draw = entity => {
      const { x, y } = entity.location;
      const { character } = entity.drawable;

      this.display.draw(x, y, character, getEntityColor(entity));
    }

    // Draw drawable entities (floor)
    this.entities.queryComponents([Drawable, Location]).forEach(entity => {
      if (entity.hasComponent(Solid)) {
        deferredDrawables.push(entity);
      } else {
        draw(entity);
      }
    });

    // Draw drawable entities (solid)
    deferredDrawables.forEach(draw);

    this.drawInterface();
  }

  drawInterface() {
    const player = this.entities.queryComponents([Playable])[0];
    const logY = 22;
    const logWidth = 40;

    // Log
    times(logWidth, x => {
      const y = logY;
      const character = this.logText[x] || ' ';

      this.display.draw(x, y, character);
    });

    // Inventory
    const inventoryX = 42;
    const inventoryY = 1;

    this.display.drawText(inventoryX, inventoryY, 'Inventory:');
    player.inventory.contents.forEach((item, index) => {
      const x = inventoryX + 2;
      const y = inventoryY + 2 + index;
      const text = `${index + 1}. ${player.armable.item === item ? '[E] ' : ''}${item.item.name}${item.fireable ? ` (${item.fireable.ammo})` : ''}`;

      this.display.drawText(x, y, text);
    });

    // Controls
    const controls = [];

    if (player.armable.item !== null) {
      const name = player.armable.item.item.name;

      controls.push(['Z', `Unequip ${name}`], ['X', `Drop ${name}`]);
    } else if (player.inventory.contents.length > 0) {
      controls.push(['1–9', `Equip items`]);
    } else {
      const item = standingOnItem(this, player);

      if (item) {
        controls.push(['Space', `Pick up ${item.item.name}`])
      }
    }

    const controlY = 24;
    const controlText = controls.map(([char, action]) => `[${char}] ${action}`).join(' ')

    this.display.drawText(0, controlY, controlText);
  }
}
