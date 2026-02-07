# Backend - Blockchain Skins Marketplace

This is the backend server for the Blockchain Skins Marketplace. It provides REST API endpoints for user authentication, skin management, and campaign management, and listens to blockchain events to sync data with MongoDB.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Skin Management**: CRUD operations for game skins stored in MongoDB
- **Campaign Management**: Create and manage crowdfunding campaigns
- **Blockchain Integration**: Listens to smart contract events and syncs data
- **MongoDB Storage**: All data (users, skins, campaigns) stored in MongoDB

## Architecture

The backend follows the MVC pattern:

```
backend/
├── config/           # Configuration files
│   ├── db.js        # MongoDB connection
│   └── contracts.js # Smart contract ABIs and addresses
├── controllers/      # Business logic
│   ├── authController.js
│   ├── skinController.js
│   └── campaignController.js
├── middleware/       # Express middleware
│   └── authMiddleware.js
├── models/          # Mongoose models
│   ├── User.js
│   ├── Skin.js
│   └── Campaign.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── skinRoutes.js
│   └── campaignRoutes.js
├── blockchainListener.js  # Event listener
└── server.js        # Main entry point
```

## Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (running locally or remote)
- Deployed smart contracts (SteamToken, Crowdfunding, SkinPayment)

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skinsDB
JWT_SECRET=your_secret_key_here

# Blockchain Configuration
RPC_URL=http://127.0.0.1:8545
CROWDFUNDING_ADDRESS=0xYourCrowdfundingAddress
SKIN_PAYMENT_ADDRESS=0xYourSkinPaymentAddress
STEAM_TOKEN_ADDRESS=0xYourSteamTokenAddress
```

3. Ensure MongoDB is running:
```bash
# If using local MongoDB
mongod
```

4. Start the server:
```bash
node server.js
# Or with nodemon for development
nodemon server.js
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Returns: `{ "token": "jwt_token_here" }`

#### Connect Wallet
```http
POST /api/auth/connect-wallet
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "walletAddress": "0xYourWalletAddress"
}
```

### Skins

#### Get All Skins
```http
GET /api/skins
```

#### Create Skin (Admin)
```http
POST /api/skins
Content-Type: application/json

{
  "name": "AWP Dragon Lore",
  "priceSTM": 1000,
  "description": "Legendary AWP skin",
  "image": "https://example.com/image.png"
}
```

#### Buy Skin
```http
POST /api/skins/buy
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "skinId": "mongodb_skin_id",
  "transactionHash": "0xTransactionHash"
}
```

#### Get Owned Skins
```http
GET /api/skins/owned
Authorization: Bearer YOUR_JWT_TOKEN
```

### Campaigns

#### Get All Campaigns
```http
GET /api/campaigns
```

#### Create Campaign
```http
POST /api/campaigns
Content-Type: application/json

{
  "title": "Fund AWP Dragon Lore",
  "goal": 10,
  "deadline": "2024-12-31T23:59:59Z",
  "creator": "0xCreatorAddress"
}
```

#### Attach Blockchain ID
```http
PUT /api/campaigns/:id/blockchain
Content-Type: application/json

{
  "blockchainId": 1
}
```

## Blockchain Event Listening

The backend automatically listens to two blockchain events:

### CampaignCreated
When a campaign is created on the blockchain, it's automatically saved to MongoDB.

### SkinPurchased
When a skin is purchased on the blockchain, the ownership in MongoDB is updated to the buyer's address.

## Data Flow

### Buying a Skin

1. Frontend: User calls `buySkin()` on SkinPayment contract
2. Smart Contract: Emits `SkinPurchased` event
3. Backend Listener: Catches the event
4. Backend: Updates skin ownership in MongoDB
5. Frontend: Queries updated data from backend

### Creating a Campaign

1. Frontend: User calls backend API to create campaign record
2. Backend: Saves campaign to MongoDB
3. Frontend: User calls `createCampaign()` on smart contract
4. Smart Contract: Emits `CampaignCreated` event  
5. Backend Listener: Updates campaign with blockchain ID

## Security

- Passwords are hashed with bcryptjs
- JWT tokens expire after 1 hour
- Protected routes require valid JWT token
- Environment variables for sensitive data
- Input validation on all endpoints

## Development

### Running with Nodemon
```bash
npm install -g nodemon
nodemon server.js
```

### Testing the API

You can use tools like:
- Postman
- curl
- Thunder Client (VS Code extension)
- Insomnia

Example curl request:
```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get skins
curl http://localhost:5000/api/skins
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env

### Blockchain Listener Not Working
- Verify contract addresses in .env
- Ensure RPC_URL is correct and accessible
- Check that smart contracts are deployed

### JWT Token Invalid
- Check JWT_SECRET is set in .env
- Ensure token is passed in Authorization header

## License

MIT
