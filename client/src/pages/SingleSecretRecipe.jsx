import { useParams } from "react-router-dom"; // Import useParams to access URL parameters
import { useQuery } from "@apollo/client"; // Import useQuery for GraphQL data fetching
import { GET_SECRET_RECIPE } from "../utils/queries"; // Import the query for fetching a secret recipe
import CommentForm from "../components/CommentForm"; // Import the comment form component
import Auth from "../utils/auth"; // Import authentication utility
import decode from "jwt-decode"; // Import jwt-decode for decoding JWT tokens

const SingleSecretRecipe = () => {
  const { recipeId } = useParams(); // Extract recipeId from URL parameters

  // Use Apollo's useQuery hook to fetch the recipe details based on recipeId
  const { loading, error, data } = useQuery(GET_SECRET_RECIPE, {
    variables: { recipeId },
  });

  // Show loading state while fetching data
  if (loading) return <p>Loading...</p>;
  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  // Directly access the fetched recipe from the query data
  const recipe = data?.getSecretRecipe; 

  // Check if a recipe is found
  if (!recipe) return <p>No recipe found.</p>;

  // Decode the token to get user information
  const token = Auth.getToken(); 
  let username = "";
  if (token) {
    const decodedToken = decode(token); // Decode the token to access its payload
    username = decodedToken.username; // Extract the username from the decoded token
  }

  // Function to format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp)); // Convert the string timestamp to a number
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mt-5">
      {/* Display the recipe title */}
      <div
        className="box has-background-light"
        style={{ borderRadius: "8px", padding: "5px", marginBottom: "20px" }}
      >
        <h1 className="title is-2 has-text-centered has-text-black">
          {recipe.title || "No Title Available"}
        </h1>
      </div>

      {/* Display the recipe image if available */}
      {recipe.image && (
        <div
          className="card"
          style={{
            display: "flex",
            justifyContent: "center",
            border: "none",
            boxShadow: "none",
          }}
        >
          <div
            className="card-image"
            style={{ border: "none", boxShadow: "none" }}
          >
            <figure
              className="image"
              style={{
                width: "350px",
                height: "auto",
                margin: "0",
                border: "none",
              }}
            >
              <img
                src={recipe.image}
                alt={`The cover of ${recipe.title}`}
                style={{
                  width: "100%",
                  height: "auto",
                  border: "none",
                  boxShadow: "none",
                  borderRadius: "8px",
                }}
              />
            </figure>
          </div>
        </div>
      )}

      {/* Ingredients Section */}
      <div
        className="box mt-5"
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h2 className="title is-4 has-text-black">Ingredients</h2>
        <ul>
          {recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <li className="has-text-black" key={index}>
                <strong className="has-text-black">{ingredient.name}</strong>:{" "}
                {ingredient.quantity} {ingredient.unit}
              </li>
            ))
          ) : (
            <li>No ingredients available for this recipe.</li>
          )}
        </ul>
      </div>

      {/* Instructions Section */}
      <div
        className="box mt-5"
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h2 className="title is-4 has-text-black">Instructions</h2>
        <ol>
          {recipe.instructions.length > 0 ? (
            recipe.instructions.map((step, index) => (
              <li className="has-text-black" key={index}>
                <strong className="has-text-black">Step {step.step}:</strong>{" "}
                {step.text}
              </li>
            ))
          ) : (
            <li>No instructions available for this recipe.</li>
          )}
        </ol>
      </div>

      {/* Comment Form */}
      <div className="container is-flex is-justify-content-center mt-5">
        <div
          className="box"
          style={{
            width: "80%", // Increased width for better layout
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h2 className="title is-4 has-text-centered has-text-black">Add a Comment</h2>
          {/* Pass recipeId and username to CommentForm */}
          <CommentForm recipeId={recipeId} username={username} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="container is-flex is-justify-content-center mt-5">
        <div
          className="box"
          style={{
            width: "80%", // Increased width for better layout
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h2 className="title is-4 has-text-centered has-text-black">Comments</h2>
          {recipe.comments.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: "0" }}>
              {recipe.comments.map((comment) => (
                <li
                  className="has-text-black"
                  key={comment._id}
                  style={{
                    borderBottom: "1px solid #e0e0e0", // Add a bottom border for separation
                    padding: "10px 0", // Add padding for better spacing
                    marginBottom: "10px", // Space between comments
                    overflowWrap: "break-word", // Break long words
                    wordBreak: "break-word", // Break words if they are too long
                  }}
                >
                  <strong className="has-text-black">
                    {comment.commentAuthor}
                  </strong>
                  <br />
                  <span style={{ marginLeft: "5px" }}>
                    {comment.commentText}
                  </span>
                  <br />
                  <small style={{ color: "#7a7a7a" }}>
                    Posted on {formatDate(comment.createdAt)} {/* Format and display comment date */}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleSecretRecipe; // Export the SingleSecretRecipe component
