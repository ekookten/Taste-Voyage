export const searchSpoonacular = (query) => {
    return fetch(`https://api.spoonacular.com/recipes/716429/information?apiKey=${process.env.API_KEY}`);
};