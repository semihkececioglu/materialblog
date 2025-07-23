import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Backend'den interaction verilerini çek
export const fetchInteractionData = createAsyncThunk(
  "interaction/fetchData",
  async ({ postId, userId }) => {
    const [likeRes, commentsRes] = await Promise.all([
      axios.get(
        `https://materialblog-server-production.up.railway.app/api/posts/${postId}/like-status`,
        { params: { userId } }
      ),
      axios.get(
        `https://materialblog-server-production.up.railway.app/api/comments?postId=${postId}`
      ),
    ]);

    let saved = false;

    if (userId) {
      const userRes = await axios.get(
        `https://materialblog-server-production.up.railway.app/api/users/id/${userId}`
      );
      const savedPostIds = userRes.data.savedPosts?.map(String) || [];
      saved = savedPostIds.includes(postId);
    }

    const countRecursive = (comments) => {
      let count = 0;
      const traverse = (arr) => {
        arr.forEach((c) => {
          count++;
          if (Array.isArray(c.replies)) traverse(c.replies);
        });
      };
      traverse(comments);
      return count;
    };

    return {
      liked: likeRes.data.liked || false,
      likeCount: likeRes.data.likeCount || 0,
      saved,
      commentCount: countRecursive(commentsRes.data || []),
    };
  }
);

const initialState = {
  liked: false,
  likeCount: 0,
  saved: false,
  commentCount: 0,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setLiked: (state, action) => {
      state.liked = action.payload;
    },
    setLikeCount: (state, action) => {
      state.likeCount = action.payload;
    },
    setSaved: (state, action) => {
      state.saved = action.payload;
    },
    setCommentCount: (state, action) => {
      state.commentCount = action.payload;
    },
    resetInteraction: (state) => {
      state.liked = false;
      state.saved = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInteractionData.fulfilled, (state, action) => {
      state.liked = action.payload.liked;
      state.likeCount = action.payload.likeCount;
      state.saved = action.payload.saved;
      state.commentCount = action.payload.commentCount;
    });
  },
});

export const {
  setLiked,
  setLikeCount,
  setSaved,
  setCommentCount,
  resetInteraction,
} = interactionSlice.actions;

export default interactionSlice.reducer;
