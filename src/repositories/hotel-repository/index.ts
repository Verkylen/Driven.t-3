import { prisma } from "@/config";
import { Hotel, Ticket, TicketType, Room } from "@prisma/client";

async function findEnrollmentAndTicketByUserId(userId: number): Promise<(Ticket & {TicketType: TicketType;})[]> {
  return prisma.enrollment.findUnique({ where: { userId } })
    .Ticket({ include: { TicketType: true } });
}

async function selectHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function selectHotelById(id: number): Promise<Hotel & {Rooms: Room[];}> {
  return prisma.hotel.findUnique({
    where: { id },
    include: { Rooms: true }
  });
}

const hotelRepository = {
  findEnrollmentAndTicketByUserId,
  selectHotels,
  selectHotelById
};

export default hotelRepository;
