const FUNCTION_NAME = /function\s+([^\s(]+)/;

export default function componentPropertyName(Component) {
  const name = getName(Component);
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function getName(f) {
  let name = '';

  if (f instanceof Function) {
    if (f.name) {
      return f.name;
    }

    const match = f.toString().match(FUNCTION_NAME);

    if (match) {
      name = match[1];
    }
  } else if (f && f.constructor instanceof Function) {
    name = getName(f.constructor);
  }

  return name;
}
