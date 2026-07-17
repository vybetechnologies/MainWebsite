import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingRouter from "./booking";
import storageRouter from "./storage";
import analyticsRouter from "./analytics";
import staffRouter from "./staff";
import applicationsRouter from "./applications";
import accountRouter from "./account";
import configRouter from "./config";
import paymentsRouter from "./payments";
import catalogRouter from "./catalog";
import invoicesRouter from "./invoices";
import unsubscribeRouter from "./unsubscribe";
import partnersRouter from "./partners";
import newsroomRouter from "./newsroom";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingRouter);
router.use(storageRouter);
router.use(analyticsRouter);
router.use(staffRouter);
router.use(applicationsRouter);
router.use(accountRouter);
router.use(configRouter);
router.use(paymentsRouter);
router.use(catalogRouter);
router.use(invoicesRouter);
router.use(unsubscribeRouter);
router.use(partnersRouter);
router.use(newsroomRouter);

export default router;
