import express from "express";
import {
  addNewPlan,
  getAllPlans,
  getPlans,
  getTodayPlans,
  optForPlan,
} from "../controller/plan.controller.js";

const router = express.Router();

router.post("/add-plan", addNewPlan);
router.post("/opt-plan", optForPlan);
router.get("/get-plan/:role/:userType", getAllPlans);
router.get("/get-user-plan/:id", getPlans);
router.get("/get-today-plan/:id", getTodayPlans);

export default router;
