/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, createTheme, Snackbar, Slide, IconButton } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SuccessIcon from "../../assets/icons/alerts/Success.svg";
import DangerIcon from "../../assets/icons/alerts/Danger.svg";
import WarningIcon from "../../assets/icons/alerts/Warning.svg";
import InfoIcon from "../../assets/icons/alerts/Info.svg";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "is-empty";
import { removeToast } from "../../redux/slices/toast.slice";

const ToastContainer = () => {
  const themeConfig = useMemo(
    () =>
      createTheme({
        components: {
          MuiAlert: {
            styleOverrides: {
              filledSuccess: {
                backgroundColor: "#FFFFFF",
                color: "#000000",
                boxShadow: "0px 8px 15px -6px rgba(30, 176, 90, 0.15)",
                borderRadius: "0.8rem",
              },
              filledWarning: {
                backgroundColor: "#FFFFFF",
                color: "#000000",
                boxShadow: "0px 8px 15px -6px rgba(226, 111, 32, 0.15)",
                borderRadius: "0.8rem",
              },
              filledError: {
                backgroundColor: "#FFFFFF",
                color: "#000000",
                boxShadow: "0px 8px 15px -6px rgba(208, 48, 47, 0.15)",
                borderRadius: "0.8rem",
              },
              filledInfo: {
                backgroundColor: "#FFFFFF",
                color: "#000000",
                boxShadow: "0px 8px 15px -6px rgba(77, 98, 229, 0.15)",
                borderRadius: "0.8rem",
              },
            },
          },
        },
      }),
    []
  );

  const { toasts } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  const handleClose = (id) => {
    dispatch(removeToast(id));
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <ThemeProvider theme={themeConfig}>
      {!isEmpty(toasts) &&
        toasts.map((toast, i) => (
          <Snackbar
            key={toast.id}
            open={toast.isOpen}
            autoHideDuration={5000}
            onClose={() => handleClose(toast.id)}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            sx={{
              zIndex: (theme) => theme.zIndex.snackbar + 100,
              top: `${8 + i * 72}px`,
              left: "auto",
              right: "24px",
              position: "fixed",
            }}
            slotProps={{
              clickAwayListener: {
                onClickAway: () => handleClose(toast.id),
              },
            }}
            slots={{ transition: SlideTransition }}
          >
            <Alert
              onClose={() => handleClose(toast.id)}
              severity={toast.type}
              variant="filled"
              sx={{ width: "100%" }}
              className="tw-flex tw-items-center tw-text-sm sm:tw-text-base"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => handleClose(toast.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              iconMapping={{
                success: <img src={SuccessIcon} alt="SuccessIcon" />,
                error: <img src={DangerIcon} alt="DangerIcon" />,
                info: <img src={InfoIcon} alt="InfoIcon" />,
                warning: <img src={WarningIcon} alt="WarningIcon" />,
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
    </ThemeProvider>
  );
};

export default ToastContainer;
