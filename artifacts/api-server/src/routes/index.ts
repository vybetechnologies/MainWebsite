import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingRouter from "./booking";
import storageRouter from "./storage";
import analyticsRouter from "./analytics";
import staffRouter from "./staff";
import applicationsRouter from "./applications";
import accountRouter from "./account";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingRouter);
router.use(storageRouter);
router.use(analyticsRouter);
router.use(staffRouter);
router.use(applicationsRouter);
router.use(accountRouter);

export default router;
