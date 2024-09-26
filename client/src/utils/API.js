export const searchSpoonacular = (query) => {
    return fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=1f6a58783ebd4dbe8643444012dfec59`);
};