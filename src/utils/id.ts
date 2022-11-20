declare const validID: unique symbol;

export type ID = string & {
  readonly [validID]: true;
};

export function asID(value: string): ID {
  if (!/^[0-9a-z]{8}$/.test(value)) {
    throw new TypeError(`The value(${value}) does not match the pattern of ID`);
  }
  return value as ID;
}

const DEFAULT_ID_LENGTH = 8;

export function id(): ID {
  const generated = Array.from({ length: DEFAULT_ID_LENGTH }).reduce((previous: string): string => {
    const value = Math.round(Math.random() * 0xf);
    return `${previous}${value.toString(16)}`;
  }, '');
  return asID(generated);
}
