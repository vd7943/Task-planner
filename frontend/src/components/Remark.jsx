import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Remark = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [authUser, setAuthUser] = useAuth();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const userId = authUser._id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchTasksAndPlans = async () => {
      try {
        const [plansResponse, tasksResponse] = await Promise.all([
          axios.get(
            `https://task-planner-k097.onrender.com/plan/get-user-plan/${authUser._id}`,
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `https://task-planner-k097.onrender.com/task/${authUser._id}`,
            {
              withCredentials: true,
            }
          ),
        ]);

        const mergedTasks = [
          ...tasksResponse.data.map((task) => ({
            id: task._id,
            name: task.taskName,
          })),
          ...plansResponse.data.map((plan) => ({
            id: plan._id,
            name: plan.planName,
          })),
        ];

        setTasks(mergedTasks);
      } catch (error) {
        console.error("Error fetching tasks/plans:", error);
      }
    };

    fetchTasksAndPlans();
  }, []);

  const handleStarClick = (star) => {
    setRating(star);
    setValue("taskReview", star);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://task-planner-k097.onrender.com/remark/set-remark",
        { ...data, userId },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        const updatedUserRes = await axios.get(
          `https://task-planner-k097.onrender.com/user/${userId}`,
          { withCredentials: true }
        );
        if (updatedUserRes.data.user) {
          setAuthUser(updatedUserRes.data.user);
          localStorage.setItem(
            "User",
            JSON.stringify(updatedUserRes.data.user)
          );
        }
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-4 py-6 md:px-10">
      <h2 className="text-2xl md:text-4xl font-semibold">Remark</h2>
      <div className="w-full max-w-2xl bg-[#FFFFFF2B] p-6 rounded-lg shadow-lg mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-lg font-medium">Task Name</label>
            <select
              className="w-full p-2 border rounded-md outline-none"
              {...register("taskName", { required: true })}
            >
              <option value="" className="text-black">
                Select from your Tasks
              </option>
              {tasks.map((task) => (
                <option className="text-black" key={task.id} value={task.name}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium">Task Duration</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md outline-none"
              {...register("taskDuration", { required: true })}
            />
          </div>

          <div>
            <label className="block text-lg font-medium">Review</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={26}
                  className={`cursor-pointer ${
                    (hover || rating) >= star
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
            <input
              type="hidden"
              value={rating}
              {...register("taskReview", { required: true })}
            />
          </div>

          <div>
            <label className="block text-lg font-medium">
              Write Summary of Today Task
            </label>
            <textarea
              rows="4"
              className="w-full p-2 border rounded-md outline-none"
              placeholder="Write summary of today's task..."
              {...register("taskSummary", { required: true })}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#9D60EC] text-[#151025] text-lg py-2 rounded-md mt-4 hover:shadow-xl transform hover:scale-101 hover:bg-[#c095f8] duration-300 cursor-pointer"
          >
            Mark as Complete
          </button>
        </form>
      </div>
    </div>
  );
};

export default Remark;
