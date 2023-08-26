export class ValueService {
  constructor({ apiClient }) {
    this._apiClient = apiClient;
  }

  async load({ type }) {
    this.abortLoad();

    switch (type) {
      case "season":
        return this.loadShowSeasons();

      case "episode":
        return this.loadShowEpisodes();

      case "character":
        return this.loadShowCharacters();

      case "crew":
        return this.loadShowCrew();

      default:
        throw new Error(`Unsupported show resource "${type}"!`);
    }
  }

  async loadShowSeasons() {
    const json = await this._apiClient.listShowSeasons({ showId: 216 });

    return json
      .filter(({ premiereDate }) => premiereDate)
      .map(({ id, number, episodeOrder }) => ({
        id,
        value: number,
        label: `${number} (${episodeOrder || "?"} episodes)`,
        searchLabel: number,
      }));
  }

  async loadShowEpisodes() {
    const json = await this._apiClient.listShowEpisodes({ showId: 216 });

    return json.map(({ id, name, season, number }) => ({
      id,
      value: name,
      label: `${name} (S${season}E${number})`,
      searchLabel: name,
    }));
  }

  async loadShowCharacters() {
    const json = await this._apiClient.listShowCharacters({ showId: 216 });

    return json.map(({ person, character }) => ({
      id: character.id,
      value: character.name,
      label: `${character.name} (${person.name})`,
      searchLabel: character.name,
    }));
  }

  async loadShowCrew() {
    const json = await this._apiClient.listShowCrew({ showId: 216 });

    return json.map(({ type, person }) => ({
      id: `${person.id}-${type}`,
      value: person.name,
      label: `${person.name} (${type})`,
      searchLabel: person.name,
    }));
  }

  abortLoad() {
    this._apiClient.abort();
  }
}
