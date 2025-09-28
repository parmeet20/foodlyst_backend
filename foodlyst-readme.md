# 🍽️ Foodlyst Backend - Real-time Food Ordering Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

> 🚀 **A sophisticated, production-ready backend API for a real-time food ordering and marketplace platform with location-based services, WebSocket notifications, and wallet integration.**

---

## 🌟 **Why This Project Stands Out**

**Foodlyst** isn't just another food delivery backend - it's a **comprehensive ecosystem** that demonstrates advanced full-stack engineering capabilities:

- ⚡ **Real-time Architecture**: WebSocket-powered live notifications and location tracking
- 🎯 **Location Intelligence**: Geographic-based food offer discovery with distance calculations
- 💰 **Wallet Integration**: Built-in payment system with blockchain wallet connectivity
- 🏗️ **Enterprise-Grade**: Docker containerization, robust authentication, and scalable database design
- 🔐 **Security-First**: JWT authentication, input validation with Zod, and secure middleware

---

## 🎯 **Key Features & Business Logic**

### 🍕 **Food Marketplace**
- **Restaurant Management**: Multi-tenant platform for restaurant owners
- **Dynamic Food Offers**: Time-based availability with quantity management
- **Real-time Inventory**: Automatic quantity updates and availability tracking

### 🌍 **Location-Based Services**
- **Geographic Discovery**: Find food offers within 5km radius
- **Distance Calculations**: Haversine formula implementation for accurate location services
- **Proximity Notifications**: Alert nearby users about new food offers

### 💳 **Integrated Payment System**
- **Wallet Management**: Connect/disconnect wallet functionality
- **Transaction Tracking**: Complete audit trail of all financial transactions
- **Order Management**: End-to-end order lifecycle with status tracking

### 🔔 **Real-time Communication**
- **WebSocket Server**: Live notifications for orders, offers, and updates
- **Event-Driven Architecture**: Instant updates across the platform
- **Multi-client Support**: Handle multiple connections per user

---

## 🏗️ **Technical Architecture**

### **Core Stack**
```
┌─ Application Layer ──────────────────────────┐
│  Express.js + TypeScript + Middleware        │
├─ WebSocket Layer ───────────────────────────┤
│  Real-time Notifications & Location Tracking │
├─ Business Logic Layer ──────────────────────┤
│  Controllers + Services + Validators         │
├─ Data Access Layer ─────────────────────────┤
│  Prisma ORM + Database Models               │
└─ Infrastructure Layer ──────────────────────┘
   Docker + MySQL + Production Deployment
```

### **Database Schema (Prisma)**
Sophisticated relational database design with:
- **User Management**: Role-based access (USER/OWNER)
- **Restaurant Entities**: Geographic and business data
- **Food Offers**: Complex availability and pricing logic
- **Order System**: Complete transaction lifecycle
- **Notification System**: Event tracking and delivery

---

## 📡 **API Architecture**

### **RESTful Endpoints**

#### 👤 **User Management** (`/api/v1/user`)
- `GET /` - Get authenticated user profile
- `GET /:id` - Get user by ID
- `POST /register` - User registration with validation
- `POST /login` - JWT-based authentication
- `POST /connectwallet/:id` - Blockchain wallet integration
- `POST /disconnectwallet/:id` - Wallet disconnection

#### 🏪 **Restaurant Management** (`/api/v1/restaurant`)
- `GET /` - List all restaurants with location data
- `GET /:id` - Restaurant details and metrics
- `POST /create` - Restaurant registration (Owner only)

#### 🍔 **Food Offers** (`/api/v1/food-offer`)
- `GET /get/:id` - Specific food offer details
- `GET /:restaurantId` - All offers by restaurant
- `POST /create` - Create new food offer with availability

#### 🛒 **Order Management** (`/api/v1/order`)
- Complete order lifecycle management
- Payment integration with external systems
- Real-time status updates

#### 🤝 **Grab Orders** (`/api/v1/grab`)
- User order claiming system
- Quantity validation and reservation

#### 💰 **Transactions** (`/api/v1/transaction`)
- Financial transaction tracking
- Wallet balance management

#### 🔔 **Notifications** (`/api/v1/notification`)
- Real-time notification management
- User-specific notification history

---

## 🔧 **Advanced Technical Features**

### **Authentication & Security**
```typescript
// JWT-based authentication with middleware
const authMiddleware = (req, res, next) => {
  // Token validation and user context injection
}
```

### **WebSocket Real-time System**
```typescript
// Location-based real-time notifications
interface ClientInfo {
  socket: WebSocket;
  userId: number;
  role: "USER" | "OWNER";
  latitude: number;
  longitude: number;
}
```

### **Geographic Calculations**
```typescript
// Haversine formula for distance calculations
function getDistanceInKm(lat1, lon1, lat2, lon2): number {
  // Precise geographic distance calculations
}
```

### **Input Validation**
- **Zod Integration**: Type-safe request validation
- **Schema Enforcement**: Consistent data integrity
- **Error Handling**: Comprehensive error responses

---

## 🐳 **Production Deployment**

### **Docker Configuration**
```yaml
# Multi-container setup with Docker Compose
services:
  app:
    build: .
    ports: ["8080:8080"]
    depends_on: [mysql]
  
  mysql:
    image: mysql:latest
    volumes: [mysql-data:/var/lib/mysql]
```

