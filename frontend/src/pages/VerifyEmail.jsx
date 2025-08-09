import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../services/user/client";
import { toastAlert } from "../lib/toastAlert";
import { setupAuthentication } from "../redux/slices/auth.slice";

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const runOnce = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyUser = useCallback(async () => {
    if (!verificationToken) {
      return;
    }

    const { success, message, token } = await verifyEmail(
      verificationToken
    );

    if (success) {
      toastAlert({ type: "success", message });
      localStorage.setItem("accessToken", token?.accessToken);
      dispatch(
        setupAuthentication({
          isAuth: true,
          mode: "CREATE_PASSWORD",
        })
      );
      navigate('/create-password')
    } else {
      toastAlert({ type: "error", message });
    }
  }, [verificationToken, dispatch, navigate]);

  useEffect(() => {
    if (!runOnce.current) {
      runOnce.current = true;
      verifyUser();
    }
  }, [verifyUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-700">Verifying your email...</span>
      </div>
    </div>
  );
};

export default VerifyEmail;
