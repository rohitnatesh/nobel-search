export const profileLoader = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const person = params.get('name');
  const year = params.get('year');
  const response = await fetch(`/nobel/person/${person}`);
  const data = await response.json();
  const profile = data?.results?.bindings?.[0];

  if (!profile) {
    return {
      name: person,
      year,
      prizeType: params.get('category'),
      nation: params.get('nation'),
    };
  }

  return {
    name: profile.winnerName.value,
    nation: profile.nation.value.replace(/_/g, ' '),
    year: profile.year ? profile.year.value : '',
    association: profile.association
      ? profile.association.value.split('#')[1].replace(/_/g, ' ')
      : '',
    birthYear: profile.birthYear ? profile.birthYear.value : '',
    deathYear: profile.deathYear ? profile.deathYear.value : '',
    motivation: profile.motivation ? profile.motivation.value : '',
    photo: profile.photo ? profile.photo.value : '',
    prize: profile.prize.value,
    prizeType: profile.prizeType.value.replace('Prize', ''),
    userLink: profile.winner.value,
  };
};
