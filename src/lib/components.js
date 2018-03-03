// Entity is drawn
export function Drawable() {
  this.character = '?';
}

// Entity takes up space
export function Solid() {}

// Entity has a physical location
export function Location() {
  this.x = 0;
  this.y = 0;
  this.color = '#fff';
}

// Entity is an item (can be held in an inventory)
export function Item() {
  this.name = 'Unknown Item';
}

// Item can be equipped
export function Equippable() {}

// Item can be fired
export function Fireable() {
  this.ammo = 0;
  this.range = 100;
}

// Item can be thrown
export function Throwable() {
  this.range = 5;
}

// Item can bestow harm
export function Damaging() {
  this.damage = 0;
}

// Item can knock out an entity
export function Concussive() {}

// Entity is a living thing
export function Living() {
  this.name = 'Unknown Being';
  this.health = 1;
  this.awake = true;
}

// Entity is dead
export function Dead() {}

// Entity is the player
export function Playable() {}

// Entity has an inventory
export function Inventory() {
  this.contents = [];
  this.add = item => this.contents.push(item);
  this.remove = item => this.contents.splice(this.contents.indexOf(item), 1);
  this.has = item => this.contents.includes(item);
}

// Entity can equip an item
export function Armable() {
  this.item = null;
}
