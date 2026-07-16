import { Router, type IRouter, type Request, type Response } from "express";
import { SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID } from "../lib/square-client";

const router: IRouter = Router();

/**
 * GET /api/config/public
 * Returns non-secret configuration the frontend needs at runtime.
 * Only expose identifiers — never the access token.
 */
router.get("/config/public", (_req: Request, res: Response): void => {
  res.json({
    squareApplicationId: SQUARE_APPLICATION_ID,
    squareLocationId: SQUARE_LOCATION_ID,
  });
});

export default router;
