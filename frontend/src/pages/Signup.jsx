import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { TextField, Button } from "@mui/material";
import { signup } from "../services/user/client";
import { toastAlert } from "../lib/toastAlert";

const signupInitialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
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

const Signup = () => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});

  const doSubmit = async (values, { setSubmitting }) => {
    setFieldErrors({});
    const { success, message, errors } = await signup(values);
    if (success) {
      toastAlert({ type: "success", message });
      navigate("/signin");
    } else {
      toastAlert({ type: "error", message });
      if (errors) setFieldErrors(errors || {});
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: signupInitialValues,
    validate: () => ({}),
    onSubmit: doSubmit,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-sky-100 to-cyan-100 px-4">
      <div className="max-w-md w-full bg-white/80 p-10 rounded-3xl shadow-xl flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-center text-purple-700 font-sans">
          Create Your Account
        </h2>
        <p className="mb-6 text-center text-gray-500 font-medium">
          Sign up for CareerGen
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-5 w-full">
          {/* First Name */}
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            required
            error={Boolean(fieldErrors.firstName)}
            helperText={fieldErrors.firstName}
            sx={pastelInputSX("#f9a8d4", "#f472b6")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
            size="medium"
          />
          {/* Middle Name */}
          <TextField
            fullWidth
            label="Middle Name"
            name="middleName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.middleName}
            error={Boolean(fieldErrors.middleName)}
            helperText={fieldErrors.middleName}
            sx={pastelInputSX("#bae6fd", "#38bdf8")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
            size="medium"
          />
          {/* Last Name */}
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            required
            error={Boolean(fieldErrors.lastName)}
            helperText={fieldErrors.lastName}
            sx={pastelInputSX("#a7f3d0", "#06b6d4")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
            size="medium"
          />
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            required
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
            sx={pastelInputSX("#ddd6fe", "#a78bfa")}
            InputLabelProps={{ sx: { fontSize: 15 } }}
            size="medium"
          />
          {/* Submit button */}
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
            {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-pink-500 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
