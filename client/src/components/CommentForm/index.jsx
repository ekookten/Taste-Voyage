import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT } from "../../utils/mutations";
import Auth from "../../utils/auth";

const CommentForm = ({ username }) => {
  const [commentText, setCommentText] = useState("");
  const [addComment, { error }] = useMutation(ADD_COMMENT);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert("Please enter your comment.");
      return;
    }

    try {
      const commentData = {
        commentText,
        createdAt: new Date().toISOString(),
      };
      await addComment({
        variables: {
        commentData
        },
      });

      // Clear the comment field after successful submission
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Automatically display the username */}
        <div className="field">
          <label className="label">Your Name</label>
          <div>{username ? `Commenter: ${username}` : "Commenter: Guest"}</div>
        </div>

        <div className="field">
          <label className="label">Your Comment</label>
          <div className="control">
            <textarea
              className="textarea"
              placeholder="Enter your comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
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
