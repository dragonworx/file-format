# File-Format

`file-format` converts objects to and from Blobs, Base64, or ArrayBuffers with the freedom to shape things as a JSON object. This is useful for packing complex types of data into a single file for your applications file format, or bundling resource fetched over a network.

Works in both **Node** or the **Browser**.

## Install

Install as dependency through npm.

`npm install file-format`

## Defining your format

To define a format just create either an object or an array with keys/values/items of the supported types above.

You're free to nest arrays and object literals as required.

For example:

```javascript
// define an object with any structure based on the supported types...

const myFileFormat = {
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

// or as an array
const myFileFormat = [
  /*...*/
];
```

The aim is to create the file format as you require, then write it as a single binary file which you can read back later.

## Supported types:

- `string`
- `number`
- `boolean`
- `null`
- `Blob`
- `ArrayBuffer`

Also supports `Array` and `Object` of these primitive types.

## Writing to a Blob

To create a **Blob**, **Base64**, or **ArrayBuffer** from an object use the `DataWriter` and call `toBlob()`, `toArrayBuffer()` or `toBase64()` respectively.

```javascript
import { DataWriter } from "file-format";

const writer = new DataWriter();

writer.serialise(myFileFormat).then(() => {
  // create a Blob...
  const blob = writer.toBlob();
  // or an ArrayBuffer...
  const arrayBuffer = writer.toArrayBuffer();
  // or a Base64 String...
  const base64 = writer.toBase64();
});
```

## Reading from a Blob

To read a **Blob** or **Base64 String** use the `DataReader`. You can pass in a Blob or base64 string.

```javascript
import { DataReader } from "file-format";

const reader = new DataReader();

reader.deserialise(blobOrBase64String).then((myFileFormat) => {
  // myFileFormat is an object just as you originally saved it...
});
```

> **NOTE:** The blob must have been created by a `DataWriter` otherwise unexpected errors will occur during read.

# Issues

Please report any issues [here](https://github.com/dragonworx/file-format/issues).
