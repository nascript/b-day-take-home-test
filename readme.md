# 📚 Birthday API Documentation


## ✅ Assessment Checklist

| **Requirement**                                             | **Status** | **Notes**                                  |
| :---------------------------------------------------------- | :--------- | :----------------------------------------- |
| API for Create & Delete Users                               | ✅         | Implemented with validation                |
| User fields: firstName, lastName, birthday, timezone, email | ✅         | All fields covered                         |
| Send birthday message at 9 AM local time                    | ✅         | Implemented with timezone support          |
| Integration with external email service                     | ✅         | Handled with retry & error management      |
| Retry mechanism for failed messages                         | ✅         | Exponential backoff with max 3 retries     |
| Handle service downtime & resend unsent messages            | ✅         | Scheduler checks for failed messages       |
| Prevent duplicate messages                                  | ✅         | Using `messageStatus` & `lastBirthdaySent` |
| PUT /user for updating user details                         | ✅         | Update implemented with validation         |
| Unit & Integration Tests                                    | ✅         | Jest with coverage reports                 |
| Scalable & maintainable architecture                        | ✅         | Clean Architecture applied                 |
| Birthday message recovery after downtime                    | ✅         | Pending messages retried after restart     |
| Exponential backoff with proper delay handling              | ✅         | Implemented with incremental delays        |

---

## 📦 Project Structure

```
├── src
│   ├── application
│   │   └── services
│   │       └── UserService.ts
|   |       └── BirthdayService.ts
│   ├── domain
│   │   └── models
│   │       └── User.ts
│   ├── infrastructure
│   │   ├── prismaClient.ts
│   │   ├── scheduler.ts
│   │   └── repositories
│   │       └── UserRepository.ts
│   ├── presentation
│   │   ├── controllers
│   │   │   └── UserController.ts
│   │   ├── middlewares
│   │   │   ├── errorHandler.ts
│   │   │   └── validateUser.ts
│   │   └── routes
│   │       └── userRoute.ts
│   ├── docs
│   │   └── swagger.ts
│   └── app.ts
│   └── index.ts
├── tests
│   ├── units
│   └── integration
├── prisma
│   └── schema.prisma
├── .env
├── package.json
└── tsconfig.json
```

---

## ⚙️ Tools & Libraries

- **TypeScript**: Strongly typed language for scalable applications.
- **Express**: Web framework for Node.js.
- **Prisma**: ORM for database interactions.
- **Node-Cron**: Task scheduler.
- **Jest**: Testing framework for unit and integration tests.
- **Supertest**: Library for testing HTTP endpoints.
- **Swagger UI Express**: Documentation for RESTful APIs.
- **Dotenv**: Load environment variables from `.env` file.
- **Moment-Timezone**: Handle timezone conversions.
- **TypeScript**: Strongly typed JavaScript.
- **Axios**: For making HTTP requests.
- **Express.js**: Web framework for Node.js.
- **Prisma**: ORM for PostgreSQL.

---

## 🚀 API Endpoints

### **1. Create User**

<details>
<summary>POST /api/user</summary>

- **Description:** Adds a new user to the system.
- **Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "birthday": "1991-02-03T17:30:00.123+07:00",
  "timezone": "Asia/Jakarta",
  "email": "john.doe@example.com"
}
```

- **Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1991-02-03T17:30:00.123+07:00",
    "timezone": "Asia/Jakarta",
    "email": "john.doe@example.com",
    "messageStatus": "pending",
    "retryCount": 0
  }
}
```

- **Status Codes:**
  - `201 Created`: User created successfully.
  - `400 Bad Request`: Invalid input.

</details>

### **2. Get User by ID**

<details>
<summary>GET /api/user/{id}</summary>

- **Description:** Retrieves user details by ID.
- **Path Parameter:** `id` (integer, required)

- **Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1991-02-03T17:30:00.123+07:00",
    "timezone": "Asia/Jakarta",
    "email": "john.doe@example.com",
    "messageStatus": "pending",
    "retryCount": 0
  }
}
```

- **Status Codes:**
  - `200 OK`: User retrieved successfully.
  - `404 Not Found`: User not found.

</details>

### **3. Update User**

<details>
<summary>PUT /api/user/{id}</summary>

- **Description:** Updates user information by ID.
- **Path Parameter:** `id` (integer, required)

- **Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "birthday": "1990-01-01T10:00:00.000Z",
  "timezone": "UTC",
  "email": "jane.smith@example.com"
}
```

