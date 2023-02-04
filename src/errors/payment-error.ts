import { ApplicationError } from "@/protocols";

export function paymentRequiredError(): ApplicationError {
  return {
    name: "PaymentError",
    message: "You must pay in order to proceed",
  };
}
