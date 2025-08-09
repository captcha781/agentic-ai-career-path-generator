import { useState } from "react";
import { Box, TextField, Button, Chip, IconButton, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import { toastAlert } from "../lib/toastAlert";
import { createCareerPath } from "../services/user/client";

const pastelButton = {
  background: "#f9a8d4",
  color: "#831843",
  fontWeight: 600,
  borderRadius: 8,
  boxShadow: "0 2px 8px 0 rgba(239, 68, 68, 0.08)",
  textTransform: "none",
  "&:hover": {
    background: "#f472b6",
  },
};

const pastelCard = {
  background: "rgba(255,255,255,0.93)",
  boxShadow:
    "0 6px 32px 0 rgba(190, 187, 255, 0.11), 0 1.5px 6px 0 rgba(103, 232, 249, 0.10)",
  borderRadius: 2,
};

const careerPathInitialValues = {
  name: "",
  timeline: "",
  skills: [],
  userInput: "",
  resume: null,
};

const CareerPathModal = ({ open, onClose, refreshCareerPaths }) => {
  const [skillInput, setSkillInput] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const doSubmit = async (values, { setSubmitting, resetForm }) => {
    setFieldErrors({});
    setResumeError("");
    const payload = new FormData();
    payload.append("name", values.name);
    payload.append("timeline", values.timeline);
    payload.append("skills", JSON.stringify(values.skills));
    payload.append("userInput", values.userInput);
    if (values.resume) payload.append("resume", values.resume);

    try {
      const { success, message, errors } = await createCareerPath(payload);
      if (success) {
        toastAlert({ type: "success", message });
        onClose();
        resetForm();
        setSkillInput("");
        setResumeError("");
        if (refreshCareerPaths) await refreshCareerPaths();
      } else {
        toastAlert({ type: "error", message });
        if (errors) setFieldErrors(errors);
      }
    } catch (error) {
      toastAlert({ type: "error", message: error?.message ?? "Error!" });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: careerPathInitialValues,
    validate: () => ({}),
    onSubmit: doSubmit,
    enableReinitialize: true,
  });

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (formik.values.skills.length >= 5) {
        toastAlert({
          type: "error",
          message: "You can only add up to 5 skills.",
        });
        setSkillInput("");
        return;
      }
      if (!formik.values.skills.includes(skillInput.trim())) {
        formik.setFieldValue("skills", [
          ...formik.values.skills,
          skillInput.trim(),
        ]);
      }
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    formik.setFieldValue(
      "skills",
      formik.values.skills.filter((s) => s !== skillToDelete)
    );
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        setResumeError("File size must be less than 1.5 MB");
        formik.setFieldValue("resume", null);
      } else {
        setResumeError("");
        formik.setFieldValue("resume", file);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          ...pastelCard,
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "90%",
          maxWidth: 470,
          p: 4,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h2 className="text-xl font-bold text-purple-700">
            Create Career Path
          </h2>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        {/* Name */}
        <TextField
          fullWidth
          label="Name"
          value={formik.values.name}
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name}
          sx={{ mb: 2 }}
        />

        {/* Timeline & Period */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <TextField
            label="Timeline"
            type="number"
            value={formik.values.timeline}
            name="timeline"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={Boolean(fieldErrors.timeline)}
            helperText={fieldErrors.timeline}
            sx={{ flex: 1 }}
          />
          <TextField label="Period" value="week" disabled sx={{ flex: 1 }} />
        </div>

        {/* Skill Input */}
        <div style={{ marginBottom: 14 }}>
          <TextField
            fullWidth
            label="Add Skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder="Type a skill and press Enter"
            disabled={formik.values.skills.length >= 5}
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {formik.values.skills.map((skill, idx) => (
              <Chip
                key={idx}
                label={skill}
                onDelete={() => handleDeleteSkill(skill)}
                color="primary"
                variant="outlined"
              />
            ))}
          </div>
        </div>

        {/* Resume Upload */}
        <div style={{ marginBottom: 14 }}>
          <label className="block mb-1 font-medium text-sm text-gray-700">
            Upload Resume
          </label>
          <TextField
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="block w-full text-sm text-gray-600"
            error={Boolean(resumeError)} // fieldErrors.resume could also be shown
          />
          {(resumeError || fieldErrors.resume) && (
            <p className="text-red-500 text-xs mt-1">
              {resumeError || fieldErrors.resume}
            </p>
          )}
        </div>

        {/* User Prompt */}
        <TextField
          fullWidth
          label="User Prompt"
          name="userInput"
          value={formik.values.userInput || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          multiline
          rows={4}
          placeholder="Describe your career goals or preferences..."
          error={Boolean(fieldErrors.userInput)}
          helperText={fieldErrors.userInput}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          sx={pastelButton}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CareerPathModal;
