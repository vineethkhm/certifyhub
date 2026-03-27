# CertifyHub 🎓

CertifyHub is a production-ready, full-stack MERN application designed for the secure generation, management, and public verification of internship certificates.

## 🌟 Features

- **Public Search & Verification**: Students and employers can instantly look up a certificate's authenticity using a unique Certificate ID without needing an account.
- **Secure Admin Portal**: Protected role-based access for administrators to manage certificate issuance.
- **Batch Excel/CSV Upload**: Admins can seamlessly import hundreds of certificates in seconds using `.xlsx` or `.csv` files. Built-in validation natively blocks duplicate IDs and incomplete rows.
- **Dynamic Certificate Engine**: Bypasses external generic PDF tools. Certificates are generated seamlessly from the database directly onto a custom-built, realistic HTML/CSS template format utilizing custom typography.
- **High-Fidelity PDF Export**: Single-click conversion from the web-based certificate view to a perfectly scaled A4 standard printable PDF using `html2canvas` and `jsPDF`.
- **Bespoke UI styling**: Fully designed from scratch using Vanilla CSS to embrace a modern, premium, and dynamic dark mode aesthetic.

## 🛠️ Technology Stack

- **Frontend**: React.js (Bootstrapped intimately with Vite), Vanilla CSS Custom Themes, `axios` for API calls, `lucide-react` for iconography.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB & Mongoose ORM.
- **Authentication**: JWT (JSON Web Tokens) & `bcryptjs` password hashing.
- **File Parsing**: `multer` & `xlsx`.

## 🚀 Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) running on your system.

### 1. Clone & Install Dependencies

Open your terminal and install dependencies for both the `server` and `client`:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables

In the `server/` directory, create a `.env` file (if it doesn't already exist) and define:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/certifyhub
JWT_SECRET=supersecret_jwt_key_for_certifyhub_123
```

### 3. Start the Servers

You will run the client and the server simultaneously (in two separate terminal windows).

**Terminal 1 (Backend):**
```bash
cd server
npm run start 
# or use: node server.js
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be running on [http://localhost:5173](http://localhost:5173).

## 🔒 Usage & Admin Access

### Default Admin Credentials
When the database is newly initialized, you can seed or use the default administrator account to access the dashboard at `/login`:
- **Email:** `admin@certifyhub.com`
- **Password:** `password123`

### Uploading Certificates (Format)
When uploading Excel or CSV files in the Admin Dashboard, ensure your spreadsheet has exactly the following column headers (case-sensitive):
- `certificateId` (e.g., CH-2023-001)
- `studentName` (e.g., John Doe)
- `domain` (e.g., Full Stack Development)
- `startDate` (e.g., 2023-01-15)
- `endDate` (e.g., 2023-04-15)

## 📁 Project Structure

```text
certifyhub/
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI (Buttons, Toasts, Inputs)
│   │   │   └── certificate/     # Core printable certificate template 
│   │   ├── pages/               # Login, Admin Dashboard, Public Verification
│   │   ├── context/             # JWT Authentication state
│   │   ├── services/            # Axios API wrappers
│   │   └── styles/              # Global variables & responsive CSS resets
│   └── package.json
│
├── server/                      # Node.js/Express Backend
│   ├── config/                  # MongoDB Connection
│   ├── controllers/             # Auth logic & Excel parsing
│   ├── middleware/              # JWT verification & Multer handlers
│   ├── models/                  # Mongoose Schemas (User, Certificate)
│   ├── routes/                  # Express endpoints
│   ├── uploads/                 # Temporary dump-ground for uploaded files
│   ├── server.js 
│   └── package.json
│
└── README.md
```
