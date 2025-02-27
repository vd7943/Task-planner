import React, { useState } from "react";
import { PiCoinBold } from "react-icons/pi";
import { useAuth } from "../context/AuthProvider";
import UserMilestone from "./UserMilestone";
import Dashboard from "./Dashboard";
import AppreciationList from "./AppreciationList";
import TodayTasks from "./TodayTasks";

const Home = () => {
  const [authUser, setAuthUser] = useAuth();
  return (
    <>
      {authUser.role === "User" && (
        <div className="relative flex-1 p-6 mt-8 lg:mt-0 lg:p-8 h-auto">
          <div className="absolute top-0 lg:top-4 right-4 flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 lg:px-6 py-2 rounded-full shadow-lg">
            <PiCoinBold className="text-lg font-semibold mr-2" />
            <span className="text-lg font-bold">{authUser.coins}</span>
          </div>

          <h2 className="text-xl lg:text-3xl pb-4 text-center lg:text-left">
            {authUser.userType} User
          </h2>
          <TodayTasks />

          <UserMilestone />

          <div className="flex flex-col lg:flex-row justify-center gap-6 mt-4">
            <AppreciationList />
          </div>
        </div>
      )}
      {authUser.role === "Admin" && <Dashboard />}
    </>
  );
};

export default Home;
