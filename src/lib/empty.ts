// Harmless empty module to prevent problematic polyfills from loading in the browser
console.log('Stubbing out problematic polyfill');

export const FormData = window.FormData;
export const fetch = window.fetch;
export const Blob = window.Blob;
export const File = window.File;
export const Headers = window.Headers;
export const Request = window.Request;
export const Response = window.Response;

export const formDataToBlob = () => new Blob();

const empty = () => {};
Object.assign(empty, {
  FormData: window.FormData,
  fetch: window.fetch,
  Blob: window.Blob,
  File: window.File,
  Headers: window.Headers,
  Request: window.Request,
  Response: window.Response,
});

export default empty;
