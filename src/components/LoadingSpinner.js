import React from "react";
import FadeLoader from "react-spinners/FadeLoader";

const LoadingSpinner = () => {
  const loadingCSS = {
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgorundColor: "rgba(0,0,0,0.5)",
  };

  return (
    <div style={loadingCSS}>
      <FadeLoader />
    </div>
  );
};

export default LoadingSpinner;
