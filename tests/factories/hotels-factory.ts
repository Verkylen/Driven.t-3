import { prisma } from "@/config";
import faker from "@faker-js/faker";

export function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.business()
    }
  });
}
