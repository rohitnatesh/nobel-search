export const homeLoader = async () => {
  const nationsResponse = fetch('/nobel/nations');
  const categoriesResponse = fetch('/nobel/categories');
  const yearsResponse = fetch('/nobel/years');

  const responseData = await Promise.all([
    nationsResponse,
    categoriesResponse,
    yearsResponse,
  ]);

  const [nations, categories, years] = await Promise.all(
    responseData.map((response) => response.json())
  );

  return {
    nations: nations.map((nation) => ({
      label: nation.replace(/_/g, ' '),
      value: nation,
    })),
    categories: categories.map((category) => ({
      label: category.replace('Prize', ''),
      value: category,
    })),
    years: years.map((year) => ({ label: year, value: year })),
  };
};