### **Database Management**
- **Prisma Migrations**: Version-controlled schema evolution
- **Connection Pooling**: Optimized database performance
- **Transaction Support**: ACID compliance

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ or Bun runtime
- Docker & Docker Compose
- MySQL 8.0+

### **Quick Setup**
```bash
# Clone the repository
git clone https://github.com/parmeet20/foodlyst_backend.git
cd foodlyst_backend

# Install dependencies
npm install
# or
bun install

# Environment setup
cp .env.example .env
# Configure DATABASE_URL and JWT_SECRET

# Database setup
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
# or
bun run dev
```

### **Docker Deployment**
```bash
# One-command deployment
docker-compose up --build

# The application will be available at http://localhost:8080
```

---

## 📊 **Key Metrics & Performance**

### **Scalability Features**
- ⚡ **WebSocket Optimization**: Efficient connection management
- 🔄 **Database Indexing**: Optimized queries for location-based searches
- 📦 **Containerization**: Horizontal scaling ready
- 🌐 **CORS Configuration**: Cross-origin resource sharing for web clients

### **Code Quality**
- 📝 **TypeScript**: 100% type safety
- 🏗️ **Modular Architecture**: Separation of concerns
- 🧪 **Production Ready**: Error handling and logging
- 📋 **Documentation**: Self-documenting code structure

---

## 🎨 **API Examples**

### **User Registration**
```json
POST /api/v1/user/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```

### **Create Food Offer**
```json
POST /api/v1/food-offer/create
{
  "foodName": "Margherita Pizza",
  "type": "VEG",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "quantity": 50,
  "maxPerPerson": 2,
  "perQtyPrice": 299.99,
  "availableFrom": "2025-09-28T18:00:00Z",
  "availableTo": "2025-09-28T22:00:00Z"
}
```

### **WebSocket Connection**
```javascript
// Connect with authentication and location
const ws = new WebSocket(
  'ws://localhost:8080?token=JWT_TOKEN&lat=12.9716&lng=77.5946'
);

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  // Handle real-time notifications
};
```

---

## 🛠️ **Technology Decisions & Rationale**

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **TypeScript** | Type Safety | Reduces runtime errors, improves developer experience |
| **Express.js** | Web Framework | Mature, flexible, excellent middleware ecosystem |
| **Prisma** | Database ORM | Type-safe database access, excellent migration system |
| **WebSocket** | Real-time Communication | Low latency, bidirectional communication |
| **JWT** | Authentication | Stateless, scalable authentication mechanism |
| **Docker** | Containerization | Consistent deployment, easy scaling |
| **Zod** | Validation | Runtime type checking, excellent TypeScript integration |
| **Bun** | Runtime | Faster execution, built-in bundler and package manager |

---

## 🔮 **Future Enhancements**

### **Planned Features**
- 📱 **Mobile App Integration**: React Native/Flutter support
- 🤖 **AI Recommendations**: Machine learning-powered food suggestions
- 📈 **Analytics Dashboard**: Business intelligence and reporting
- 🔐 **Advanced Security**: OAuth2, rate limiting, API versioning
- 🌍 **Multi-language Support**: Internationalization
- 📊 **Real-time Analytics**: Live dashboard for restaurant owners

### **Scalability Roadmap**
- **Microservices Architecture**: Service decomposition
- **Message Queue Integration**: Redis/RabbitMQ for async processing
- **CDN Integration**: Asset delivery optimization
- **Load Balancing**: High availability setup

---

## 👨‍💻 **Developer Experience**

### **Code Organization**
```
src/
├── config/          # Environment and configuration
├── controller/      # Request handlers and business logic
├── middleware/      # Authentication and validation
├── routes/          # API route definitions
├── utils/           # Helper functions and utilities
├── validations/     # Input validation schemas
├── ws/              # WebSocket server and types
└── main.ts          # Application entry point
```

### **Development Tools**
- **Hot Reload**: Instant development feedback
- **Type Checking**: Real-time TypeScript validation
- **Database GUI**: Prisma Studio for data management
- **API Testing**: Comprehensive endpoint documentation

---

## 📈 **Business Impact**

This backend demonstrates capability to build **enterprise-grade applications** that solve real-world problems:

- 🎯 **Market Ready**: Complete food delivery ecosystem
- 💼 **Business Logic**: Complex inventory and pricing management
- 🔄 **Real-time Operations**: Live updates and notifications
- 💰 **Revenue Systems**: Integrated payment processing
- 📊 **Data-Driven**: Analytics and reporting capabilities

---

## 🤝 **Contributing & Contact**

### **Get In Touch**
- 💼 **LinkedIn**: [Connect for opportunities](https://linkedin.com/in/parmeet20)
- 📧 **Email**: Available for remote positions
- 🌐 **Portfolio**: [View more projects](https://github.com/parmeet20)

### **Skills Demonstrated**
- **Backend Development**: Node.js, TypeScript, Express.js
- **Database Design**: Prisma, MySQL, complex relationships
- **Real-time Systems**: WebSocket, event-driven architecture
- **API Design**: RESTful services, authentication, validation
- **DevOps**: Docker, containerization, deployment
- **Security**: JWT, input validation, middleware
- **Location Services**: Geographic calculations, proximity features

---

**Ready to discuss how this project demonstrates my capabilities for your remote development needs!** 🚀

---

*Built with ❤️ for scalable, real-time food delivery experiences*