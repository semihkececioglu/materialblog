import React from "react";
import InteractionBarBase from "./InteractionBarBase";

const FloatingInteractionBar = ({ visible = true }) => {
  return <InteractionBarBase visible={visible} position="fixed" />;
};

export default FloatingInteractionBar;
