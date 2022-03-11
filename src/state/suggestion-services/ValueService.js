export class ValueService {
  static apiHost = 'https://api.tvmaze.com';

  constructor({ httpClient }) {
    this._httpClient = httpClient;
  }

  async load({ type }) {
    this.cancelLoad();

    switch (type) {
      case 'season':
        return this.loadSeasons();

      case 'episode':
          return this.loadEpisodes();

      case 'character':
        return this.loadCharacters();

      case 'crew':
        return this.loadCrew();

      default:
        throw new Error(`Unsupported type "${type}"!`);
    }
  }

  async loadCharacters() {
    const response = await this._httpClient.fetch(`${ValueService.apiHost}/shows/216/cast`);

    const json = await response.json();

    return json.map(({ person, character }) => ({
      id: character.id,
      value: character.name,
      label: `${character.name} (${person.name})`,
      searchLabel: character.name,
    }));
  }

  async loadSeasons() {
    const response = await this._httpClient.fetch(`${ValueService.apiHost}/shows/216/seasons`);

    const json = await response.json();

    return json
      .filter(({ premiereDate }) => premiereDate)
      .map(({ id, number, episodeOrder }) => ({
        id,
        value: number,
        label: `${number} (${episodeOrder || '?'} episodes)`,
        searchLabel: number,
      }));
  }

  async loadEpisodes() {
    const response = await this._httpClient.fetch(`${ValueService.apiHost}/shows/216/episodes`);

    const json = await response.json();

    return json.map(({ id, name, season, number }) => ({
      id,
      value: name,
      label: `${name} (S${season}E${number})`,
      searchLabel: name,
    }));
  }

  async loadCrew() {
    const response = await this._httpClient.fetch(`${ValueService.apiHost}/shows/216/crew`);

    const json = await response.json();

    return json.map(({ type, person }) => ({
      id: `${person.id}-${type}`,
      value: person.name,
      label: `${person.name} (${type})`,
      searchLabel: person.name,
    }));
  }

  cancelLoad() {
    this._httpClient.cancel();
  }
};
