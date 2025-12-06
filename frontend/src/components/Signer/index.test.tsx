import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Signer from "../Signer";

jest.mock("axios");
jest.mock("@dynamic-labs/sdk-react-core", () => ({
  useDynamicContext: jest.fn(),
}));

const mockUseDynamicContext = useDynamicContext as jest.Mock;

describe("Signer", () => {
  const mockSigner = {
    signMessage: jest.fn().mockResolvedValue("mocked_signature"),
  };
  const mockConnector = {
    getSigner: jest.fn().mockResolvedValue(mockSigner),
  };
  const mockPrimaryWallet = {
    address: "0x1234567890123456789012345678901234567890",
    connector: mockConnector,
  };

  beforeEach(() => {
    mockUseDynamicContext.mockReturnValue({
      primaryWallet: mockPrimaryWallet,
    });
    localStorage.clear();
  });

  it("renders the component", () => {
    render(<Signer />);
    expect(screen.getByText("Sign a New Message")).toBeInTheDocument();
  });

  it("allows typing a message", () => {
    render(<Signer />);
    const textarea = screen.getByPlaceholderText(
      "Enter the message you want to sign"
    );
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    expect(textarea).toHaveValue("Hello, world!");
  });

  it("disables the sign button when no message is entered", () => {
    render(<Signer />);
    const button = screen.getByText("Sign Message");
    expect(button).toBeDisabled();
  });

  it("enables the sign button when a message is entered", () => {
    render(<Signer />);
    const textarea = screen.getByPlaceholderText(
      "Enter the message you want to sign"
    );
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    const button = screen.getByText("Sign Message");
    expect(button).toBeEnabled();
  });

  it("signs a message and displays the result", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        isValid: true,
        signer: "0x1234567890123456789012345678901234567890",
      },
    });

    render(<Signer />);
    const textarea = screen.getByPlaceholderText(
      "Enter the message you want to sign"
    );
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    const button = screen.getByText("Sign Message");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Signature is Valid")).toBeInTheDocument();
    });

    expect(mockSigner.signMessage).toHaveBeenCalledWith({
      message: "Hello, world!",
    });
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/verify-signature",
      {
        message: "Hello, world!",
        signature: "mocked_signature",
      }
    );
  });

  it("displays an error if signing fails", async () => {
    mockSigner.signMessage.mockRejectedValue(new Error("Signing failed"));

    render(<Signer />);
    const textarea = screen.getByPlaceholderText(
      "Enter the message you want to sign"
    );
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    const button = screen.getByText("Sign Message");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Signing failed")).toBeInTheDocument();
    });
  });

  it("clears the history", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        isValid: true,
        signer: "0x1234567890123456789012345678901234567890",
      },
    });

    render(<Signer />);
    const textarea = screen.getByPlaceholderText(
      "Enter the message you want to sign"
    );
    fireEvent.change(textarea, { target: { value: "Hello, world!" } });
    const button = screen.getByText("Sign Message");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Signing History")).toBeInTheDocument();
    });

    const clearButton = screen.getByText("Clear History");
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText("Signing History")).not.toBeInTheDocument();
    });
  });
});
