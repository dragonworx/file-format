export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) {
        reject(new Error("FileReader returned empty result"));
      }
      resolve(reader.result!.toString());
    };
    reader.readAsDataURL(blob);
  });
}

export const base64ToBlob = (
  b64Data: string,
  contentType: string = "application/octet-stream",
  sliceSize: number = 512
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function downloadBlob(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.innerHTML = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
  return link;
}

export function selectLocalFile() {
  const div = document.createElement("div");
  div.style.cssText = `position:absolute;z-index:1;overflow:hidden`;
  div.innerHTML = `<button>Select File<input type="file" /></button>`;
  const input = div.querySelector("input") as HTMLDivElement;
  input.style.cssText = `position:absolute;left:-1000px`;
  div.addEventListener("click", () => input.click());
  document.body.appendChild(div);
  return new Promise((resolve) => {
    input.addEventListener("input", (e) => {
      const target = e.currentTarget as HTMLInputElement;
      if (target.files) {
        const file = target.files[0];
        resolve(file);
      }
    });
  });
}
