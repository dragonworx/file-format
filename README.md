# File-Format

File format converts objects to and from blobs with the freedom to shape things as a JSON object. This is useful for packing lot's of data into a single file for file formats, or optimisations over the network.

Works in **Node** or the **Browser**.

## Install

Install as dependency through npm.

`npm install file-format`

## Supported types:

- `string`
- `number`
- `boolean`
- `null`
- `Blob`
- `ArrayBuffer`

Also supports `Array` and `Object` of these primitive types.

## Defining your format

To define a format just create either an object or an array with keys/values/items of the supported types above.

You're free to nest arrays and object literals as required.

For example:

```javascript
// define an object with all the supported types...

const obj = {
  n: null,
  a: "x",
  x: 123,
  foo: [null, "bar"],
  y: true,
  z: false,
  w: ["a", "b", { c: false, d: [1, 2, [3, null]] }],
  p: blob,
  d: {
    b: {
      a: true,
    },
  },
  k: arrayBuffer,
  f: 1000,
};
```

The aim is to create a file format as you require, then write it as a single binary file which you can read back later.

## Writing to a Blob

To create a blob from the object use the `DataWriter`.

```javascript
const writer = new DataWriter();

writer.serialise(doc).then(() => {
  const blob = writer.toBlob();
  // do something with blob...
});
```

## Reading from a Blob

To read a blob use the `DataReader`.

```javascript
const reader = new DataReader();

reader.deserialise(blob).then((obj) => {
  // obj is an object with the same structure as above...
});
```

> **NOTE:** The blob must have been created by a `DataWriter` otherwise unexpected errors will occur during read.
