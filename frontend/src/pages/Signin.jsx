import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { TextField, Button } from "@mui/material";
import { setupAuthentication } from "../redux/slices/auth.slice";
import { signin } from "../services/user/client";
import { toastAlert } from "../lib/toastAlert";

const initialState = {
  email: "",
  password: "",
};

const pastelInputSX = (borderColor, focusColor) => ({
  backgroundColor: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor },
    "&:hover fieldset": { borderColor: focusColor },
    "&.Mui-focused fieldset": {
      borderColor: focusColor,
      boxShadow: `${focusColor}33 0 0 0 2px`,
    },
  },
});

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fieldErrors, setFieldErrors] = useState({});

  const doSubmit = async (values, { setSubmitting }) => {
    setFieldErrors({});
    const { success, message, token, data, errors } = await signin(values);
    if (success) {
      toastAlert({ type: "success", message });
      dispatch(
        setupAuthentication({
          isAuth: true,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          isPasswordUpdated: data.isPasswordUpdated,
        })
      );
      localStorage.setItem("accessToken", token);
      navigate("/dashboard");
    } else {
      toastAlert({ type: "error", message });
      if (errors) setFieldErrors(errors);
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: initialState,
    validate: () => ({}),
    onSubmit: doSubmit,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-sky-100 to-cyan-100 px-4">
      <div className="max-w-md w-full bg-white/80 shadow-xl rounded-3xl p-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-center text-purple-700 font-sans">
          Welcome Back!
        </h2>
        <p className="mb-6 text-center text-gray-500 font-medium">
          Sign in to CareerGen
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-5 w-full">
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            required
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
            sx={pastelInputSX("#f9a8d4", "#f472b6")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
          />
          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            required
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            sx={pastelInputSX("#bae6fd", "#38bdf8")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
          />
          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="inherit"
            fullWidth
            disabled={formik.isSubmitting}
            sx={{
              background: "#c4b5fd",
              color: "#4c1d95",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "0 2px 8px 0 #ddd6fe66",
              textTransform: "none",
              fontSize: 16,
              "&:hover": { background: "#a78bfa" },
              mt: 1,
            }}
          >
            {formik.isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-gray-500">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="text-pink-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
