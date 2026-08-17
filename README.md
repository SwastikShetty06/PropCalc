# PropCalc 🏢

**Offline Real Estate Agreement Value & Channel Partner Brokerage Calculator**

A high-performance Progressive Web App (PWA) built with **Next.js 15 (App Router)** and **TypeScript** designed for real estate developers, brokers, and property buyers.

---

## ✨ Features

- 📑 **Exact Cost Sheet Table**: Agreement Value (AGV), GST, Stamp Duty, Reg & Legal charges, Development charges, Car Parking, and Total in Rupees + Words.
- 📐 **Automated Development Charges**:
  - Carpet Area $< 700\text{ sq.ft} \implies ₹5,55,000$ (Flat lump sum).
  - Carpet Area $\ge 700\text{ sq.ft} \implies ₹800/\text{sq.ft}$.
- 🤝 **Channel Partner (CP) Brokerage**:
  - Calculated **strictly on Agreement Value (AGV)**.
  - Commission rate presets: 3.5% (0-5k sqft), 4.0% (5k-10k sqft), 4.5% (10k-15k sqft), 5.0% (15k+ sqft).
- 📈 **CP Brokerage Ladder**: Performance tier visualizer and partner incentives.
- 📁 **Project Legal Documents**: Clear record tracking for Developer Agreement, NOCs, Power of Attorney, LOI, and IOD.
- 📱 **100% Offline PWA**: Installable to home screen on iOS Safari and Android Chrome with instant offline caching.
- 📤 **Instant WhatsApp Share & PDF Print**: Formatted cost sheet messages ready to share with clients in one tap.
- 💾 **Offline Estimates Storage**: Save quotes locally to device memory.

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build Production Bundle
```bash
npm run build
```

---

## 📄 License
MIT License
