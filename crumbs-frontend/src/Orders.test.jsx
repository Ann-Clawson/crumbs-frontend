import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Orders } from "./Orders";

const mockOrders = [
  {
    id: 1,
    customer_first_name: "John",
    customer_last_name: "Doe",
    order_status: "Pending",
    payment_status: "Unconfirmed",
    delivery_status: "Not Sent",
    payment_type: "Unspecified",
    total_cost: 18.0,
    order_cookies: [{ cookie_id: 1, cookie_name: "Chocolate Chip", quantity: 3, price: 6.0 }],
  },
];

const mockUpdateOrder = jest.fn();
const mockFetchUserInventory = jest.fn();
const mockInventory = {
  "Chocolate Chip": { inventory: 10 },
};

describe("Orders Component", () => {
  beforeEach(() => {
    render(
      <Orders
        orders={mockOrders}
        updateOrder={mockUpdateOrder}
        fetchUserInventory={mockFetchUserInventory}
        inventory={mockInventory}
      />
    );
  });

  it("renders the order list", () => {
    // Check if the order list renders with the correct customer name
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("$18.00")).toBeInTheDocument();
  });

  it('opens the order details modal when "View Details" button is clicked', async () => {
    const viewDetailsButtons = screen.getAllByRole("button", { name: "View Details" });
    fireEvent.click(viewDetailsButtons[0]);

    // Wait for the modal to fully open by checking the presence of the title inside the modal
    await waitFor(
      () => {
        expect(
          screen.getByText((content, element) => content.includes("Order Details for") && content.includes("John Doe"))
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
