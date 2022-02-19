export class HttpClient {
  constructor() {
    this._abortController = null;
  }

  async fetch(resource, init) {
    this._abortController = new AbortController();

    const { signal } = this._abortController;

    const response = await fetch(resource, { ...init, signal });

    this._abortController = null;

    return response;
  }

  cancel() {
    if (this._abortController) {
      this._abortController.abort();
    }
  }
}
