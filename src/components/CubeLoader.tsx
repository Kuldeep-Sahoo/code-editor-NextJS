import React from "react";

const Loader: React.FC = () => {
    const cubeStyle: React.CSSProperties = {
        width: "200px",
        height: "200px",
        perspective: "1000px",
        margin: "100px auto",
    };

    const rubiksCubeStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        animation: "my-rotateCube 5s infinite linear",
    };

    const faceStyle: React.CSSProperties = {
        position: "absolute",
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        height: "100%",
    };

    const cubeItemStyle: React.CSSProperties = {
        width: "calc(100% / 3)",
        height: "calc(100% / 3)",
        boxSizing: "border-box",
        border: "1px solid #000",
    };

    const keyframes = `
    @keyframes my-rotateCube {
      0% {
        transform: rotateX(0deg) rotateY(0deg);
      }
      100% {
        transform: rotateX(360deg) rotateY(360deg);
      }
    }
  `;

    return (
        <div style={cubeStyle}>
            <style>{keyframes}</style>
            <div style={rubiksCubeStyle}>
                {["front", "back", "left", "right", "top", "bottom"].map(
                    (face, index) => (
                        <div
                            key={index}
                            className={`face ${face}`}
                            style={{
                                ...faceStyle,
                                transform:
                                    face === "front"
                                        ? "translateZ(100px)"
                                        : face === "back"
                                            ? "rotateY(180deg) translateZ(100px)"
                                            : face === "left"
                                                ? "rotateY(-90deg) translateZ(100px)"
                                                : face === "right"
                                                    ? "rotateY(90deg) translateZ(100px)"
                                                    : face === "top"
                                                        ? "rotateX(90deg) translateZ(100px)"
                                                        : "rotateX(-90deg) translateZ(100px)",
                            }}
                        >
                            {[...Array(9)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        ...cubeItemStyle,
                                        background:
                                            i === 0 || i === 8
                                                ? "#ff3d00"
                                                : i === 1 || i === 7
                                                    ? "#ffeb3b"
                                                    : i === 2 || i === 6
                                                        ? "#4caf50"
                                                        : i === 3 || i === 5
                                                            ? "#2196f3"
                                                            : "#ffffff",
                                    }}
                                ></div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Loader;