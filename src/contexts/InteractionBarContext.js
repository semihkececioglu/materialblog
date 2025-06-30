// src/contexts/InteractionBarContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const InteractionBarContext = createContext();

export const InteractionBarProvider = ({ children, postId }) => {
  const user = useSelector((state) => state.user.currentUser);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!postId || !user) return;

    // Beğeni durumu
    axios
      .get(
        `https://materialblog-server-production.up.railway.app/api/posts/${postId}/like-status`,
        { params: { userId: user._id } }
      )
      .then((res) => {
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      })
      .catch((err) => {
        console.error("[Beğeni] Hata:", err);
      });

    // Kaydetme durumu
    axios
      .get(
        `https://materialblog-server-production.up.railway.app/api/users/${user._id}`
      )
      .then((res) => {
        const savedPostIds = res.data.savedPosts?.map((id) => String(id)) || [];
        setSaved(savedPostIds.includes(postId));
      })
      .catch((err) => {
        console.error("[Kaydet] Hata:", err);
      });
  }, [postId, user]);

  // Yorum sayısı
  useEffect(() => {
    if (!postId) return;
    axios
      .get(
        `https://materialblog-server-production.up.railway.app/api/comments?postId=${postId}`
      )
      .then((res) => {
        const countReplies = (comments) => {
          let count = 0;
          const traverse = (arr) =>
            arr.forEach((c) => {
              count++;
              if (Array.isArray(c.replies)) traverse(c.replies);
            });
          traverse(comments);
          return count;
        };
        setCommentCount(countReplies(res.data || []));
      })
      .catch((err) => {
        console.error("[Yorum Sayısı] Hata:", err);
      });
  }, [postId]);

  return (
    <InteractionBarContext.Provider
      value={{
        liked,
        setLiked,
        likeCount,
        setLikeCount,
        saved,
        setSaved,
        commentCount,
        postId,
      }}
    >
      {children}
    </InteractionBarContext.Provider>
  );
};

export const useInteractionBar = () => useContext(InteractionBarContext);
