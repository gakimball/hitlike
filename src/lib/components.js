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

// Entity is a living thing
export function Living() {}

// Entity is the player
export function Playable() {}
