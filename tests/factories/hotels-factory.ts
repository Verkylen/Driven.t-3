import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Hotel, Prisma, Room } from "@prisma/client";

export function createHotel(): Prisma.Prisma__HotelClient<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.business()
    }
  });
}

export function createRoom(hotelId: number): Prisma.Prisma__RoomClient<Room> {
  return prisma.room.create({
    data: {
      name: faker.company.bsBuzz(),
      capacity: Number(faker.random.numeric()),
      hotelId
    }
  });
}