- **Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1991-02-03T17:30:00.123+07:00",
    "timezone": "Asia/Jakarta",
    "email": "john.doe@example.com",
    "messageStatus": "pending",
    "retryCount": 0
  }
}
```

- **Status Codes:**
  - `200 OK`: User updated successfully.
  - `404 Not Found`: User not found.

</details>

### **4. Delete User**

<details>
<summary>DELETE /api/user/{id}</summary>

- **Description:** Deletes a user by ID.
- **Path Parameter:** `id` (integer, required)

- **Response:**

```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

- **Status Codes:**
  - `200 OK`: User deleted successfully.
  - `404 Not Found`: User not found.

</details>

### **5. List Users**

<details>
<summary>GET /api/users</summary>

- **Description:** Retrieves a paginated list of users.
- **Query Parameters:**

  - `page`: (integer, optional) - Page number.
  - `perPage`: (integer, optional) - Users per page.
  - `search`: (string, optional) - Search keyword.
  - `sortBy`: (string, optional) - `createdAt`, `firstName`, `lastName`.
  - `sortOrder`: (string, optional) - `asc`, `desc`.

- **Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "birthday": "1991-02-03T17:30:00.123+07:00",
      "timezone": "Asia/Jakarta",
      "email": "john.doe@example.com",
      "messageStatus": "pending",
      "retryCount": 0
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "total_page": 1
  }
}
```

- **Status Codes:**
  - `200 OK`: Users retrieved successfully.

</details>

---

## 🗃️ Database Schema (Prisma)

**`prisma/schema.prisma`**

```prisma
model User {
  id               Int      @id @default(autoincrement())
  firstName        String
  lastName         String
  birthday         DateTime
  timezone         String
  email            String   @unique
  lastBirthdaySent DateTime?
  messageStatus    String   @default("pending")
  retryCount       Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

```prisma
model MessageLog {
  id            Int      @id @default(autoincrement())
  userId        Int
  status        String
  scheduledTime DateTime
  sentTime      DateTime?

  user User @relation(fields: [userId], references: [id])
  }
```

---

## ✅ Testing

- **Unit Tests:** Jest + Supertest

![alt text](<Screenshot from 2025-02-02 22-50-17.png>)

- **Integration Tests:** Prisma Test Database + Jest
![alt text](<Screenshot from 2025-02-02 22-51-31.png>)

Run Unit Tests:

```bash
npm run test:unit
```

Run Integration Tests:

```bash
npm run test:integration
```

Run All Tests:

```bash
npm run test
```

---

## 📊 API Documentation (Swagger)

- Access via: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Swagger UI** for interactive API testing.

---

## 🚀 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run Prisma migrations:

```bash
npx prisma migrate dev
```

3. Start the server:

```bash
npm run dev
```

4. Access API:

- **API:** `http://localhost:3000/api`
- **Swagger Docs:** `http://localhost:3000/api-docs`


---

## ⏰ Scheduler Details

- **Birthday Message Scheduler:** Runs every minute to check for birthdays.
- **Retry Mechanism:** Retries failed messages every 5 minutes with exponential backoff.

**External API:**

- `POST https://email-service.digitalenvision.com.au/send-email`
- Payload:

```json
{
  "email": "john.doe@example.com",
  "message": "Hey, John Doe, it’s your birthday!"
}
```

- **Response:**

```json
{
  "status": "sent",
  "sentTime": "2025-02-01T15:50:09.885Z"
}
```

---

## 🗂️ Database Schema

### **User Model**

```prisma
model User {
  id               Int      @id @default(autoincrement())
  firstName        String
  lastName         String
  birthday         DateTime
  timezone         String
  email            String   @unique
  lastBirthdaySent DateTime?
  messageStatus    String   @default("pending")
  retryCount       Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### **MessageLog Model**

```prisma
model MessageLog {
  id            Int      @id @default(autoincrement())
  userId        Int
  status        String
  scheduledTime DateTime
  sentTime      DateTime?

  user User @relation(fields: [userId], references: [id])
}
```

---


## 📋 Final Notes

- **System handles thousands of birthday messages daily.**
- **Robust retry mechanism ensures message delivery reliability.**
- **Clean and scalable codebase for future feature extensions.**



---

## 🙌 Contribution

@nascript
