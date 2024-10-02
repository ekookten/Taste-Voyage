import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ADD_COMMENT } from "../../utils/mutations";
import Auth from "../../utils/auth";
import decode from "jwt-decode"; // Import for decoding JWT tokens
import { GET_SECRET_RECIPE } from "../../utils/queries"; // Query to fetch the updated recipe

const CommentForm = ({ recipeId }) => {
  const navigate = useNavigate();
  const [addComment, { error }] = useMutation(ADD_COMMENT); // Mutation for adding a comment
  const loggedIn = Auth.loggedIn(); // Check if the user is logged in
  let user = "";

  // If logged in, decode the token to get the username
  if (loggedIn) {
    const token = Auth.getToken();
    const decodedToken = decode(token);
    user = decodedToken.username || decodedToken.data?.username || "";
  } else {
    navigate("/login"); // Redirect to login if not logged in
  }

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [comments, setComments] = useState([]); // State to manage comments
  const [newCommentText, setNewCommentText] = useState(""); // State for new comment input

  // Function to handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const addedText = newCommentText.trim(); // Get trimmed comment text

    // Check if the comment is not empty
    if (addedText !== "") {
      try {
        const capitalizedUser = capitalizeFirstLetter(user || "Guest"); // Capitalize username

        // Execute the mutation to add a comment
        const { data } = await addComment({
          variables: {
            recipeId: recipeId, // Recipe ID to associate the comment with
            commentText: addedText, // Comment text
            commentAuthor: capitalizedUser, // Capitalized author name
            createdAt: new Date().toISOString(), // Current timestamp
          },
          refetchQueries: [{ query: GET_SECRET_RECIPE, variables: { recipeId } }] // Refetch updated recipe data
        });
        
        console.log("Response data:", data); // Log the response data
        if (data && data.addComment) {
          setComments([...comments, data.addComment]); // Update the local comments state
        }

        // Reset input field
        setNewCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error); // Handle any errors
      }
    } else {
      alert("Please enter a comment."); // Alert if the input is empty
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label has-text-black">Your Comment</label>
          <div className="control">
            <input
              className="input"
              placeholder="Enter your comment"
              value={newCommentText} // Controlled input
              onChange={(e) => setNewCommentText(e.target.value)} // Update state on input change
              required
            />
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Add Comment
            </button>
          </div>
        </div>

        {error && (
          <p className="has-text-danger">
            Failed to add comment. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default CommentForm;
