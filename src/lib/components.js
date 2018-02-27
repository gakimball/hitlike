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
}

// Entity is a living thing
export function Living() {}
