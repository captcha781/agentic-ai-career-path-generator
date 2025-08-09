import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { TextField, Button } from "@mui/material";
import { createPassword } from "../services/user/client";
import { toastAlert } from "../lib/toastAlert";
import { setupAuthentication } from "../redux/slices/auth.slice";

const createPasswordInitialValues = {
  password: "",
  confirmPassword: "",
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

const CreatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fieldErrors, setFieldErrors] = useState({});

  const doSubmit = async (values, { setSubmitting }) => {
    setFieldErrors({});
    const { success, message, token, data, errors } = await createPassword(
      values
    );
    if (success) {
      toastAlert({ type: "success", message });
      localStorage.setItem("accessToken", token?.accessToken);
      dispatch(
        setupAuthentication({
          isAuth: true,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          isPasswordUpdated: data.isPasswordUpdated,
          mode: "",
        })
      );
      navigate("/dashboard");
    } else {
      toastAlert({ type: "error", message });
      if (errors) setFieldErrors(errors);
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: createPasswordInitialValues,
    validate: () => ({}),
    onSubmit: doSubmit,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-sky-100 to-cyan-100 px-4">
      <div className="max-w-md w-full bg-white/80 p-10 rounded-3xl shadow-xl flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-center text-purple-700 font-sans">
          Create Your Password
        </h2>
        <p className="mb-6 text-center text-gray-500 font-medium">
          Secure your CareerGen account
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-5 w-full">
          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            required
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            sx={pastelInputSX("#f9a8d4", "#f472b6")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            required
            error={Boolean(fieldErrors.confirmPassword)}
            helperText={fieldErrors.confirmPassword}
            sx={pastelInputSX("#a7f3d0", "#06b6d4")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
          />

          <Button
            type="submit"
            variant="contained"
            color="inherit"
            fullWidth
            disabled={formik.isSubmitting}
            sx={{
              background: "#f9a8d4",
              color: "#831843",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "0 2px 8px 0 #fbcfe833",
              textTransform: "none",
              fontSize: 16,
              "&:hover": { background: "#f472b6" },
              mt: 1,
            }}
          >
            {formik.isSubmitting ? "Setting Password..." : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
