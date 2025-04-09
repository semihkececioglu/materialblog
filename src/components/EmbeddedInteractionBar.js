import React from "react";
import InteractionBarBase from "./InteractionBarBase";

const EmbeddedInteractionBar = ({ visible = true }) => {
  return <InteractionBarBase visible={visible} position="static" />;
};

export default EmbeddedInteractionBar;
