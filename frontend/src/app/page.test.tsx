import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import axios from "axios";

import { Signer } from "@/components/";

jest.mock("@dynamic-labs/sdk-react-core");
jest.mock("axios");

const mockUseDynamicContext = useDynamicContext as jest.Mock;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Signer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders login button when user is not authenticated", () => {
    mockUseDynamicContext.mockReturnValue({
      user: null,
      setShowAuthFlow: jest.fn(),
    });

    render(<Signer />);
    expect(screen.getByText("Login with Email")).toBeInTheDocument();
  });

  it("renders the main component when user is authenticated", () => {
    mockUseDynamicContext.mockReturnValue({
      user: { username: "test" },
      primaryWallet: { address: "0x123" },
    });

    render(<Signer />);
    expect(screen.getByText("Web3 Message Signer")).toBeInTheDocument();
    expect(screen.getByText("Connected as:")).toBeInTheDocument();
    expect(screen.getByText("0x123")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter the message you want to sign")
    ).toBeInTheDocument();
    expect(screen.getByText("Sign Message")).toBeInTheDocument();
  });

  it("signs a message and displays verification result", async () => {
    const mockSigner = {
      signMessage: jest.fn().mockResolvedValue("signed-message"),
    };
    const mockConnector = {
      getSigner: jest.fn().mockResolvedValue(mockSigner),
    };
    mockUseDynamicContext.mockReturnValue({
      user: { username: "test" },
      primaryWallet: { address: "0x123", connector: mockConnector },
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        isValid: true,
        signer: "0x123",
        originalMessage: "hello world",
      },
    });

    render(<Signer />);

    const messageInput = screen.getByPlaceholderText(
      "Enter the message you want to sign"
    );
    fireEvent.change(messageInput, { target: { value: "hello world" } });

    const signButton = screen.getByText("Sign Message");
    fireEvent.click(signButton);

    await waitFor(() => {
      expect(mockSigner.signMessage).toHaveBeenCalledWith({
        message: "hello world",
      });
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5000/verify-signature",
        {
          message: "hello world",
          signature: "signed-message",
        }
      );
    });
  });
});
