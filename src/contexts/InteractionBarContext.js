import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const InteractionBarContext = createContext();

export const InteractionBarProvider = ({ children }) => {
  const { user, loading } = useAuth(); // 🔄 loading eklendi
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const slug = window.location.pathname.split("/").pop();

  // ✅ Beğeni durumu
  const fetchLikeStatus = async () => {
    try {
      const res = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/posts/slug/${slug}/like-status`,
        { params: { userId: user?._id } }
      );
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error("Beğeni durumu alınamadı:", err);
    }
  };

  // ✅ Kaydetme durumu
  const fetchSaveStatus = async () => {
    try {
      // 1. Kullanıcı verisini al
      const userRes = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/users/${user?._id}`
      );
      const savedPostIds =
        userRes.data.savedPosts?.map((id) => id.toString()) || [];

      // 2. Slug'a göre post'u al
      const postRes = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/posts`
      );
      const currentPost = postRes.data.find((p) => p.slug === slug);

      // 3. Slug eşleştiyse, o post'un _id'si savedPostIds içinde mi kontrol et
      if (currentPost) {
        const isSaved = savedPostIds.includes(currentPost._id.toString());
        setSaved(isSaved);
      } else {
        console.warn("Slug eşleşen yazı bulunamadı:", slug);
      }
    } catch (err) {
      console.error("Kaydetme durumu alınamadı:", err);
    }
  };

  // ✅ Yorum sayısı
  const fetchCommentCount = async () => {
    try {
      const postRes = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/posts`
      );
      const currentPost = postRes.data.find((p) => p.slug === slug);
      if (!currentPost) return;

      const res = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/comments?postId=${currentPost._id}`
      );

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
        countRecursive(res.data || []);
        return total;
      };

      setCommentCount(calculateTotalComments(res.data));
    } catch (err) {
      console.error("Yorum sayısı alınamadı:", err);
    }
  };

  useEffect(() => {
    if (!slug || loading) return;

    fetchLikeStatus();
    fetchCommentCount();
    if (user) fetchSaveStatus();
  }, [slug, user, loading]);

  return (
    <InteractionBarContext.Provider
      value={{
        liked,
        setLiked,
        likeCount,
        setLikeCount,
        commentCount,
        saved,
        setSaved,
      }}
    >
      {children}
    </InteractionBarContext.Provider>
  );
};

export const useInteractionBar = () => useContext(InteractionBarContext);
