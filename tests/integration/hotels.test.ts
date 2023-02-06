import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createRoom, createTicket, createTicketType, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("Should return status code 401 when request is made without header authentication", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 401 when request is made without the Bearer", async () => {
    const token = await generateValidToken();

    const response = await server.get("/hotels").set("Authorization", token);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 401 when request is made without token", async () => {
    const response = await server.get("/hotels").set("Authorization", "Bearer");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 401 when token is invalid", async () => {
    const token = faker.lorem.word();  
        
    const response = await server.get("/hotels").set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 404 when there is no enrollment", async () => {
    const token = await generateValidToken();

    const response = await server.get("/hotels").set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("Should return status code 404 when there is no ticket", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server.get("/hotels").set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("Should return status code 404 when there are no hotels", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get("/hotels").set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("Should return status code 402 when the ticket was not paid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get("/hotels").set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("Should return status code 402 when the ticket does not include hotel", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = false;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get("/hotels").set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("Should return the hotel list according to the business roles", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const { id, name, image, createdAt, updatedAt } = await createHotel();

    const response = await server.get("/hotels").set("Authorization", "Bearer " + token);

    expect(response.body).toEqual([{ id, name, image, createdAt: createdAt.toISOString(), updatedAt: updatedAt.toISOString() }]);
  });
});

describe("GET /hotels/:hotelId", () => {
  it("Should return status code 401 when request is made without header authentication", async () => {
    const hotelId = faker.random.numeric();
    
    const response = await server.get("/hotels/" + hotelId);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 401 when request is made without the Bearer", async () => {
    const hotelId = faker.random.numeric();

    const token = await generateValidToken();

    const response = await server.get("/hotels/" + hotelId).set("Authorization", token);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 401 when request is made without token", async () => {
    const hotelId = faker.random.numeric();

    const response = await server.get("/hotels/" + hotelId).set("Authorization", "Bearer");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 401 when token is invalid", async () => {
    const hotelId = faker.random.numeric();

    const token = faker.lorem.word();  
        
    const response = await server.get("/hotels/" + hotelId).set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("Should return status code 404 when there is no enrollment", async () => {
    const hotelId = faker.random.numeric();

    const token = await generateValidToken();

    const response = await server.get("/hotels/" + hotelId).set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("Should return status code 404 when there is no ticket", async () => {
    const hotelId = faker.random.numeric();

    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server.get("/hotels/" + hotelId).set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("Should return status code 404 when the hotelId does not exists", async () => {
    const hotelId = faker.random.numeric();

    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get("/hotels/" + hotelId).set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("Should return status code 402 when the ticket was not paid", async () => {
    const hotelId = faker.random.numeric();

    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get("/hotels/" + hotelId).set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("Should return status code 402 when the ticket does not include hotel", async () => {
    const hotelId = faker.random.numeric();

    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = false;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get("/hotels/" + hotelId).set("Authorization", "Bearer " + token);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("Should return the hotel with your rooms according to the business roles", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(includesHotel);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const { id, name, image, createdAt, updatedAt } = await createHotel();
    const room = await createRoom(id);

    const response = await server.get("/hotels/" + id).set("Authorization", "Bearer " + token);

    expect(response.body).toEqual({
      id,
      name,
      image,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      Rooms: [{
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        hotelId: room.hotelId,
        createdAt: room.createdAt.toISOString(),
        updatedAt: room.updatedAt.toISOString()
      }]
    });
  });
});
