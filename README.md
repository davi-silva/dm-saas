# Web3 Message Signer & Verifier

This is a full-stack Web3 application that allows users to authenticate using a Dynamic.xyz embedded wallet (headless implementation), sign custom messages, and verify those signatures via a Node.js + Express backend.

## Features

- **Web3 Authentication**: Seamless login using Dynamic.xyz headless embedded wallets (email-based).
- **Message Signing**: Users can input a custom message and sign it directly from their connected wallet.
- **Signature Verification**: The signed message and signature are sent to a backend API for cryptographic verification.
- **Signer Identification**: The backend recovers the signer's address from the signature.
- **Local History**: A persistent history of signed messages and their verification results is maintained in the browser's local storage.
- **Responsive UI**: A clean and intuitive user interface built with Next.js and Tailwind CSS.

## Technologies Used

**Frontend**:

- Next.js (React 18+)
- Dynamic.xyz SDK (`@dynamic-labs/sdk-react-core`, `@dynamic-labs/ethereum`)
- Axios for API communication
- Tailwind CSS for styling

**Backend**:

- Node.js
- Express.js
- Ethers.js for cryptographic signature verification
- TypeScript

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A Dynamic.xyz project with an `environmentId`. You can create one at [app.dynamic.xyz/dashboard/developer](https://app.dynamic.xyz/dashboard/developer).

### 1. Clone the repository

```bash
git clone https://github.com/your-username/dm-saas.git
cd dm-saas
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server in development mode:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup

Navigate back to the root directory and then into the `frontend` directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

**Configure Dynamic.xyz Environment ID**:

Open `frontend/app/layout.tsx` and replace `"YOUR_ENVIRONMENT_ID"` with your actual Dynamic.xyz environment ID:

```typescript
<DynamicContextProvider
  settings={{
    environmentId: "YOUR_ENVIRONMENT_ID",
    walletConnectors: [EthereumWalletConnectors],
  }}
>
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:3000`.

## Usage

1.  **Access the Application**: Open your browser and navigate to `http://localhost:3000`.
2.  **Login**: Enter your email address to log in using the Dynamic.xyz embedded wallet.
3.  **Sign Message**: Once logged in, enter a custom message into the text area.
4.  **Verify Signature**: Click "Sign Message". The message will be signed by your wallet, sent to the backend for verification, and the result (validity and signer address) will be displayed.
5.  **History**: All signed messages and their verification results are automatically added to a local history. You can clear this history at any time.

## Trade-offs and Improvements

### Trade-offs

- **In-memory Session State (Backend)**: The backend uses in-memory session state (no database) for simplicity, as per requirements. In a production environment, a persistent storage solution (e.g., PostgreSQL, MongoDB, Redis) would be necessary.
- **Limited Error Handling (Frontend)**: While basic error handling is present, more comprehensive error states and user feedback could be implemented (e.g., toast notifications for signing/verification failures).

### Potential Improvements

- **Advanced UI/UX**: Further refinement of the UI with animations, better loading indicators, and more detailed success/error messages.
- **User Roles/Permissions**: Implement different user roles and permissions if the application were to grow in complexity.
- **Message Encryption**: Add functionality to encrypt messages before signing them for enhanced privacy.

## Test Suite

- **Backend**: Jest is used for unit and integration testing of the `/verify-signature` API endpoint.
- **Frontend**: Jest and React Testing Library are configured for testing React components.

## Bonus Features

- **Deployed Version**: A link to a deployed version of the application (e.g., Vercel for frontend, Render for backend).
  - Backend (onrender.com)
    - https://dm-saas.onrender.com/
  - Frontend (vercel)
    - https://dm-saas-psi.vercel.app/
