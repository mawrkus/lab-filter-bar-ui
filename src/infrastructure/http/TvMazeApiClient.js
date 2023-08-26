import { HttpClient } from "./HttpClient";

export class TvMazeApiClient extends HttpClient {
  static apiHost = "https://api.tvmaze.com";

  async listShowSeasons({ showId }) {
    const response = await this.fetch(
      `${TvMazeApiClient.apiHost}/shows/${showId}/seasons`
    );

    return response.json();
  }

  async listShowEpisodes({ showId }) {
    const response = await this.fetch(
      `${TvMazeApiClient.apiHost}/shows/${showId}/episodes`
    );

    return response.json();
  }

  async listShowCharacters({ showId }) {
    const response = await this.fetch(
      `${TvMazeApiClient.apiHost}/shows/${showId}/cast`
    );

    return response.json();
  }

  async listShowCrew({ showId }) {
    const response = await this.fetch(
      `${TvMazeApiClient.apiHost}/shows/${showId}/crew`
    );

    return response.json();
  }
}
