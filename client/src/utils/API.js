
/**
 * Fetches recipes from the Spoonacular API based on a search query.
 * @param {string} query - The search term for the recipe.
 * @returns {Promise<Response>} - The fetch response containing recipe data.
 */
export const searchSpoonacular = (query) => {
  return fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=e675da75cbd340718699bc2539228d08`);
};

/**
* Fetches detailed information about a specific recipe using its ID.
* @param {number|string} id - The ID of the recipe to fetch.
* @returns {Promise<Object>} - The parsed JSON data containing recipe information.
*/
export const searchSpoonacularById = async (id) => {
  try {
      // Fetch the recipe information from Spoonacular API
      const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=e675da75cbd340718699bc2539228d08`
      );

      // Check if the response is not OK (status code outside 200-299)
      if (!response.ok) {
          throw new Error("Failed to fetch recipe information");
      }

      const data = await response.json(); // Extract JSON data from the response
      return data; // Return the parsed data
  } catch (error) {
      console.error("Error fetching recipe:", error); // Log any errors to the console
  }
};

/**
* Fetches analyzed instructions for a specific recipe using its ID.
* @param {number|string} id - The ID of the recipe for which to fetch instructions.
* @returns {Promise<Object>} - The parsed JSON data containing recipe instructions.
*/
export const searchSpoonacularInstructions = async (id) => {
  try {
      // Fetch the recipe instructions from Spoonacular API
      const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=e675da75cbd340718699bc2539228d08`
      );

      // Check if the response is not OK (status code outside 200-299)
      if (!response.ok) {
          throw new Error("Failed to fetch recipe instructions");
      }

      const data = await response.json(); // Extract JSON data from the response
      return data; // Return the parsed data
  } catch (error) {
      console.error("Error fetching instructions:", error); // Log any errors to the console
  }
};
