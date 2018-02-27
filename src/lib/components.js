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

// Item is being held in a living thing's inventory
export function HeldItem() {
  this.parent = null;
}

// Item is being stored in a chest
export function StoredItem() {
  this.parent = null;
}

// Entity is a living thing
export function Living() {
  this.name = 'Unknown Being';
}

// Entity is the player
export function Playable() {}
