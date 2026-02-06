import { signin, signup } from "../controllers/authController.js";
import { Router } from "express";

const router: Router = Router();

router.post("/api/v1/auth/signup", signup);
router.post("/api/v1/auth/signin", signin);

export default router;
