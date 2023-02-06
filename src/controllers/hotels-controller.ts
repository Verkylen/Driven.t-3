import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Hotel, Room } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {    
    const hotels: Hotel[] = await hotelsService.getHotels(req.userId as number);

    res.send(hotels);
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.status(httpStatus.NOT_FOUND).send(error);
    }
  
    if (error.name === "PaymentError") {
      res.status(httpStatus.PAYMENT_REQUIRED).send(error);
    }

    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  try {    
    const hotelWithRooms: Hotel & {Rooms: Room[];} = await hotelsService.getHotelById(req.userId as number, Number(req.params.hotelId));

    res.send(hotelWithRooms);
  } catch(error) {
    if (error.name === "NotFoundError") {
      res.status(httpStatus.NOT_FOUND).send(error);
    }
  
    if (error.name === "PaymentError") {
      res.status(httpStatus.PAYMENT_REQUIRED).send(error);
    }

    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
