# 📊 Budget Tracker App

A simple and lightweight **budget tracking mobile app** built with **React Native** (using Expo) that allows you to log your daily expenses and store them directly in a connected **Google Sheet** via Apps Script API.

---

## ✨ Features

- 📅 Add daily expenses with date, category, and amount  
- ☁️ Save data directly to a Google Sheet  
- 📱 Optimized for Android (APK supported)  
- 🔐 No external database or login required  
- 🧠 Built using React Native (Expo) with simple UI

---

## 📸 Screenshots

*Coming soon*

---

## 🚀 Tech Stack

- **Frontend:** React Native (via [Expo](https://expo.dev/))  
- **Backend:** Google Apps Script API  
- **Storage:** Google Sheets  
- **Build System:** EAS (Expo Application Services)

---

## 🛠️ Installation

### 1. Clone the repository

Create a new Google Sheet
add three columns in row one as date, expense,amount

Open App Script Editor (Extensions > Apps Script)
remove the default empty funtion
Add this code:


function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  sheet.appendRow([data.date, data.expense, data.amount]);
  return ContentService.createTextOutput("Success");
}

Deploy the script:
Deploy > New Deployment > Web App

Execute as: Me

Who has access: Anyone --very important


Click Deploy and copy the Web App URL 

Copy `.env.example` to `.env` and set your Web App URL:
```
EXPO_PUBLIC_SHEET_API_URL=your google sheet api url
```
`.env` is gitignored — never commit your real URL. If this deployment URL is ever exposed publicly (e.g. pushed to a repo), redeploy the Apps Script as a **new** deployment to get a fresh URL and update `.env`.

```bash
git clone https://github.com/your-username/budget-tracker-app.git
cd budget-tracker-app
npm install
npx expo start
npm install -g eas-cli this is important


Made with ❤️ by Bhuiyash Kumar
