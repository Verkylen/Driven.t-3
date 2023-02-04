import { getHotels, getHotelById } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter: Router = Router();

hotelsRouter
  .use(authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getHotelById);

export default hotelsRouter;
