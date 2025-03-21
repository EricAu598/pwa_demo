// DOM elements
const statusElement = document.getElementById('status');
const installButton = document.getElementById('install-btn');
const notificationButton = document.getElementById('notification-btn');
const notificationStatus = document.getElementById('notification-status');
const debugInfo = document.getElementById('debug-info');

// Check for online/offline status
function updateOnlineStatus() {
    if (navigator.onLine) {
        statusElement.textContent = 'Online';
        statusElement.style.color = '#4caf50';
    } else {
        statusElement.textContent = 'Offline';
        statusElement.style.color = '#f44336';
    }
}

// Initial status check
updateOnlineStatus();

// Add event listeners for online/offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Display debug information about notification permissions
function updateDebugInfo() {
    if (!('Notification' in window)) {
        debugInfo.textContent = 'Notifications API not available in this browser';
        return;
    }
    
    debugInfo.textContent = `Current permission state: ${Notification.permission}`;
    console.log('Notification permission state:', Notification.permission);
}

// Push Notification functionality
function updateNotificationStatus() {
    if (!('Notification' in window)) {
        notificationStatus.textContent = 'Push notifications not supported in this browser';
        notificationStatus.className = 'notification-status error';
        notificationButton.disabled = true;
        return;
    }
    
    updateDebugInfo();
    
    if (Notification.permission === 'granted') {
        notificationButton.textContent = 'Send Test Notification';
        notificationButton.classList.add('enabled');
        notificationStatus.textContent = 'Notifications enabled';
        notificationStatus.className = 'notification-status success';
    } else if (Notification.permission === 'denied') {
        notificationStatus.textContent = 'Notification permission denied. Please enable in browser settings.';
        notificationStatus.className = 'notification-status error';
        notificationButton.disabled = true;
    } else {
        // default state
        notificationButton.textContent = 'Enable Notifications';
        notificationStatus.textContent = '';
    }
}

// Request notification permission
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        notificationStatus.textContent = 'Notifications not supported';
        return;
    }
    
    console.log('Current permission before request:', Notification.permission);
    updateDebugInfo();
    
    if (Notification.permission === 'granted') {
        // Already granted, send a test notification
        sendTestNotification();
        return;
    }
    
    // For Safari and older browsers
    if (Notification.permission === 'default') {
        Notification.requestPermission()
            .then(function(permission) {
                console.log('Permission after request:', permission);
                updateDebugInfo();
                
                if (permission === 'granted') {
                    notificationStatus.textContent = 'Notifications enabled successfully!';
                    notificationStatus.className = 'notification-status success';
                    notificationButton.textContent = 'Send Test Notification';
                    notificationButton.classList.add('enabled');
                    // Force refresh of permission state
                    setTimeout(sendTestNotification, 500);
                } else {
                    notificationStatus.textContent = 'Notification permission not granted';
                    notificationStatus.className = 'notification-status error';
                }
            })
            .catch(function(error) {
                console.error('Error requesting permission:', error);
                notificationStatus.textContent = 'Error requesting permission';
                notificationStatus.className = 'notification-status error';
            });
    }
}

// Send a test notification
function sendTestNotification() {
    console.log('Attempting to send notification, permission state:', Notification.permission);
    updateDebugInfo();
    
    if (Notification.permission === 'granted') {
        try {
            // Try to show notification using the Notification API
            const notification = new Notification('PWA Demo Notification', {
                body: 'This is a test notification from your PWA!',
                icon: '/images/icon-192x192.png',
                badge: '/images/icon-192x192.png',
                tag: 'test-notification'
            });
            
            notification.onclick = function() {
                window.focus();
                notification.close();
            };
            
            // Display success message
            notificationStatus.textContent = 'Notification sent! Check your browser notifications.';
            notificationStatus.className = 'notification-status success';
            
            // If service worker is available, also try to send through service worker
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification('PWA Demo Notification', {
                        body: 'This is a test notification via Service Worker!',
                        icon: '/images/icon-192x192.png',
                        badge: '/images/icon-192x192.png',
                        tag: 'test-notification-sw'
                    });
                });
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            notificationStatus.textContent = 'Error sending notification: ' + error.message;
            notificationStatus.className = 'notification-status error';
        }
    } else {
        notificationStatus.textContent = 'Notification permission not granted: ' + Notification.permission;
        notificationStatus.className = 'notification-status error';
    }
}

// Add notification button click handler
notificationButton.addEventListener('click', function() {
    if (Notification.permission === 'granted') {
        sendTestNotification();
    } else {
        requestNotificationPermission();
    }
});

// Check notification status on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNotificationStatus();
    
    // Fix for Safari - check permission again after a delay
    setTimeout(function() {
        updateNotificationStatus();
        updateDebugInfo();
    }, 1000);
});

// PWA installation
let deferredPrompt;

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    installButton.classList.remove('hidden');
});

// Installation button click handler
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    // Show the installation prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
    // Hide the install button
    installButton.classList.add('hidden');
});

// Listen for the appinstalled event
window.addEventListener('appinstalled', (e) => {
    console.log('PWA was installed');
}); 