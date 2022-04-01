import {
  getNumericType,
  Token,
  byteSize,
  shortStringByteLength,
  tokens,
  log,
  isTokenNumeric,
  LONG_SIZE_BYTES,
  Config,
} from "./common";
import { WriteBuffer } from "./buffer";
import { arrayBufferToBase64 } from ".";
import { blobToArrayBuffer } from "./util";

type WriteToken = {
  type: Token;
  value?: any;
  size?: number;
};

export class DataWriter {
  tokens: WriteToken[] = [];

  constructor(readonly config: Config = {}) {}

  private writeKey(key: string) {
    this.tokens.push({
      type: "_key",
      value: key,
      size: 1 + shortStringByteLength(key),
    });
  }

  async serialise(obj: { [k: string]: any } | Array<any>): Promise<DataWriter> {
    const isArray = Array.isArray(obj);

    if (isArray) {
      this.tokens.push({
        type: "_pushArr",
      });
    } else {
      this.tokens.push({
        type: "_pushObj",
      });
    }

    for (let [key, value] of Object.entries(obj)) {
      if (!isArray) {
        this.writeKey(key);
      }
      await this.write(value);
    }

    this.tokens.push({
      type: "_pop",
    });

    this.tokens.push({
      type: "_eof",
    });

    return this;
  }

  private async write(value: any) {
    if (value === null) {
      this.tokens.push({
        type: "null",
      });
    } else if (value instanceof Blob) {
      /** Blob */
      const arrayBuffer = await blobToArrayBuffer(value);

      this.tokens.push({
        type: "Blob",
        value: { arrayBuffer, blob: value },
        size:
          shortStringByteLength(value.type) +
          LONG_SIZE_BYTES +
          arrayBuffer.byteLength,
      });
    } else if (value instanceof ArrayBuffer) {
      /** ArrayBuffer */

      this.tokens.push({
        type: "ArrayBuffer",
        value,
        size: LONG_SIZE_BYTES + value.byteLength,
      });
    } else if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        /** Array */
        this.tokens.push({ type: "_pushArr" });

        for (const [, item] of value.entries()) {
          await this.write(item);
        }

        this.tokens.push({ type: "_pop" });
      } else {
        /** Object */
        const entries = Object.entries(value);
        this.tokens.push({ type: "_pushObj" });

        for (let [subkey, subvalue] of entries) {
          this.writeKey(subkey);

          await this.write(subvalue);
        }

        this.tokens.push({ type: "_pop" });
      }
    } else {
      /** Primitive Values */
      if (typeof value === "number") {
        /** Number */
        const type = getNumericType(value) as Token;
        const byteLength = byteSize[type as keyof typeof byteSize];
        this.tokens.push({ type, value, size: byteLength });
      } else if (typeof value === "string") {
        if (value.length === 1) {
          /** Char */
          this.tokens.push({
            type: "Char",
            value,
            size: 2,
          });
        } else {
          /** String */
          this.tokens.push({
            type: "String",
            value,
            size: LONG_SIZE_BYTES + value.length * 2,
          });
        }
      } else if (typeof value === "boolean") {
        /** Boolean */
        this.tokens.push({ type: "Boolean", value, size: 1 });
      }
    }
  }

  toArrayBuffer() {
    const {
      config: { debug },
    } = this;

    const byteLength =
      this.tokens.reduce((prev, curr) => prev + (curr.size || 0) + 1, 0) +
      LONG_SIZE_BYTES;

    if (debug) {
      log(`Writing tokens for ${byteLength} bytes total size`);
      console.table(this.tokens);
    }

    const buffer = new WriteBuffer(byteLength, this.config.littleEndian);

    this.tokens.forEach((token) => {
      const { type, value } = token;

      try {
        const header = tokens.indexOf(type);
        buffer.writeUint8(header);

        if (type === "_key") {
          buffer.writeString(value, false);
        } else if (type === "null") {
        } else if (type === "Char") {
          buffer.writeChar(value);
        } else if (type === "String") {
          buffer.writeString(value);
        } else if (isTokenNumeric(type)) {
          buffer.writeNumericType(type, value);
        } else if (type === "Boolean") {
          buffer.writeBoolean(value);
        } else if (type === "ArrayBuffer") {
          buffer.writeArrayBuffer(value);
        } else if (type === "Blob") {
          const { arrayBuffer, blob } = value;
          buffer.writeString((blob as Blob).type, false);
          buffer.writeArrayBuffer(arrayBuffer);
        }
      } catch (e) {
        console.error(e);
        console.error("Byteoffset: " + buffer.byteOffset);
      }
    });

    if (debug) {
      log(`WriteBuffer log [${buffer.log.length}]`);
      console.table(buffer.log);
    }

    return buffer.array;
  }

  toBlob(type: string = "application/octet-stream") {
    return new Blob([this.toArrayBuffer()], {
      type,
    });
  }

  toBase64() {
    return arrayBufferToBase64(this.toArrayBuffer());
  }
}
