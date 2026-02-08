This is a comprehensive breakdown of the **Project JH** Authentication System. This architecture is designed for security, scalability, and that specific "fast chat" vibe.

---

# 🛡️ Project JH: Authentication System Documentation

## 🏗️ 1. Architecture Overview

The backend is built using a **Modular Express** architecture. Instead of putting all logic in one file, we separate concerns to make the code easier for **Javed & Himanshu** to maintain as the project grows.

### Key Components:

* **Express.js**: The web framework acting as the heart of the server.
* **Prisma 7 & PostgreSQL**: Our "Permanent Memory." Stores verified user data.
* **Redis**: Our "Short-term Memory." Used for lightning-fast OTP storage and expiration.
* **Zod**: The "Shield." Validates incoming data (phone numbers, passwords) before it reaches the database.
* **Argon2**: The "Safe." Hashes passwords using the 2026 industry-standard algorithm.
* **JWT (JSON Web Tokens)**: The "Access Badge." Allows users to stay logged in securely.

---

## 🔄 2. The Two-Step Authentication Flow

We chose a two-step flow to mirror real-world apps like WhatsApp, ensuring every user owns the number they register with.

### Step A: OTP Request (`/api/auth/request-otp`)

1. **Validation**: Zod checks if the `phoneNumber` follows the E.164 international standard.
2. **Generation**: The server creates a random 6-digit numeric code.
3. **Transient Storage**: The code is saved in **Redis** with a 300-second (5-minute) expiry.
4. **Mock Delivery**: During development, the OTP is logged to the server console (to be replaced by Twilio/SMS later).

### Step B: Verify & Register (`/api/auth/signup`)

1. **Integrity Check**: The user submits the OTP along with their `name` and `password`.
2. **Redis Verification**: The server fetches the stored OTP from Redis. If it's missing or doesn't match, the request is rejected.
3. **Database Check**: Prisma checks if the phone number is already registered in PostgreSQL.
4. **Security**: The password is hashed using **Argon2**.
5. **Persistence**: A new User record is created in the database.
6. **Session Initiation**: A JWT is generated and sent back via an **HTTP-only cookie** for maximum security against XSS attacks.

---

## 📂 3. File Structure & Responsibilities

| File | Responsibility |
| --- | --- |
| **`schema.prisma`** | Defines the `User` model with fields for `password`, `isOnline`, and `phoneNumber` indices. |
| **`auth.validation.ts`** | Contains Zod schemas to prevent "junk" data from entering the system. |
| **`auth.controller.ts`** | The "Brain." Contains the logic for processing OTPs and managing user accounts. |
| **`redis.ts`** | Manages the connection to the Redis Docker container. |
| **`prisma.ts`** | The database bridge used to interact with PostgreSQL. |

---

To help you build a professional **README**, I’ve broken down the logic for the three core authentication actions we implemented for **Project JH**. In this system, "Signup" is the overall process, while "Request OTP" and "Register" are the specific technical steps.

---

## 🔐 Authentication Logic: Step-by-Step

### 1. The OTP Request (The Identity Check)

Before a user can create an account, we must ensure they own the phone number they are providing.

* **Validation**: The system uses a **Zod schema** to verify the phone number follows the **E.164 international standard** (e.g., +91...).
* **OTP Generation**: A secure, random 6-digit numeric code is generated.
* **Redis Storage**: The code is saved in **Redis** using the phone number as the key. We set an **expiry of 300 seconds (5 minutes)** so the code automatically disappears, preventing old codes from being reused.
* **Mock Delivery**: Since we are in development, the code is logged to your **server terminal** instead of being sent via a paid SMS service like Twilio.

### 2. The Registration/Signup (The Account Creation)

Once the user has the code, they submit their full details to be saved permanently.

* **Verification**: The backend fetches the code from **Redis**. If the code is missing or incorrect, the process stops immediately to prevent "ghost" accounts.
* **Duplicate Prevention**: We use **Prisma** to check if the `phoneNumber` already exists in the PostgreSQL `User` table.
* **Secure Hashing**: We use **Argon2** to transform the plain-text password into a "hash". This ensures that even if the database is compromised, the actual passwords remain unreadable.
* **Data Persistence**: Prisma saves the new user with their hashed password and sets their default "About" status and "isOnline" flag.
* **Cleanup**: The OTP is deleted from Redis immediately after a successful signup to ensure it cannot be used a second time.

### 3. The Login (The Session Authority)

This allows existing users to access their accounts and start chatting.

* **Credential Search**: The system looks up the user in PostgreSQL via their unique `phoneNumber`.
* **Hash Comparison**: Because we used **Argon2**, we cannot "decrypt" the password. Instead, Argon2 takes the login attempt and compares it to the stored hash to see if they match.
* **Token Issuance**: If valid, the server signs a **JWT (JSON Web Token)** containing the user's ID.
* **Cookie Security**: The token is sent to the browser inside an **HTTP-Only Cookie**. This is a critical security layer that prevents malicious browser scripts (XSS) from stealing the user's session badge.

---

## 🛠️ The Tech Stack Components

| Component | Role in the System |
| --- | --- |
| **Express Router** | Manages the URL paths (`/signup`, `/login`) and directs them to the right logic. |
| **Zod** | Acts as a "Gatekeeper" that rejects malformed or empty data before it hits the database. |
| **Prisma 7** | The modern ORM that handles all high-speed queries to your PostgreSQL database. |
| **Redis** | A high-performance, in-memory store used specifically for temporary, expiring data like OTPs. |
| **Cookie-Parser** | Middleware that allows the Express server to "read" the secure cookies sent by the user's browser. |

---

**Now that the backend logic is documented, would you like me to help you write the `authMiddleware.ts`? This is the "Security Guard" that will protect your future chat routes to ensure only logged-in users can enter.**

---
