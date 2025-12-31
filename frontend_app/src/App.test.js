import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app navbar title", () => {
  render(<App />);
  const title = screen.getByText(/Presentation Builder Pro/i);
  expect(title).toBeInTheDocument();
});
