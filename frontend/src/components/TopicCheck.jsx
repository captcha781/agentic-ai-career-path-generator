import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useContext, useState } from "react";
import CareerContext from "../context/CareerContext";
import { updateCareerTasks } from "../services/user/client";
import { toastAlert } from "../lib/toastAlert";

const pastelSx = {
  color: "#f472b6",
  "&.Mui-checked": {
    color: "#f472b6",
  },
};

const TopicCheckbox = ({ title, isCompleted, weekId, index }) => {
  const [isChecked, setChecked] = useState(isCompleted);
  const { careerPath, setCareerPath } = useContext(CareerContext);

  const handleChange = async (e) => {
    const payload = {
      weekId,
      topic: index,
      isChecked: e.target.checked,
    };

    const { success, message } = await updateCareerTasks(
      payload,
      careerPath._id
    );
    if (success) {
      setChecked(!e.target.checked);
      toastAlert({ type: "success", message });
      setCareerPath((prev) => ({
        ...prev,
        path: prev.path.map((weekObj) => {
          if (weekObj._id !== weekId) return weekObj;
          return {
            ...weekObj,
            topics: weekObj.topics.map((topic, idx) =>
              idx === index
                ? { ...topic, isCompleted: !e.target.checked }
                : topic
            ),
          };
        }),
      }));
    } else {
      toastAlert({ type: "error", message });
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox onChange={handleChange} checked={isChecked} sx={pastelSx} />
      }
      label={<span className="text-sm text-gray-700">{title}</span>}
      sx={{ alignItems: "center", m: 0 }}
    />
  );
};

export default React.memo(TopicCheckbox);
