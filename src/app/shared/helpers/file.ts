import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

export const fileToB64String = (buffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export interface FileModel {
  fileAsBase64String: string;
  fileName: string;
  dataType: string;
  correspondenceId?: string;
}

export class FileCheckResult {
  error: string;
  file: FileModel;

  public toFileUploadRequest(id: number | string): FileUploadRequest {
    return {
      id,
      fileAsBase64String: this.file.fileAsBase64String,
      fileName: this.file.fileName,
      dataType: this.file.dataType,
    };
  }
}

export interface FileUploadRequest extends FileModel {
  id: number | string;
}

export const parseImageFile = (
  file: File,
  callback: (result: any) => void
): void => {
  const allowedExtensions = [".jpeg", ".jpg", ".png", ".svg", ".bmp"];

  const toReturn = new FileCheckResult();

  if (!allowedExtensions.some((x) => file.name.toLowerCase().includes(x))) {
    toReturn.error = "Only jpg, jpeg, png, bmp and svg files allowed.";

    callback(toReturn);

    return;
  }

  if (file.size > 5000000) {
    toReturn.error = "File must must not exceed 5 MB.";

    callback(toReturn);

    return;
  }

  const myReader: FileReader = new FileReader();

  myReader.onloadend = () => {
    toReturn.file = {
      fileAsBase64String: fileToB64String(myReader.result),
      fileName: file.name,
      dataType: `data:${file.type};base64,`,
    };

    callback(toReturn);
  };

  myReader.readAsArrayBuffer(file);
};

export const parseFile = (
  file: File,
  callback: (result: any) => void,
  allowedExtensions?: string[]
): void => {
  const toReturn = new FileCheckResult();

  if (file.size > 25000000) {
    toReturn.error = "File must must not exceed 25 MB.";

    callback(toReturn);

    return;
  }

  const myReader: FileReader = new FileReader();

  myReader.onloadend = () => {
    const myFile: FileModel = {
      fileAsBase64String: fileToB64String(myReader.result),
      dataType: `data:${file.type};base64,`,
      fileName: file.name,
    };
    toReturn.file = myFile;
    callback(toReturn);
  };

  myReader.readAsArrayBuffer(file);
};

export const openFileDialog = (doc: FileModel): void => {
  const blob = new Blob([s2ab(atob(doc.fileAsBase64String))]);
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = doc.fileName;
  link.click();
  link.remove();
};

export const createBlobUrl = async (doc: FileModel, dataType = 'data:application/pdf;base64,'): Promise<string> => {
 //const blob = new Blob([s2ab(atob(doc.fileAsBase64String))], {type: 'application/pdf'});

  const base64Response = await fetch(dataType + doc.fileAsBase64String);
  const blob = await base64Response.blob();
  //const buffer = await base64Response.arrayBuffer();

  return URL.createObjectURL(blob)
};

// export const createBlobUrl = async (doc: FileModel, callback: (result: any) => void, dataType = 'data:application/pdf;base64,'): Promise<void> => {
//   //const blob = new Blob([s2ab(atob(doc.fileAsBase64String))], {type: 'application/pdf'});

//    const base64Response = await fetch(dataType + doc.fileAsBase64String);
//    const blob = await base64Response.blob();
//    //const buffer = await base64Response.arrayBuffer();

//    // var a = new FileReader();
//    // a.onload = function(e) {callback(e.target.result);}
//    // a.readAsDataURL(blob);
//  };

// export const openPrintDialog = async (doc: FileModel): Promise<void> => {
//   const blobUrl = await createBlobUrl(doc);
//   const iframe = document.createElement("iframe");
//   iframe.style.display = "none";
//   iframe.src = blobUrl;
//   document.body.appendChild(iframe);
//   iframe.contentWindow.print();
//   iframe.remove();
// };

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  // tslint:disable-next-line: no-bitwise
  for (let i = 0; i != s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}
