export const valueService = {
  load: async ({ type }) => {
    if (type === 'character') {
      const response = await fetch('https://api.tvmaze.com/shows/216/cast');
      const json = await response.json();
      return json.map(({ person, character }) => ({
        id: character.id,
        value: character.name,
        label: `${character.name} (${person.name})`,
      }));
    }

    if (type === 'season') {
      const response = await fetch('https://api.tvmaze.com/shows/216/seasons');
      const json = await response.json();
      return json.map(({ id, number, episodeOrder }) => ({
        id,
        value: number,
        label: `${number} (${episodeOrder} episodes)`,
      }));
    }

    if (type === 'episode') {
      const response = await fetch('https://api.tvmaze.com/shows/216/episodes');
      const json = await response.json();
      return json.map(({ id, name, season, number }) => ({
        id,
        value: name,
        label: `${name} (S${season}E${number})`,
      }));
    }
  },
};
