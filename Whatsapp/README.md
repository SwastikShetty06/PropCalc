# WhatsApp Multi-Item Synchronous Sender

An automated WhatsApp messaging platform and REST API built with **Node.js**, **Express**, and **`whatsapp-web.js`**. It enables sending sequential, multi-item messages (text, PDF documents, images, and videos) to any target phone number with exact, configurable per-item delays (e.g., 2000ms).

---

## Features

- **Multi-Device LocalAuth Persistence**: Scans QR code once and caches credentials in `./.wwebjs_auth` for automatic reconnection.
- **Strict Sequential Dispatch**: Iterates through steps synchronously with guaranteed execution order and exact millisecond delays.
- **Mixed Media Support**:
  - Plain & formatted WhatsApp text messages
  - PDF documents (`MessageMedia.fromFilePath` or direct file uploads)
  - Images (JPEG, PNG, WEBP) with optional captions
  - Videos (MP4) with optional captions
- **Recipient Normalization & Validation**: Automatically formats numbers to international format (e.g. `919876543210@c.us`) and verifies registration on WhatsApp before starting dispatches.
- **Real-Time Live Web Dashboard**:
  - Modern responsive Tailwind CSS UI
  - Real-time connection status & dynamic QR code auto-refresh
  - Drag-and-drop / click-to-upload sequence builder with configurable delay sliders
  - 1-Click preset templates (*Welcome & Brochure*, *Invoice & Statement*, *Media Showcase*)
  - Server-Sent Events (SSE) live execution console with delay countdown timers and step highlighting
- **REST API & Multipart Support**: Fully scriptable via cURL, Python, Postman, or external microservices.

---

## Quick Start

### 1. Prerequisites
- Node.js v18+ (tested on Node.js v20+)
- npm or yarn

### 2. Installation
```bash
# Clone or navigate to the project directory
cd /Users/swastik/Documents/Office/Whatsapp

# Install dependencies
npm install
```

### 3. Run the Application
```bash
# Start server (default: port 3000)
npm start

# Or run in development mode with automatic reload
npm run dev
```

### 4. Access the Web Dashboard
Open your browser and navigate to:
```
http://localhost:3000
```
1. Scan the displayed QR Code using WhatsApp on your phone (**Settings &rarr; Linked Devices &rarr; Link a Device**).
2. Once connected, build your sequence, enter the recipient phone number, and click **"Send Sequence Now"**.

---

## REST API Reference

### 1. Check Connection Status
```http
GET /api/status
```
**Response:**
```json
{
  "success": true,
  "status": "READY",
  "isReady": true,
  "hasQR": false,
  "info": {
    "pushname": "John Doe",
    "phone": "919876543210",
    "platform": "Mac OS"
  }
}
```

---

### 2. Fetch Latest QR Code
```http
GET /api/qr
```
**Response:**
```json
{
  "success": true,
  "status": "QR_READY",
  "rawQR": "2@ABC...XYZ",
  "qrDataUrl": "data:image/png;base64,iVBORw0KGgoAAA..."
}
```

---

### 3. Validate Recipient Phone Number
```http
POST /api/validate-number
Content-Type: application/json

{
  "phone": "+91 98765 43210"
}
```
**Response:**
```json
{
  "success": true,
  "result": {
    "isValid": true,
    "cleanedNumber": "919876543210",
    "recipientId": "919876543210@c.us",
    "isRegistered": true
  }
}
```

---

### 4. Send Message Sequence (JSON)
```http
POST /api/send-sequence
Content-Type: application/json

{
  "recipient": "919876543210",
  "steps": [
    {
      "type": "text",
      "content": "Hello! Thank you for contacting us.",
      "delayMs": 2000
    },
    {
      "type": "file",
      "filePath": "./uploads/brochure.pdf",
      "caption": "Company Brochure",
      "delayMs": 3000
    },
    {
      "type": "text",
      "content": "Let us know if you have any questions!",
      "delayMs": 0
    }
  ]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Sequence execution started.",
  "jobId": "b1f13f1c-4b53-48ef-827c-9b168676bf0b",
  "totalSteps": 3,
  "recipient": "919876543210"
}
```

---

### 5. Send Message Sequence with File Uploads (Multipart / cURL)
```bash
curl -X POST http://localhost:3000/api/send-sequence \
  -F "recipient=919876543210" \
  -F 'steps=[
    {"type":"text","content":"Here is your monthly invoice:","delayMs":2000},
    {"type":"file","caption":"Invoice #1042","delayMs":1500},
    {"type":"text","content":"Please let us know once paid.","delayMs":0}
  ]' \
  -F "file_1=@/path/to/invoice.pdf"
```

---

### 6. Real-Time Job Progress (Server-Sent Events)
```http
GET /api/jobs/:jobId/events
```
Stream real-time log events, delay countdowns, and per-step progress:
```json
data: {"type":"step_start","stepIndex":0,"stepNumber":1,"totalSteps":3,"stepType":"text"}
data: {"type":"step_success","stepNumber":1,"totalSteps":3}
data: {"type":"delay_start","delayMs":2000,"nextStepNumber":2}
data: {"type":"finished","summary":{"success":true,"successfulSteps":3,"totalSteps":3,"durationMs":5120}}
```

---

## Directory Structure

```
.
├── src/
│   ├── server.js            # Express server, REST endpoints, Multer, SSE
│   ├── whatsappClient.js    # WhatsApp Web client manager with LocalAuth & Puppeteer
│   └── sequenceRunner.js    # Strict sequential execution engine with delays
├── public/
│   ├── index.html           # Tailwind CSS dashboard with responsive UI
│   └── app.js               # Frontend controller, QR polling, SSE client
├── uploads/                 # Storage for uploaded documents and media
├── .wwebjs_auth/            # Persistent WhatsApp Multi-Device session cache
├── package.json
└── README.md
```

---

## Safety & Best Practices
- Configurable per-step delays (default: 2000ms) prevent flooding and help comply with platform rate-limiting standards.
- Always include the international country code when entering recipient numbers.
