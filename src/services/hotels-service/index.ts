import { notFoundError, paymentRequiredError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import { Hotel, Room, Ticket, TicketType } from "@prisma/client";

async function getHotels(userId: number): Promise<Hotel[]> {  
  const enrollmentAndTicketUser: (Ticket & {
    TicketType: TicketType;
  })[] = await hotelRepository.findEnrollmentAndTicketByUserId(userId);  

  if (enrollmentAndTicketUser === null) {
    throw notFoundError();
  }

  if (enrollmentAndTicketUser.length === 0) {
    throw notFoundError();
  }

  if (enrollmentAndTicketUser[0].status !== "PAID") {
    throw paymentRequiredError();
  }

  if (enrollmentAndTicketUser[0].TicketType.includesHotel === false) {
    throw paymentRequiredError();
  }

  const hotels: Hotel[] = await hotelRepository.selectHotels();

  if (hotels.length === 0) {
    throw notFoundError();
  }
  
  return hotels;
}

async function getHotelById(userId: number, hotelId: number): Promise<Hotel & {Rooms: Room[];}> {
  const regex = new RegExp("^[1-9][0-9]*$");

  if (regex.test(hotelId.toString()) === false) {
    throw {
      name: "RequestError",
      message: "No result for this search!",
    };
  }

  const enrollmentAndTicketUser: (Ticket & {
    TicketType: TicketType;
  })[] = await hotelRepository.findEnrollmentAndTicketByUserId(userId);  

  if (enrollmentAndTicketUser === null) {
    throw notFoundError();
  }

  if (enrollmentAndTicketUser.length === 0) {
    throw notFoundError();
  }

  if (enrollmentAndTicketUser[0].status !== "PAID") {
    throw paymentRequiredError();
  }

  if (enrollmentAndTicketUser[0].TicketType.includesHotel === false) {
    throw paymentRequiredError();
  }

  const hotelWithRooms: Hotel & {
    Rooms: Room[];
  } = await hotelRepository.selectHotelById(hotelId);

  if (hotelWithRooms === null) {
    throw notFoundError();
  }
  
  return hotelWithRooms;
}

const hotelsService = {
  getHotels,
  getHotelById
};

export default hotelsService;
