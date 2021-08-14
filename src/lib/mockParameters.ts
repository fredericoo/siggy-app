const names = [
  'salem',
  'mimo',
  'tapi',
  'morgana',
  'blu',
  'lulu',
  'gut',
  'mixi',
  'pagu',
];

const capitaliseFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const positions = ['director of treats', 'CMO', 'Co-sleeper'];

export const generateMockParameters = (): Record<string, string> => ({
  first_name: capitaliseFirstLetter(
    names[Math.floor(Math.random() * names.length)]
  ),
  last_name: capitaliseFirstLetter(
    names[Math.floor(Math.random() * names.length)]
  ),
  position: positions[Math.floor(Math.random() * positions.length)],
});
