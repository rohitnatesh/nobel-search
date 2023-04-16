export const homePageLoader = async () => {
  const nationsResponse = fetch('/nobel/nations');
  const categoriesResponse = fetch('/nobel/categories');
  const yearsResponse = fetch('/nobel/years');

  const data = await Promise.all([
    nationsResponse,
    categoriesResponse,
    yearsResponse,
  ]);

  return await Promise.all(data.map((response) => response.json()));
};
