import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingRouter from "./booking";
import storageRouter from "./storage";
import analyticsRouter from "./analytics";
import staffRouter from "./staff";
import applicationsRouter from "./applications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingRouter);
router.use(storageRouter);
router.use(analyticsRouter);
router.use(staffRouter);
router.use(applicationsRouter);

export default router;
