// const API_KEY2 = process.env.REACT_APP_API_KEY2;

export const searchSpoonacular = (query) => {
    return fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=e675da75cbd340718699bc2539228d08`);
};

export const searchSpoonacularById = async (id) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=e675da75cbd340718699bc2539228d08`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch recipe information");
      }
  
      const data = await response.json(); // Extract JSON data
      return data; // Return the parsed data
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  export const searchSpoonacularInstructions = async (id) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=e675da75cbd340718699bc2539228d08`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch recipe instructions");
      }
  
      const data = await response.json(); // Extract JSON data
      return data; // Return the parsed data
    } catch (error) {
      console.error("Error fetching instructions:", error);
    }
  };
  