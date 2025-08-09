// material-ui
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

// loader style
const LoaderWrapper = styled("div")(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 2001,
  width: "100%",
  // Adds a semi-transparent pastel overlay (optional)
  "&::before": {
    content: '""',
    display: "block",
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    background: "linear-gradient(90deg, #ffe2f8 0%, #d8f2ff 100%)",
    opacity: 0.25,
    pointerEvents: "none",
  },
}));

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress
      sx={{
        height: 6,
        borderRadius: 3,
        boxShadow: "0 2px 6px 0 rgb(255 182 193 / 30%)",
        backgroundColor: "#f5e9ff",
        "& .MuiLinearProgress-bar": {
          background: "linear-gradient(90deg, #c6e6fa 0%, #fcb7d4 100%)", // Blue-pink pastel
        },
      }}
    />
  </LoaderWrapper>
);

export default Loader;
