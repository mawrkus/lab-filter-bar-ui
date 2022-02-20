export class ValueService {
  constructor({ httpClient }) {
    this._httpClient = httpClient;
  }

  async load({ type }) {
    switch (type) {
      case 'character':
        return this.loadCharacters();

      case 'season':
        return this.loadSeasons();

      case 'episode':
        return this.loadEpisodes();

      case 'crew':
        return this.loadCrew();

      default:
        throw new Error(`Unsupported type "${type}"!`);
    }
  }

  async loadCharacters() {
    const response = await this._httpClient.fetch('https://api.tvmaze.com/shows/216/cast');

    const json = await response.json();

    return json.map(({ person, character }) => ({
      id: character.id,
      value: character.name,
      label: `${character.name} (${person.name})`,
    }));
  }

  async loadSeasons() {
    const response = await this._httpClient.fetch('https://api.tvmaze.com/shows/216/seasons');

    const json = await response.json();

    return json
      .filter(({ premiereDate }) => premiereDate)
      .map(({ id, number, episodeOrder }) => ({
        id,
        value: number,
        label: `${number} (${episodeOrder} episodes)`,
      }));
  }

  async loadEpisodes() {
    const response = await this._httpClient.fetch('https://api.tvmaze.com/shows/216/episodes');

    const json = await response.json();

    return json.map(({ id, name, season, number }) => ({
      id,
      value: name,
      label: `${name} (S${season}E${number})`,
    }));
  }

  async loadCrew() {
    const response = await this._httpClient.fetch('https://api.tvmaze.com/shows/216/crew');

    const json = await response.json();

    return json.map(({ type, person }) => ({
      id: `${person.id}-${type}`,
      value: person.name,
      label: `${person.name} (${type})`,
    }));
  }

  cancelLoad() {
    this._httpClient.cancel();
  }
};