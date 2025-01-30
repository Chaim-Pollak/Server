import { Router } from "express";
import queries from "../controllers/managers.controller.js";
import queriesEmployees from "../controllers/employees.controller.js";
import verifyToken from "../middleware/verifyToken.midlleware.js";

const {
    signIn,
    signUp,
    update,
    deleteManager,
    getAllManagers,
    Auth,
    logOut,
    autocompleteManager,
} = queries;
const {
    employeeSignIn,
    employeeSignUp,
    validateEmail,
    updateEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployeeById,
} = queriesEmployees;
const router = Router();

//managers
router.post("/manager/signin", signIn);
router.get("/auth", verifyToken, Auth);
router.post("/manager/signup", signUp);
router.put("/manager/update/:id", update);
router.delete("/manager/delete/:id", deleteManager);
router.get("/manager/getallmanagers", getAllManagers);
router.get("/manager/logout", logOut);
// router.get("/searchmanager",searchManager)
router.get("/autocomplete", autocompleteManager);
router.get("/getemployeebyid/:id", getEmployeeById)
//employees
router.post("/employee/signin", employeeSignIn);
router.post("/employee/signup", employeeSignUp);
router.get("/validationEmail/:id", validateEmail);
router.put("/employee/update/:id", updateEmployee);
router.delete("/employee/delete/:id", deleteEmployee);
router.get("/employee/getallempolyees", getAllEmployees);

export default router;
