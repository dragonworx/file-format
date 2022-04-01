/**
 * @jest-environment jsdom
 */

import { DataWriter } from "../src/writer";
import { DataReader } from "../src/reader";
import { base64Img } from "./test-image";
import { base64ToBlob } from "../src/util";

const blob = base64ToBlob(base64Img, "image/gif");

const arrayBuffer = new ArrayBuffer(4);
const view = new DataView(arrayBuffer);
view.setUint8(0, 1);
view.setUint8(1, 2);
view.setUint8(2, 3);
view.setUint8(3, 4);

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

describe("DataWriter / DataReader", () => {
  it("should write and read all supported types", () => {
    return new DataWriter().serialise(obj).then((writer) => {
      const blob = writer.toBlob();
      console.log(blob);
      return new DataReader().deserialise(blob).then((obj2) => {
        expect(obj2).toEqual(obj);
      });
    });
  });
});
