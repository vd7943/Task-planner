import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const milestones = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];

const UserMilestone = () => {
  const [authUser] = useAuth();
  const [totalTaskDuration, setTotalTaskDuration] = useState(0);
  const [totalRemarks, setTotalRemarks] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/remark/${authUser._id}`, {
        withCredentials: true,
      })
      .then((response) => {
        const remarks = response.data.remarks || [];
        setTotalRemarks(remarks.length);
        const totalDuration = remarks.reduce(
          (sum, remark) => sum + remark.taskDuration,
          0
        );
        setTotalTaskDuration(totalDuration);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex flex-col items-center bg-[#FFFFFF2B] p-2 lg:p-6 rounded-xl shadow-xl w-full max-w-4xl mx-auto relative overflow-hidden border border-gray-700">
      <div className="relative w-32 h-32">
        <img
          src={authUser.profileImage?.url || "/default-avatar.png"}
          alt={authUser.fullname}
          className="w-full h-full rounded-full border-4 border-[#9D60EC] object-cover shadow-lg"
        />
      </div>

      <h3 className="text-2xl font-bold mt-4 text-gray-200">
        {authUser.fullname}
      </h3>
      <h3 className="text-3xl font-semibold text-[#a56cef] mb-2">
        The Journey 🚀
      </h3>

      <div className="flex flex-wrap justify-center items-center w-full py-6 relative">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-center bg-white p-4 rounded-lg shadow-md border border-black m-2 
            ${index % 2 === 0 ? "ml-10 mb-5" : "mr-10 mb-5"}`}
          >
            {index !== 0 && (
              <div
                className={`absolute xl:w-4 h-2 bg-gray-500 top-1/2 transform -translate-y-1/2 
                ${index % 2 === 0 ? "left-full" : "right-full"}`}
              ></div>
            )}

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-bold text-lg border-2 border-white">
              {index + 1}
            </div>

            <div
              className={`w-16 h-16 flex items-center justify-center mt-4 rounded-full border-4 transition-all duration-300 shadow-lg 
              ${
                totalRemarks >= milestone ||
                totalTaskDuration >= milestone * 100
                  ? "border-green-500 bg-green-600 animate-pulse"
                  : "border-gray-500 bg-gray-700"
              }`}
            >
              {(totalRemarks >= milestone ||
                totalTaskDuration >= milestone * 100) && (
                <FaCheckCircle className="text-white text-2xl" />
              )}
            </div>
            <span className="text-gray-900 font-semibold mt-2">
              Milestone {index + 1}
            </span>
            <p className="text-sm text-gray-700">Completed {milestone} tasks</p>
          </div>
        ))}
      </div>

      <p className="text-lg text-[#ab7beb] font-medium">
        ✅{" "}
        <span className="text-green-700 text-xl font-bold">
          {
            milestones.filter(
              (m) => totalRemarks >= m || totalTaskDuration >= m * 100
            ).length
          }
        </span>{" "}
        Milestones Completed!
      </p>
    </div>
  );
};

export default UserMilestone;
