import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import WeekCard from "../components/WeekCard";
import { toastAlert } from "../lib/toastAlert";
import isEmpty from "is-empty";
import { getCareerPathById } from "../services/user/client";
import CareerContext from "../context/CareerContext";
import ChatModal from "../components/ChatModal";

const CareerPath = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [careerPath, setCareerPath] = useState({
    name: "",
    path: [],
    timeline: 0,
    period: "week",
  });

  const { careerId } = useParams();

  const retrieveCareerPath = useCallback(async () => {
    if (!careerId) return;
    const { success, message, data } = await getCareerPathById(careerId);
    if (success) {
      setCareerPath(data);
    } else {
      toastAlert({ type: "error", message });
    }
  }, [careerId]);

  useEffect(() => {
    retrieveCareerPath();
  }, [retrieveCareerPath]);

  return (
    <CareerContext.Provider value={{ careerPath, setCareerPath }}>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-sky-100 to-cyan-100">
        <Navbar />

        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-purple-700">
            {careerPath.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
            {!isEmpty(careerPath?.path) &&
              careerPath.path.map((weekObj, idx) => (
                <WeekCard
                  key={idx}
                  week={weekObj.week}
                  topics={weekObj.topics}
                  weekId={weekObj._id}
                />
              ))}
          </div>
        </main>

        {/* Floating Chat Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 z-50 bg-pink-400 text-pink-900 p-3 rounded-full shadow-lg hover:bg-pink-500 transition font-bold"
            title="Chat with CareerGen AI"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {/* Pastel Chat Modal */}
        <ChatModal
          open={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          careerId={careerId}
        />
      </div>
    </CareerContext.Provider>
  );
};

export default CareerPath;
