import { notFoundError, paymentRequiredError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";
import { Hotel, Ticket, TicketType } from "@prisma/client";

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

// async function getHotelById(userId: number) {
  
// }

const hotelsService = {
  getHotels,
//   getHotelById
};

export default hotelsService;
