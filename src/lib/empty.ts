// Harmless empty module to prevent problematic polyfills from loading in the browser
console.log('Stubbing out problematic polyfill');

export const FormData = typeof window !== 'undefined' ? window.FormData : undefined;
export const fetch = typeof window !== 'undefined' ? window.fetch : undefined;
export const Blob = typeof window !== 'undefined' ? window.Blob : undefined;
export const File = typeof window !== 'undefined' ? window.File : undefined;
export const Headers = typeof window !== 'undefined' ? window.Headers : undefined;
export const Request = typeof window !== 'undefined' ? window.Request : undefined;
export const Response = typeof window !== 'undefined' ? window.Response : undefined;

export const formDataToBlob = () => new Blob();

const empty = () => {};
// Do not assign to window.fetch or similar here
Object.assign(empty, {
  FormData,
  fetch,
  Blob,
  File,
  Headers,
  Request,
  Response,
});

export default empty;
