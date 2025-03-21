# PWA Demo Website

This is a simple Progressive Web App (PWA) demonstration that showcases the key features of PWAs.

## Features

- Offline functionality
- Installable on home screen
- Online/offline status detection
- Push notifications
- Responsive design
- Service worker for caching

## How to Run

1. Clone or download this repository
2. Start the server:
   ```
   node server.js
   ```
3. Open your browser and navigate to `http://localhost:8080`

## Testing PWA Features

### Installation
- On Chrome/Edge: Look for the install icon in the address bar
- On mobile: Use "Add to Home Screen" option in the browser menu

### Offline Functionality
1. Load the website while online
2. Turn off your internet connection
3. Refresh the page - it should still work!
4. The online/offline status indicator will update automatically

### Push Notifications
1. Click the "Enable Notifications" button
2. Accept the browser's permission prompt
3. A test notification will be sent immediately
4. After enabling, the button changes to "Send Test Notification" for sending additional test notifications

## Third-Party Services

This demo uses Progressier for PWA capabilities:
- `<link rel="manifest" href="https://progressier.app/kGkxkUl6ECEFB6tgIWyC/progressier.json"/>`
- `<script defer src="https://progressier.app/kGkxkUl6ECEFB6tgIWyC/script.js"></script>`

## Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styles
- `app.js` - Main JavaScript file
- `sw.js` - Service Worker for offline functionality and push notifications
- `offline.html` - Offline fallback page
- `server.js` - Simple Node.js server for local testing
- `images/` - Directory containing PWA icons # pwa_demo
