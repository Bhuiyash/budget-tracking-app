const fs = require('fs');
const path = require('path');

// Create HTML file that generates icons using Canvas
const iconGeneratorHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Budget Tracker Icon Generator</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        canvas { border: 2px solid #ddd; margin: 10px; border-radius: 8px; }
        .icon-section { margin: 30px 0; }
        h1, h2 { color: #3b82f6; }
        .download-btn { 
            background: #3b82f6; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 5px;
            font-size: 14px;
        }
        .download-btn:hover { background: #1d4ed8; }
        .instructions { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Budget Tracker App Icon Generator</h1>
        <p>Generate custom icons for your Budget Tracker app</p>

        <div class="icon-section">
            <h2>🔧 App Icon (1024x1024)</h2>
            <canvas id="appIcon" width="1024" height="1024"></canvas>
            <br>
            <button class="download-btn" onclick="downloadCanvas('appIcon', 'icon.png')">Download App Icon</button>
        </div>

        <div class="icon-section">
            <h2>📱 Adaptive Icon Foreground (1024x1024)</h2>
            <canvas id="adaptiveIcon" width="1024" height="1024"></canvas>
            <br>
            <button class="download-btn" onclick="downloadCanvas('adaptiveIcon', 'adaptive-icon.png')">Download Adaptive Icon</button>
        </div>

        <div class="icon-section">
            <h2>🌐 Favicon (32x32)</h2>
            <canvas id="favicon" width="32" height="32"></canvas>
            <br>
            <button class="download-btn" onclick="downloadCanvas('favicon', 'favicon.png')">Download Favicon</button>
        </div>

        <div class="icon-section">
            <h2>🚀 Splash Icon (400x400)</h2>
            <canvas id="splashIcon" width="400" height="400"></canvas>
            <br>
            <button class="download-btn" onclick="downloadCanvas('splashIcon', 'splash-icon.png')">Download Splash Icon</button>
        </div>

        <div class="instructions">
            <h3>📝 Instructions:</h3>
            <ol>
                <li>Click on each "Download" button to save the icon files</li>
                <li>Replace the existing files in your <code>assets/images/</code> folder</li>
                <li>The icons will automatically appear in your app and Android home screen</li>
            </ol>
            <p><strong>File locations:</strong></p>
            <ul>
                <li><code>icon.png</code> → <code>assets/images/icon.png</code></li>
                <li><code>adaptive-icon.png</code> → <code>assets/images/adaptive-icon.png</code></li>
                <li><code>favicon.png</code> → <code>assets/images/favicon.png</code></li>
                <li><code>splash-icon.png</code> → <code>assets/images/splash-icon.png</code></li>
            </ul>
        </div>
    </div>

    <script>
        // Create gradient
        function createGradient(ctx, x1, y1, x2, y2) {
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#1d4ed8');
            return gradient;
        }

        // Draw wallet icon
        function drawWalletIcon(canvas, size) {
            const ctx = canvas.getContext('2d');
            const scale = size / 1024; // Scale factor based on canvas size
            
            // Clear canvas
            ctx.clearRect(0, 0, size, size);
            
            // Background with gradient and rounded corners
            ctx.save();
            const radius = size * 0.15;
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, radius);
            ctx.fillStyle = createGradient(ctx, 0, 0, size, size);
            ctx.fill();
            ctx.restore();
            
            // Main wallet body
            ctx.save();
            const walletX = size * 0.15;
            const walletY = size * 0.25;
            const walletW = size * 0.7;
            const walletH = size * 0.45;
            const walletRadius = size * 0.04;
            
            ctx.beginPath();
            ctx.roundRect(walletX, walletY, walletW, walletH, walletRadius);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fill();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
            ctx.restore();
            
            // Wallet flap
            ctx.save();
            const flapH = size * 0.12;
            ctx.beginPath();
            ctx.roundRect(walletX, walletY, walletW, flapH, walletRadius);
            ctx.fillStyle = '#f1f5f9';
            ctx.fill();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5 * scale;
            ctx.stroke();
            ctx.restore();
            
            // Card slot
            ctx.save();
            const slotX = size * 0.72;
            const slotY = size * 0.42;
            const slotW = size * 0.08;
            const slotH = size * 0.16;
            ctx.beginPath();
            ctx.roundRect(slotX, slotY, slotW, slotH, size * 0.01);
            ctx.fillStyle = '#10b981';
            ctx.fill();
            ctx.restore();
            
            // Money symbol ($)
            ctx.save();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3 * scale;
            ctx.lineCap = 'round';
            
            const centerX = size * 0.45;
            const centerY = size * 0.48;
            
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(centerX, size * 0.34);
            ctx.lineTo(centerX, size * 0.38);
            ctx.moveTo(centerX, size * 0.58);
            ctx.lineTo(centerX, size * 0.62);
            
            // Horizontal lines (S shape)
            ctx.moveTo(size * 0.35, size * 0.40);
            ctx.lineTo(size * 0.52, size * 0.40);
            ctx.moveTo(size * 0.38, size * 0.44);
            ctx.lineTo(size * 0.55, size * 0.44);
            ctx.moveTo(size * 0.35, size * 0.52);
            ctx.lineTo(size * 0.52, size * 0.52);
            ctx.moveTo(size * 0.38, size * 0.56);
            ctx.lineTo(size * 0.55, size * 0.56);
            
            ctx.stroke();
            ctx.restore();
            
            // Decorative coins
            const coins = [
                { x: size * 0.25, y: size * 0.75, r: size * 0.04 },
                { x: size * 0.35, y: size * 0.78, r: size * 0.03 },
                { x: size * 0.32, y: size * 0.68, r: size * 0.025 }
            ];
            
            coins.forEach(coin => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
                ctx.fillStyle = '#fbbf24';
                ctx.fill();
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 1 * scale;
                ctx.stroke();
                ctx.restore();
            });
        }

        // Draw adaptive icon (foreground only, transparent background)
        function drawAdaptiveIcon(canvas, size) {
            const ctx = canvas.getContext('2d');
            const scale = size / 1024;
            
            // Clear canvas
            ctx.clearRect(0, 0, size, size);
            
            // Main wallet body (larger for adaptive)
            ctx.save();
            const walletX = size * 0.1;
            const walletY = size * 0.2;
            const walletW = size * 0.8;
            const walletH = size * 0.5;
            const walletRadius = size * 0.05;
            
            ctx.beginPath();
            ctx.roundRect(walletX, walletY, walletW, walletH, walletRadius);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fill();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 3 * scale;
            ctx.stroke();
            ctx.restore();
            
            // Wallet flap
            ctx.save();
            const flapH = size * 0.14;
            ctx.beginPath();
            ctx.roundRect(walletX, walletY, walletW, flapH, walletRadius);
            ctx.fillStyle = '#f1f5f9';
            ctx.fill();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
            ctx.restore();
            
            // Card slot
            ctx.save();
            const slotX = size * 0.78;
            const slotY = size * 0.4;
            const slotW = size * 0.09;
            const slotH = size * 0.18;
            ctx.beginPath();
            ctx.roundRect(slotX, slotY, slotW, slotH, size * 0.015);
            ctx.fillStyle = '#10b981';
            ctx.fill();
            ctx.restore();
            
            // Money symbol (larger)
            ctx.save();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 4 * scale;
            ctx.lineCap = 'round';
            
            const centerX = size * 0.5;
            
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(centerX, size * 0.31);
            ctx.lineTo(centerX, size * 0.36);
            ctx.moveTo(centerX, size * 0.61);
            ctx.lineTo(centerX, size * 0.66);
            
            // Horizontal lines
            ctx.moveTo(size * 0.35, size * 0.38);
            ctx.lineTo(size * 0.65, size * 0.38);
            ctx.moveTo(size * 0.38, size * 0.43);
            ctx.lineTo(size * 0.62, size * 0.43);
            ctx.moveTo(size * 0.38, size * 0.48);
            ctx.lineTo(size * 0.62, size * 0.48);
            ctx.moveTo(size * 0.38, size * 0.53);
            ctx.lineTo(size * 0.62, size * 0.53);
            
            ctx.stroke();
            ctx.restore();
        }

        // Simple icon for favicon and splash
        function drawSimpleIcon(canvas, size) {
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, size, size);
            
            // Background
            if (size > 50) { // Only for larger icons
                ctx.save();
                const radius = size * 0.15;
                ctx.beginPath();
                ctx.roundRect(0, 0, size, size, radius);
                ctx.fillStyle = createGradient(ctx, 0, 0, size, size);
                ctx.fill();
                ctx.restore();
            }
            
            // Simple wallet shape
            ctx.save();
            const walletX = size * 0.2;
            const walletY = size * 0.3;
            const walletW = size * 0.6;
            const walletH = size * 0.4;
            
            ctx.beginPath();
            ctx.roundRect(walletX, walletY, walletW, walletH, size * 0.08);
            ctx.fillStyle = size > 50 ? 'rgba(255, 255, 255, 0.9)' : '#3b82f6';
            ctx.fill();
            
            if (size > 50) {
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = Math.max(1, size * 0.005);
                ctx.stroke();
            }
            ctx.restore();
            
            // Simple $ symbol
            if (size > 32) {
                ctx.save();
                ctx.font = \`bold \${size * 0.3}px Arial\`;
                ctx.fillStyle = size > 50 ? '#3b82f6' : 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', size / 2, size / 2);
                ctx.restore();
            }
        }

        // Download function
        function downloadCanvas(canvasId, filename) {
            const canvas = document.getElementById(canvasId);
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }

        // Generate all icons when page loads
        window.onload = function() {
            // App Icon (1024x1024)
            const appIconCanvas = document.getElementById('appIcon');
            drawWalletIcon(appIconCanvas, 1024);
            
            // Adaptive Icon (1024x1024)
            const adaptiveIconCanvas = document.getElementById('adaptiveIcon');
            drawAdaptiveIcon(adaptiveIconCanvas, 1024);
            
            // Favicon (32x32)
            const faviconCanvas = document.getElementById('favicon');
            drawSimpleIcon(faviconCanvas, 32);
            
            // Splash Icon (400x400)
            const splashIconCanvas = document.getElementById('splashIcon');
            drawWalletIcon(splashIconCanvas, 400);
        };

        // Polyfill for roundRect if not available
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
    </script>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(path.join(__dirname, 'icon-generator.html'), iconGeneratorHTML);

console.log('🎨 Icon generator created!');
console.log('📁 Open "icon-generator.html" in your browser to generate custom icons');
console.log('💡 The generated icons will automatically replace your current app icons');
