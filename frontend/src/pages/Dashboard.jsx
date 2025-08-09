import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { getCareerPaths } from "../services/user/client";
import { toastAlert } from "../lib/toastAlert";
import CareerPathModal from "../components/CareerPathModal";

const Dashboard = () => {
  const [careerPaths, setCareerPaths] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const retrieveCareerPaths = async () => {
    const { success, message, data } = await getCareerPaths();
    if (success) setCareerPaths(data);
    else toastAlert({ type: "error", message });
  };

  useEffect(() => { retrieveCareerPaths(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-sky-50 to-cyan-50">
      <Navbar />

      <main className="p-7">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
          {careerPaths.map((path, index) => (
            <div
              key={index}
              className="bg-white/80 rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border border-pink-100"
              onClick={() => navigate(`/career-path/${path._id}`)}
            >
              <h2 className="text-lg font-semibold text-purple-700 mb-2">
                {path.name}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Skills:</span>{" "}
                {path.skills.join(", ")}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Timeline:</span> {path.timeline} {path.period}
              </p>
            </div>
          ))}

          {/* Create Card */}
          <div
            className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center text-gray-400 hover:text-pink-500 border border-pink-100 hover:shadow-xl transition cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Add fontSize="large" />
            <span className="mt-2 font-medium">Create Career Path</span>
          </div>
        </div>
      </main>

      <CareerPathModal
        open={open}
        onClose={() => setOpen(false)}
        refreshCareerPaths={retrieveCareerPaths}
      />
    </div>
  );
};

export default Dashboard;
