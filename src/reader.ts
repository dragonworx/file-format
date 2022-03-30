import { base64ToBlob } from '.';
import { ReadBuffer } from './buffer';
import { isTokenNumeric, log, Token, tokenValue, Config } from './common';

type ReadToken = {
  type: Token;
  value?: any;
};

export class DataReader {
  tokens: ReadToken[] = [];
  stack: any[] = [];

  constructor(readonly config: Config = {}) {}

  async deserialise<T>(blobOrBase64: Blob | string): Promise<T> {
    const {
      config: { debug },
    } = this;

    let buffer: ReadBuffer;

    if (blobOrBase64 instanceof Blob) {
      const arrayBuffer = await new Response(blobOrBase64).arrayBuffer();
      buffer = new ReadBuffer(arrayBuffer, this.config.littleEndian);
    } else {
      const blob = base64ToBlob(blobOrBase64);
      return this.deserialise(blob);
    }

    if (debug) {
      log(`Reading tokens from ${buffer.length} bytes total size`);
    }

    while (true) {
      try {
        const token = tokenValue(buffer.readUint8());
        const readToken: ReadToken = {
          type: token,
        };
        this.tokens.push(readToken);

        if (token === '_key') {
          readToken.value = buffer.readString(false);
        } else if (token === '_pushObj') {
          readToken.value = {};
        } else if (token === '_pushArr') {
          readToken.value = [];
        } else if (token === 'null') {
          readToken.value = null;
        } else if (token === 'Char') {
          readToken.value = buffer.readChar();
        } else if (token === 'String') {
          readToken.value = buffer.readString();
        } else if (isTokenNumeric(token)) {
          readToken.value = buffer.readNumericType(token);
        } else if (token === 'Boolean') {
          readToken.value = buffer.readBoolean();
        } else if (token === 'ArrayBuffer') {
          readToken.value = buffer.readArrayBuffer();
        } else if (token === 'Blob') {
          const type = buffer.readString(false);
          readToken.value = new Blob([buffer.readArrayBuffer()], {
            type,
          });
        } else if (token === '_eof') {
          break;
        }
      } catch (e) {
        console.log(e);
        break;
      }
    }

    if (debug) {
      console.table(this.tokens);

      log(`ReadBuffer log [${buffer.log.length}]`);
      console.table(buffer.log);
    }

    return this.parse() as T;
  }

  get peek() {
    return this.stack[this.stack.length - 1];
  }

  get isRoot() {
    return this.stack.length === 0;
  }

  get isObject() {
    const peek = this.peek;
    return typeof peek === 'object' && !Array.isArray(peek);
  }

  get isArray() {
    return Array.isArray(this.peek);
  }

  private parse() {
    const { stack, tokens } = this;

    let i = 0;

    const activeKey = () =>
      i > 0
        ? tokens[i - 1].type === '_key'
          ? tokens[i - 1].value
          : null
        : null;

    while (i < tokens.length) {
      const { type, value } = tokens[i];

      if (type === '_key') {
      } else if (type === '_pushObj' || type === '_pushArr') {
        if (this.isArray) {
          this.peek.push(value);
        } else if (this.isObject) {
          const key = activeKey();
          this.peek[key] = value;
        }
        stack.push(value);
      } else if (type === '_pop') {
        if (stack.length > 1) {
          stack.pop();
        }
      } else if (value !== undefined) {
        if (this.isArray) {
          this.peek.push(value);
        } else if (this.isObject) {
          const key = activeKey();
          this.peek[key] = value;
        }
      }

      i++;
    }

    return this.stack[0];
  }
}
