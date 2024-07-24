import { render, screen } from "@testing-library/react";

import App from "./App";

it("render title", () => {
  render(<App />);
  expect(screen.getByText(/Phase Timeline Challenge/)).toBeInTheDocument();
});