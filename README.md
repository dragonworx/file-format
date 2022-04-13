# File-Format

`file-format` converts objects to and from Blobs, Base64, or ArrayBuffers with the freedom to shape things as a JSON object. This is useful for packing complex types of data into a single file for your applications file format, or bundling resource fetched over a network.

> This library is primarily designed for **Browser** / **Electron** usage, though Node usage is possible for Node versions higher than 15.7.

> `Blob` support is poor/non-existent in older version of Node (< v15.7) - see the [Blob Node compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Blob#browser_compatibility) info. Use a polyfill like [cross-blob](https://www.npmjs.com/package/cross-blob) if required.

## Install

Install as dependency through npm.

`npm install file-format`

## Defining your format

To define a format just create either an object or an array with keys/values/items of these supported types:

- `string`
- `number`
- `boolean`
- `null`
- `Blob`
- `ArrayBuffer`

Also supports arbitrary Arrays and Object combinations of these types.

You're free to structure things as required, these types should provide all the flexibility to capture a self-contained file. For example, you can store images as blobs and any metadata required as a single file.

Here's an example of an arbitrary file format:

```javascript
// define an object with any sub structures based on the supported types...

const myFileFormat = {
  aNullProp: null,
  aStringProp: "x",
  aNumberProp: 123,
  anArrayProp: [null, "bar", 123, { x: 1 }],
  aBoolean: true,
  theOtherBoolean: false,
  aComplexArray: ["a", "b", { c: false, d: [1, 2, [3, null]] }],
  aBlobProp: blob,
  someObjectProp: {
    subProp1: {
      subProp2: true,
    },
  },
  anArrayBufferProp: arrayBuffer,
  anotherNumber: 1000.55,
};

// or define it as an array
const myFileFormat = [
  // ...same supported types as above, with any nesting or sub structures required
];
```

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
