export const searchSpoonacular = (query) => {
    return fetch(`https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=${process.env.API_KEY}`);
};