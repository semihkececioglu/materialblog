import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const InteractionBarContext = createContext();

export const InteractionBarProvider = ({ children }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // Slug'ı URL'den al (örn: /post/slug-adi)
  const slug = window.location.pathname.split("/").pop();

  // Beğeni durumu ve toplam beğeni sayısını al
  const fetchLikeStatus = async () => {
    try {
      const res = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/posts/slug/${slug}/like-status`,
        {
          params: { userId: user?._id },
        }
      );
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error("Beğeni durumu alınamadı:", err);
    }
  };

  // Kaydetme durumu al
  const fetchSaveStatus = async () => {
    try {
      const res = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/users/${user?._id}`
      );
      const savedList = res.data.savedPosts || [];
      setSaved(savedList.includes(res.data._id)); // tüm postId'ler ObjectId formatında olmalı
    } catch (err) {
      console.error("Kaydetme durumu alınamadı:", err);
    }
  };

  // Yorum sayısını hesapla (nested yorumlar dahil)
  const fetchCommentCount = async () => {
    try {
      const res = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/comments?slug=${slug}`
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
    if (slug) {
      fetchLikeStatus();
      fetchCommentCount();
      if (user) fetchSaveStatus();
    }
  }, [slug, user]);

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
