import { Router } from "express";
import managerQueries from "../controllers/managers.controller.js";
import employeeQueries from "../controllers/employees.controller.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const {
  signUp,
  signIn,
  Auth,
  logOut,
  update,
  deleteManager,
  getAllManagers,
  autocompleteManager,
} = managerQueries;

const {
  employeeSignUp,
  validateEmail,
  getEmployeeById,
  employeeSignIn,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
} = employeeQueries;

const router = Router();

//managers
router.post("/manager/signup", signUp);
router.post("/manager/login", signIn);
router.get("/auth", verifyToken, Auth);
router.get("/logout", logOut);
router.put("/manager/update/:id", update);
router.delete("/manager/delete/:id", deleteManager);
router.get("/manager/getAllManagers", getAllManagers);
router.get("/autocomplete", autocompleteManager);

//employees
router.post("/employee/signup", employeeSignUp);
router.get("/validationEmail/:id", validateEmail);
router.get("/getEmployeeById/:id", getEmployeeById);
router.post("/employee/signIn", employeeSignIn);
router.put("/employee/update/:id", updateEmployee);
router.delete("/employee/delete/:id", deleteEmployee);
router.get("/employee/getAllEmployees", getAllEmployees);

export default router;
