# Simple Wallet Service (NestJS)

A simple wallet backend service built with **NestJS** and **TypeScript**.  
This project was created as part of a backend take-home test to demonstrate clean API design, business logic implementation, validation, error handling, and basic system design considerations.

---

## Features

- Create wallets
- Fund wallets
- Transfer funds between wallets
- Prevent negative balances
- Transaction history per wallet
- Idempotent fund and transfer operations
- In-memory data storage
- Unit tests
- Postman collection for API testing

---

## Tech Stack

- **NestJS**
- **TypeScript**
- **Node.js**
- **Jest** (unit testing)
- **Postman** (API testing)

---

## Setup Instructions

1️. Prerequisites

- Node.js (v18+ recommended)
- npm
- Git

---

2️. Clone the Repository

```
git clone https://github.com/wizzfi1/Simple_Wallet.git
cd Simple_Wallet
```

3️. Install Dependencies
```
npm install
```

4️. Run the Application (Development)
```
npm run start:dev
```


The server will start on:
```
http://localhost:3000
```


5️. Run Unit Tests
```
npm run test
```

## Postman Collection

A Postman collection is provided to test all API endpoints, including happy paths and negative cases.

How to Use

1. Open Postman (desktop or web)

2. Import the file:

```
simple-wallet.postman_collection.json
```

3. Set the collection variable:

| Variable | Value                                          |
| -------- | ---------------------------------------------- |
| baseUrl  | [http://localhost:3000](http://localhost:3000) |


4. Run requests in this order:

-Create Wallet (twice)

-Fund Wallet

-Transfer Funds

-Get Wallet Details

Postman scripts automatically store wallet IDs for reuse.

## API Endpoints
1️. Create Wallet

POST /wallets
```
{
  "currency": "USD"
}
```

Response
```
{
  "id": "uuid",
  "currency": "USD",
  "balance": 0
}
```

2️. Fund Wallet

POST /wallets/:id/fund

Headers
```
Idempotency-Key: fund-<unique-key>
```

Body
```
{
  "amount": 100
}
```

Response
```
{
  "id": "uuid",
  "currency": "USD",
  "balance": 100
}
```
3️. Transfer Funds

POST /wallets/transfer

Headers
```
Idempotency-Key: transfer-<unique-key>
```

Body
```
{
  "fromWalletId": "uuid",
  "toWalletId": "uuid",
  "amount": 50
}
```

Response
```
{
  "status": "success"
}
```
4️. Get Wallet Details

GET /wallets/:id

Response
```
{
  "wallet": {
    "id": "uuid",
    "currency": "USD",
    "balance": 50
  },
  "transactions": [
    {
      "id": "uuid",
      "type": "FUND",
      "amount": 100
    },
    {
      "id": "uuid",
      "type": "TRANSFER",
      "amount": 50
    }
  ]
}
```

## Validation & Error Handling

-Negative funding amounts are rejected

-Transfers that cause negative balances are blocked

-Transfers to the same wallet are rejected

-Non-existent wallets return appropriate errors

-Meaningful HTTP status codes are returned

## Idempotency

Funding and transfer endpoints support idempotency via the Idempotency-Key request header.

-Reusing the same idempotency key will not reapply the operation

-This prevents duplicate balance updates caused by retries or double submissions

-Idempotency is implemented in-memory for simplicity


## Assumptions Made

-Only one currency (USD) is supported

-Data is stored in memory, so all data is lost on server restart

-This is acceptable for demonstration purposes

-Authentication and authorization are out of scope


## Scaling & Production Considerations

In a production environment, the following improvements would be made:

1️. Persistent Storage

-Replace in-memory maps with a database (PostgreSQL, MySQL)

-Wallets and transactions stored persistently

2️. Transactions & Concurrency

-Use database transactions to ensure atomic balance updates

-Apply row-level locking to prevent race conditions

3️. Idempotency at Scale

-Store idempotency keys in Redis or database

-Add expiration (TTL) to idempotency keys

4️. Horizontal Scaling

-Stateless NestJS instances behind a load balancer

-Shared database and Redis for consistency

5️. Security

-Add authentication (JWT)

-Input sanitization and rate limiting

-Audit logging for financial operations


## Testing

-Unit tests cover wallet creation, funding, transfers, and error cases

-Postman tests cover happy paths and negative scenarios