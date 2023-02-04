import { prisma } from "@/config";
import { Hotel, Ticket, TicketType } from "@prisma/client";

async function findEnrollmentAndTicketByUserId(userId: number): Promise<(Ticket & {TicketType: TicketType;})[]> {
  return prisma.enrollment.findUnique({ where: { userId } })
    .Ticket({ include: { TicketType: true } });
}

async function selectHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

const hotelRepository = {
  findEnrollmentAndTicketByUserId,
  selectHotels
};

export default hotelRepository;
