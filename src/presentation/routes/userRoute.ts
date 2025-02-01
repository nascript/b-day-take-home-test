
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateUser } from "../middlewares/validateUser"

const router = Router();

router.post("/user", validateUser, UserController.createUser);
router.delete("/user/:id", UserController.deleteUser);
router.put("/user/:id", validateUser, UserController.updateUser);
router.get("/user/:id", UserController.getUser);
router.get("/users", UserController.listUsers);

export default router;
