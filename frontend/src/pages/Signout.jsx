import React, { useCallback, useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { signout } from "../services/user/client";
import { toastAlert } from "../lib/toastAlert";
import { revokeAuth } from "../redux/slices/auth.slice";

const Signout = () => {
  const dispatch = useDispatch();
  const runOnce = useRef(false);

  const triggerSignout = useCallback(async () => {
    const { success, message } = await signout();
    if (success) {
      toastAlert({ type: "success", message });
      dispatch(revokeAuth());
    } else {
      toastAlert({ type: "error", message });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!runOnce.current) {
      triggerSignout();
      runOnce.current = true;
    }
  }, [triggerSignout]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-100">
      <div className="bg-white/80 px-8 py-10 rounded-xl shadow-lg flex flex-col items-center">
        <CircularProgress
          sx={{
            color: "#38bdf8",
            marginBottom: 2,
          }}
          size={38}
        />
        <span className="mt-6 text-base text-sky-700 font-semibold tracking-wide text-center">
          Signing you out...
        </span>
      </div>
    </div>
  );
};

export default Signout;
