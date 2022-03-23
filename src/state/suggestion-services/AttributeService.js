export class AttributeService {
  load() {
    return [
      {
        id: 1,
        value: 'season',
        label: 'Season',
      },
      {
        id: 2,
        value: 'episode',
        label: 'Episode',
      },
      {
        id: 3,
        value: 'character',
        label: 'Character',
      },
      {
        id: 4,
        value: 'crew',
        label: 'Crew',
      },
      // {
      //   id: 5,
      //   value: "parens",
      //   label: "( ... )",
      //   type: "parens",
      // },
    ];
  }
};
