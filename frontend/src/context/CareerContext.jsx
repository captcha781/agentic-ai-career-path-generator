import { createContext } from "react";

const CareerContext = createContext({
  careerPath: {
    _id: "",
    name: "",
    path: [],
    timeline: 0,
    period: "week",
  },
  setCareerPath: null
});

export default CareerContext
