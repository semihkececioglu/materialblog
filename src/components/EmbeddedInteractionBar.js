import React from "react";
import InteractionBarBase from "./InteractionBarBase";

const EmbeddedInteractionBar = ({ visible = true, postId }) => {
  if (!postId) return null; // postId yoksa hiç render etme

  return (
    <InteractionBarBase visible={visible} position="static" postId={postId} />
  );
};

export default EmbeddedInteractionBar;
