import React, { createContext, useContext, useEffect, useState } from "react";

const InteractionBarContext = createContext();

export const InteractionBarProvider = ({ postId, children }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const calculateTotalComments = (comments) => {
    let total = 0;
    const countRecursive = (arr) => {
      arr.forEach((c) => {
        total += 1;
        if (Array.isArray(c.replies)) {
          countRecursive(c.replies);
        }
      });
    };
    countRecursive(comments);
    return total;
  };

  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    const userLiked = JSON.parse(localStorage.getItem("userLiked")) || {};
    const storedComments = localStorage.getItem(`comments_${postId}`);

    setLikeCount(likes[postId] || 0);
    setLiked(String(userLiked[postId]) === "true");

    if (storedComments) {
      try {
        const parsed = JSON.parse(storedComments);
        if (Array.isArray(parsed)) {
          setCommentCount(calculateTotalComments(parsed));
        } else {
          setCommentCount(0);
        }
      } catch (error) {
        setCommentCount(0);
      }
    } else {
      setCommentCount(0);
    }
  }, [postId]);

  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    const userLiked = JSON.parse(localStorage.getItem("userLiked")) || {};

    likes[postId] = likeCount;
    userLiked[postId] = liked;

    localStorage.setItem("likes", JSON.stringify(likes));
    localStorage.setItem("userLiked", JSON.stringify(userLiked));
  }, [liked, likeCount, postId]);

  return (
    <InteractionBarContext.Provider
      value={{
        liked,
        setLiked,
        likeCount,
        setLikeCount,
        commentCount,
        setCommentCount,
      }}
    >
      {children}
    </InteractionBarContext.Provider>
  );
};

export const useInteractionBar = () => useContext(InteractionBarContext);
