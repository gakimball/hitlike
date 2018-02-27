import rot from 'rot-js';
import { EntityManager } from 'tiny-ecs';
import { Drawable } from './components';
import createEntityFactory, { Player } from './factories';

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
    this.map = new rot.Map.Arena(20, 20);
    this.mapData = (() => {
      
    })();
    this.createEntity = createEntityFactory(this.entities);
    this.setup();
    this.tick();
  }

  setup() {
    this.createEntity(Player, {
      location: {
        x: 10,
        y: 10,
      },
    });
  }

  getCanvas() {
    return this.display.getContainer();
  }

  handleKey = (e) => {
    const tick = () => {
      e.preventDefault();
      this.tick();
    };

    switch (e.key) {
      case 'ArrowUp':
        this.world.player.moveUp();
        tick();
        break;
      case 'ArrowDown':
        this.world.player.moveDown();
        tick();
        break;
      case 'ArrowLeft':
        this.world.player.moveLeft();
        tick();
        break;
      case 'ArrowRight':
        this.world.player.moveRight();
        tick();
        break;
      default:
    }
  }

  tick() {
    this.map.create((x, y, wall) => {
      this.display.draw(x, y, wall ? '#' : '.');
    });

    this.entities.queryComponents([Drawable]).forEach(entity => {
      const { x, y } = entity.location;
      const { character } = entity.drawable;

      this.display.draw(x, y, character);
    });
  }
}
