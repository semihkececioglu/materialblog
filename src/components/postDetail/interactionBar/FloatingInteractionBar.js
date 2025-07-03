import React from "react";
import InteractionBarBase from "./InteractionBarBase";

const FloatingInteractionBar = ({ visible = true, postId }) => {
  if (!postId) return null;

  return (
    <InteractionBarBase visible={visible} position="fixed" postId={postId} />
  );
};

export default FloatingInteractionBar;
