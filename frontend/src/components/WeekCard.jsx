import React from "react";
import TopicCheckbox from "./TopicCheck";
import { RadioButtonUnchecked } from "@mui/icons-material";

const getProgress = (topics) =>
  topics.length
    ? Math.round(
        (topics.filter((t) => t.isCompleted).length / topics.length) * 100
      )
    : 0;

const pastelColors = [
  "from-pink-100 via-pink-50 to-rose-100",
  "from-sky-100 via-cyan-50 to-blue-100",
  "from-violet-100 via-purple-50 to-fuchsia-100",
];

const WeekCard = ({ week, topics, weekId }) => {
  const progress = getProgress(topics);
  const colorIdx = week % pastelColors.length;

  return (
    <div
      className={`relative rounded-3xl shadow-xl p-6 transition transform hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${pastelColors[colorIdx]}`}
      style={{ minHeight: "320px" }}
    >
      {/* Progress circle in corner */}
      <div className="absolute right-5 top-5 flex flex-col items-center">
        <svg width={48} height={48}>
          <circle
            cx={24}
            cy={24}
            r={21}
            stroke="#f3f4f6"
            strokeWidth={4}
            fill="none"
          />
          <circle
            cx={24}
            cy={24}
            r={21}
            stroke="#fdba74"
            strokeWidth={4}
            fill="none"
            strokeDasharray={2 * Math.PI * 21}
            strokeDashoffset={(1 - progress / 100) * 2 * Math.PI * 21}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.4s cubic-bezier(.86,0,.07,1)",
            }}
          />
        </svg>
        <span className="text-xs mt-1 text-orange-400 font-bold">
          {progress}%
        </span>
      </div>

      <div className="mb-2">
        <span className="inline-block bg-white/80 text-purple-700 px-4 py-1 rounded-full font-bold shadow-sm text-lg tracking-wide">
          Week {week}
        </span>
      </div>

      <div className="mt-4 mb-2">
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <RadioButtonUnchecked fontSize="small" sx={{ color: "#a5b4fc" }} />
          <span>
            {topics.length} Topic{topics.length !== 1 && "s"}
          </span>
        </div>
      </div>

      <div className="rounded-xl mt-5 pb-1 bg-white/70 px-3 pt-2">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 mb-2 rounded-lg px-1 py-1 ${
              topic.isCompleted ? "bg-green-50" : "hover:bg-blue-50 transition"
            }`}
          >
            <TopicCheckbox
              title={topic.title}
              isCompleted={topic.isCompleted}
              weekId={weekId}
              index={idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(WeekCard);
