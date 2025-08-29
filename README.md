# 🪙 Project Nidhi

<div align="center">
  <img src="/public/nidhi-n.png" alt="Nidhi Logo" width="120" height="120">
  
  **Empowering Startups with Decentralized Funding**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Ethereum](https://img.shields.io/badge/Ethereum-Smart_Contracts-purple?style=flat&logo=ethereum)](https://ethereum.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-11.3.1-orange?style=flat&logo=firebase)](https://firebase.google.com/)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Smart Contract Integration](#-smart-contract-integration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

**Project Nidhi** (Sanskrit for "treasure") is a revolutionary blockchain-based crowdfunding platform that leverages the power of smart contracts for transparent, secure, and decentralized funding. The platform connects innovative startups with potential investors while providing token incentives and expert mentorship opportunities.

### Why Nidhi?

- **🔒 Transparent Funding**: All transactions are recorded on the blockchain for complete transparency
- **🤖 AI-Powered Validation**: Campaign proposals are validated using Google's Gemini AI to ensure quality and authenticity
- **💰 Smart Contract Security**: Funds are managed through secure Ethereum smart contracts
- **🌐 Decentralized**: No central authority controls the funding process
- **📱 Mobile-First**: Responsive design with dedicated mobile navigation

## ✨ Features

### 🚀 Campaign Management
- **Create Campaigns**: Users can create detailed crowdfunding campaigns with AI validation
- **Browse Projects**: Discover and explore trending projects
- **Real-time Tracking**: Monitor funding progress with live updates
- **Campaign Analytics**: View contribution history and statistics

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure user authentication with Google Sign-In
- **Wallet Integration**: MetaMask integration for blockchain transactions
- **OTP Verification**: Additional security layer for sensitive operations

### 💬 Community Features
- **Campaign Forums**: Interactive discussion forums for each campaign
- **Comments & Replies**: Nested commenting system for community engagement
- **User Profiles**: Manage campaigns and view contribution history

### 💳 Blockchain Integration
- **Ethereum Smart Contracts**: Secure fund management and distribution
- **MetaMask Support**: Seamless wallet integration
- **Real-time Transactions**: Live transaction tracking and confirmations

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component library

### Backend & Database
- **Firebase Authentication** - User management
- **Firestore** - NoSQL database
- **Next.js API Routes** - Server-side API endpoints
- **Google Gemini AI** - Campaign validation

### Blockchain
- **Ethers.js 6** - Ethereum interaction library
- **Smart Contracts** - Solidity-based contracts
- **MetaMask** - Wallet integration

### DevOps & Deployment
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **AWS ECR** - Container registry
- **Vercel** - Deployment platform

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask wallet extension
- Firebase project
- Google Gemini API access
- Ethereum testnet setup (Goerli, Sepolia, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vashishta-Mithra-Reddy/nidhi.git
   cd nidhi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables (see [Environment Variables](#-environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Smart Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Firebase Admin (for server-side operations)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Generate web app configuration
5. Create a service account for admin operations

### Smart Contract Deployment

1. Deploy the crowdfunding smart contract to your chosen Ethereum network
2. Update the `NEXT_PUBLIC_CONTRACT_ADDRESS` with your deployed contract address
3. Ensure the contract ABI matches the one used in the application

## 📜 Smart Contract Integration

The platform uses Ethereum smart contracts for secure fund management:

### Key Functions

- **`createListing(title, description, targetAmount)`**: Create a new campaign
- **`fundListing(listingId)`**: Contribute to a campaign
- **`closeListing(listingId)`**: Close a campaign (creator only)

### Contract Events

The application listens for blockchain events to update the UI in real-time:

- **CampaignCreated**: New campaign registered
- **ContributionMade**: New contribution received
- **CampaignClosed**: Campaign ended

## 📚 API Documentation

### Campaign Validation API

**Endpoint**: `POST /api/validate`

**Description**: Validates campaign proposals using Google Gemini AI

**Request Body**:
```json
{
  "title": "Campaign Title",
  "description": "Campaign Description", 
  "targetAmount": "10.5"
}
```

**Response**:
```json
{
  "isValid": true,
  "explanation": "AI validation explanation"
}
```

### Database Schema

#### Campaigns Collection
```javascript
{
  campaignId: number,
  title: string,
  description: string,
  targetAmount: string,
  amountRaised: number,
  creator: string, // Ethereum address
  userId: string, // Firebase UID
  isActive: boolean,
  createdAt: string,
  transactionHash: string
}
```

#### Contributions Collection
```javascript
{
  campaignId: number,
  contributorName: string,
  amount: number,
  timestamp: Timestamp
}
```

## 🚢 Deployment

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t nidhi-app .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 nidhi-app
   ```

### Kubernetes Deployment

1. **Update the deployment configuration**
   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   ```

### AWS ECR Deployment

The project includes automated deployment to AWS ECR. The Docker image is pushed to:
`748979174079.dkr.ecr.ap-south-1.amazonaws.com/nidhi:latest`

## 🤝 Contributing

We welcome contributions to Project Nidhi! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Include comments for complex logic
- Update documentation for new features

### Development Guidelines

- Test on multiple browsers and devices
- Ensure mobile responsiveness
- Verify blockchain integrations on testnets
- Follow security best practices for Web3 development

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the excellent React framework
- **Firebase** for authentication and database services
- **Ethereum Foundation** for blockchain infrastructure
- **Google** for the Gemini AI API
- **Tailwind CSS** for the styling framework

## 📞 Contact

**Project Maintainer**: [Vashishta Mithra Reddy](https://github.com/Vashishta-Mithra-Reddy)

For questions, suggestions, or support:
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/Vashishta-Mithra-Reddy/nidhi/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Vashishta-Mithra-Reddy/nidhi/discussions)

---

<div align="center">
  <p><strong>Built with ❤️ for the decentralized future</strong></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
