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

export const generateMockParameters = (
  domain: string
): Record<string, string> => {
  const firstName = names[Math.floor(Math.random() * names.length)];
  return {
    first_name: capitaliseFirstLetter(firstName),
    last_name: capitaliseFirstLetter(
      names[Math.floor(Math.random() * names.length)]
    ),
    position: positions[Math.floor(Math.random() * positions.length)],
    phone: `+${Math.floor(Math.random() * 99)} ${Math.floor(
      Math.random() * 999999999
    )}`,
    email: `${firstName}@${domain}`,
  };
};
