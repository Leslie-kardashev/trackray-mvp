# TrackRay Technical Overview for Backend Development

**Objective:** This document outlines the technical specifications for the backend services required to power the TrackRay frontend application. The target backend for this implementation is Django.

---

## 1. Data Models

The backend must expose resources corresponding to the following data models.

### 1.1. `Order` Model

This is the central model for the application.

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | String | Unique identifier for the order. | `"ORD-101"` |
| `driverId` | String | Foreign key to the `Driver` model. | `"DRV-001"` |
| `itemDescription` | String | A brief description of the package contents. | `"20 boxes of Grade A Cocoa Beans"` |
| `quantity` | Integer | The number of units in the order. | `20` |
| `status` | String (Enum) | The current state of the order. Must be one of: `Pending`, `Moving`, `Delivered`, `Returning`, `Cancelled`. | `"Pending"` |
| `pickup` | JSON/Object | An object representing the pickup location. See `Location` model. | `{"address": "Kumasi", "coords": {"lat": 6.68, "lng": -1.62}}` |
| `destination` | JSON/Object | An object representing the destination. See `Location` model. | `{"address": "Tema Port", "coords": {"lat": 5.66, "lng": -0.01}}` |
| `recipientName` | String | The name of the person or entity receiving the order. | `"Global Exporters Ltd"` |
| `recipientPhone` | String | The contact phone number for the recipient. | `"0302123456"` |
| `requestedDeliveryTime`| DateTime (ISO 8601) | *Optional.* The preferred time for delivery. | `"2024-07-28T14:00:00.000Z"` |
| `productPrice` | Decimal/Float | *Optional.* The price of the product if payment is on delivery. | `2500.00` |
| `completedAt` | DateTime (ISO 8601) | *Optional.* Timestamp for when the order status became `Delivered`, `Cancelled`, or `Returning`. | `"2025-09-19T02:00:51.805Z"` |
| `returnReason` | String | *Optional.* The reason selected by the driver for a return. | `"Customer Refused"` |
| `returnPhotoUrl` | String (URL) | *Optional.* URL to the stored photo of the returned item. | `"https://storage.example.com/returns/ORD-105.jpg"` |
| `confirmationMethod` | String (Enum) | The required proof of delivery. One of: `PHOTO`, `SIGNATURE`, `OTP`. | `"PHOTO"` |

#### 1.1.1. `Location` Sub-Model

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `address` | String | A human-readable address. | `"Tema Port"` |
| `coords` | JSON/Object | Geographic coordinates. | `{"lat": 5.6667, "lng": -0.0167}` |

### 1.2. `SOSMessage` Model

This model represents an alert sent by a driver.

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | String | Unique identifier for the message. | `"SOS-1690374600000"` |
| `driverId` | String | Foreign key to the `Driver` model. | `"DRV-001"` |
| `driverName` | String | The name of the driver sending the alert. | `"Kofi Anan"` |
| `timestamp` | DateTime (ISO 8601) | When the alert was sent. | `"2024-07-26T12:30:00.000Z"` |
| `message` | String | A human-readable description of the problem. | `"Heavy Traffic"` |
| `location`| String | *Optional.* The driver's last known location as a string. | `"N1 Highway, near Dzorwulu"` |
| `problemCode` | String (Enum) | A short code representing the issue. See section 3.4 for all codes. | `"TR"` |

---

## 2. API Endpoints

The following RESTful API endpoints are required by the frontend. Authentication should be handled for all endpoints, likely based on a driver's session/token.

### 2.1. Get Orders for Driver

- **Endpoint:** `GET /api/orders/`
- **Query Params:** `driver_id=<string>`
- **Description:** Fetches a list of all orders assigned to a specific driver.
- **Success Response (200 OK):**
  ```json
  [
    { "id": "ORD-101", ... },
    { "id": "ORD-102", ... }
  ]
  ```

### 2.2. Get Single Order

- **Endpoint:** `GET /api/orders/<order_id>/`
- **Description:** Fetches the complete details for a single order.
- **Success Response (200 OK):**
  ```json
  {
    "id": "ORD-101",
    "driverId": "DRV-001",
    "status": "Pending",
    ...
  }
  ```

### 2.3. Update Order Status

- **Endpoint:** `PATCH /api/orders/<order_id>/status/`
- **Description:** Updates the status of an order. This is a critical endpoint for tracking the delivery lifecycle.
- **Request Body:**
  ```json
  {
    "status": "Moving",
    "returnReason": "Customer Refused" // Optional, only for 'Returning' status
  }
  ```
- **Success Response (200 OK):**
  - Should return the updated order object.
  - When status changes to `Delivered`, `Cancelled`, or `Returning`, the backend must set the `completedAt` timestamp.

### 2.4. Confirm Delivery / Return

- **Endpoint:** `POST /api/orders/<order_id>/confirm/`
- **Description:** Used to submit the final proof of delivery or proof of return. The `Content-Type` for this endpoint might need to be `multipart/form-data` if handling file uploads directly, or JSON if sending Base64.
- **Request Body:**
  ```json
  {
    "method": "PHOTO", // Or "SIGNATURE", "OTP"
    "confirmationData": "data:image/jpeg;base64,..." // Base64 encoded string for photo/signature
  }
  ```
- **Backend Logic:**
  - If the `method` is `PHOTO` or `SIGNATURE`, the backend must decode the Base64 string, save it as an image file to a storage service (like S3), and store the resulting URL in the `returnPhotoUrl` field of the corresponding order.
- **Success Response (200 OK):**
  ```json
  { "success": true }
  ```

### 2.5. Send SOS Alert

- **Endpoint:** `POST /api/sos/`
- **Description:** Creates a new SOS alert record.
- **Request Body:**
  ```json
  {
    "driverId": "DRV-001",
    "driverName": "Kofi Anan",
    "message": "Burst/Flat Tire",
    "problemCode": "BT",
    "location": "Last known location: N1 Highway..."
  }
  ```
- **Success Response (201 Created):**
  - Should return the newly created `SOSMessage` object with its server-generated `id` and `timestamp`.

---

## 3. Business Logic & Enums

### 3.1. Order Status Flow

- An order starts as **`Pending`**.
- Driver starts the delivery, status becomes **`Moving`**.
- From `Moving`, it can become:
  - **`Delivered`**: After successful delivery confirmation.
  - **`Returning`**: If the driver initiates a return.
- An order can also be **`Cancelled`**.

### 3.2. Delivery Confirmation

- The `confirmationMethod` on the `Order` determines what the driver needs to do.
- The frontend handles capturing the photo/signature, encodes it to Base64, and sends it to the backend via the `confirm` endpoint.

### 3.3. Return Reasons

When a driver initiates a return (`PATCH` to `/status/` with `status: "Returning"`), one of the following `returnReason` strings should be included:
- `Recipient Damaged`
- `Incorrect Item`
- `Incorrect Quantity`
- `Payment Failed`
- `Customer Refused`

### 3.4. SOS Problem Codes (TCAS)

The `problemCode` for an `SOSMessage` will be one of the following:
- **Critical:** `BT`, `MF`, `FS`, `SOS`
- **Blockage:** `TR`, `NP`, `AC`
- **External:** `PD`, `BW`
- **Customer:** `CU`, `SC`
