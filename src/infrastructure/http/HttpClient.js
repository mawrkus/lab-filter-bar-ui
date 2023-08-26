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

  abort() {
    if (this._abortController) {
      // TODO: https://simonplend.com/provide-context-with-abortsignal-reason/
      this._abortController.abort();
    }
  }
}
