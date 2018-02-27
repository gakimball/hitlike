import rot from 'rot-js';
import { EntityManager } from 'tiny-ecs';
import times from 'lodash/times';
import { Drawable, Playable, Location } from './components';
import createEntityFactory, { Player, Wall, Pistol } from './entities';
import { moveEntity, placeEntity } from './actions';

export default class Game {
  constructor() {
    this.display = new rot.Display({
      width: 48,
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
    this.runAction(placeEntity, pistol, 15, 15);
  }

  getCanvas() {
    return this.display.getContainer();
  }

  handleKey = (e) => {
    const player = this.entities.queryComponents([Playable])[0];
    e.preventDefault();

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
      default:
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
    this.drawInterface();
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

  tick() {
    // Draw empty space
    this.map.create((x, y, wall) => {
      if (!wall) {
        this.display.draw(x, y, '.', '#666');
      }
    });

    // Draw drawable entities
    this.entities.queryComponents([Drawable, Location]).forEach(entity => {
      const { x, y } = entity.location;
      const { character } = entity.drawable;

      this.display.draw(x, y, character);
    });

    this.drawInterface();
  }

  drawInterface() {
    const logY = 22;
    const logWidth = 40;

    times(logWidth, x => {
      const y = logY;
      const character = this.logText[x] || ' ';

      this.display.draw(x, y, character);
    });
  }
}
