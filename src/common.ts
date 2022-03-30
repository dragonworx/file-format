export const byteSize = {
  Int8: 1,
  Uint8: 1,
  Int16: 2,
  Uint16: 2,
  Int32: 4,
  Uint32: 4,
  Float32: 4,
  Float64: 8,
  BigInt64: 8,
  BigUint64: 8,
};

export const typeRange = {
  Int8: [-128, 127],
  Uint8: [0, 255],
  Int16: [-32768, 32767],
  Uint16: [0, 65535],
  Int32: [-2147483648, 2147483647],
  Uint32: [0, 4294967295],
  Float32: [-3.4e38, 3.4e38],
  Float64: [-1.8e308, 1.8e308],
  BigInt64: [-2 ^ 63, 2 ^ (63 - 1)],
  BigUint64: [0, 2 ^ (64 - 1)],
};

export const dataTypes = [
  'Int8',
  'Uint8',
  'Int16',
  'Uint16',
  'Int32',
  'Uint32',
  'Float32',
  'Float64',
  'BigInt64',
  'BigUint64',
] as const;

export type DataType = typeof dataTypes[number];

export const getDataTypeMethods = {
  Int8: 'getInt8',
  Uint8: 'getUint8',
  Int16: 'getInt16',
  Uint16: 'getUint16',
  Int32: 'getInt32',
  Uint32: 'getUint32',
  Float32: 'getFloat32',
  Float64: 'getFloat64',
  BigInt64: 'getBigInt64',
  BigUint64: 'getBigUint64',
};

export const setDataTypeMethods = {
  Int8: 'setInt8', // 0
  Uint8: 'setUint8', // 1
  Int16: 'setInt16', // 2
  Uint16: 'setUint16', // 3
  Int32: 'setInt32', // 4
  Uint32: 'setUint32', // 5
  Float32: 'setFloat32', // 6
  Float64: 'setFloat64', // 7
  BigInt64: 'setBigInt64', // 8
  BigUint64: 'setBigUint64', // 9
};

export const tokens = [
  ...dataTypes,
  'Char', // 10
  'String', // 11
  'Boolean', // 12
  'ArrayBuffer', // 13
  'Blob', // 14
  'null', // 15
  '_key', // 16
  '_pushObj', // 17
  '_pushArr', // 18
  '_pop', // 19
  '_eof', // 20
] as const;

export type Token = typeof tokens[number];

export const isTokenNumeric = (token: Token) =>
  tokens.indexOf(token) <= tokens.indexOf('BigUint64');

export const tokenValue = (tokenIndex: number) => tokens[tokenIndex];

export const isNumericRangeValid = (value: number, type: DataType) => {
  const [min, max] = typeRange[type];
  return value >= min && value <= max;
};

export const getNumericType = (value: number) =>
  dataTypes.find(dataType => isNumericRangeValid(value, dataType));

export const longStringByteLength = (value: string) =>
  LONG_SIZE_BYTES + value.length * 2;

export const shortStringByteLength = (value: string) =>
  SHORT_SIZE_BYTES + value.length * 2;

export const log = (text: string) =>
  console.log(`%c${text}`, 'font-weight:bold;color:cyan');

export const LONG_SIZE_BYTES = 4;
export const SHORT_SIZE_BYTES = 2;

export interface Config {
  littleEndian?: boolean;
  debug?: boolean;
}
