import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ADD_COMMENT } from "../../utils/mutations";
import Auth from "../../utils/auth";
import decode from "jwt-decode"; // Make sure to import decode if you're using it.
import { GET_SECRET_RECIPE } from "../../utils/queries";

const CommentForm = ({ recipeId }) => {
  const navigate = useNavigate();
  const [addComment, { error }] = useMutation(ADD_COMMENT);
  const loggedIn = Auth.loggedIn();
  let user = "";

  if (loggedIn) {
    const token = Auth.getToken();
    const decodedToken = decode(token);
    console.log("decodedToken", decodedToken);
    user = decodedToken.username || decodedToken.data?.username || "";
  } else {
    navigate("/login");
  }

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addedText = newCommentText.trim();
    console.log("addedText", addedText);
    console.log("typeof addedText", typeof addedText);
    if (addedText !== "") {
      try {
        const { data } = await addComment({
          variables: {
            recipeId: recipeId,
            commentText: addedText,
            commentAuthor: user || "Guest",
            // createdAt: createdAt // Use the username if available
          },
          refetchQueries: [{ query: GET_SECRET_RECIPE, variables: { recipeId } }]
        });

        if (data && data.addComment) {
          setComments([...comments, data.addComment]);
          
        }

        // Reset input fields
        setNewCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    } else {
      alert("Please enter a comment.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label has-text-black">Your Name</label>
          <div className="has-text-black">{user ? `Commenter: ${user}` : "Commenter: Guest"}</div>
        </div>

        <div className="field">
          <label className="label has-text-black">Your Comment</label>
          <div className="control">
            <input
              className="input"
              placeholder="Enter your comment"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
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
