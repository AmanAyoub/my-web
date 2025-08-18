const express = require("express");
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3080;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Visitor tracking middleware
const trackVisitor = (req, res, next) => {
    // Skip tracking for static assets and favicon
    if (req.path.includes('.') && !req.path.includes('.html')) {
        return next();
    }

    const visitor = {
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        page: req.path,
        referrer: req.headers['referer'] || 'Direct',
        method: req.method
    };

    // Log to visitors.json file
    const logFile = path.join(__dirname, 'visitors.json');
    
    fs.readFile(logFile, 'utf8', (err, data) => {
        let visitors = [];
        if (!err && data) {
            try {
                visitors = JSON.parse(data);
            } catch (e) {
                visitors = [];
            }
        }
        
        visitors.push(visitor);
        
        // Keep only last 1000 entries to prevent file from getting too large
        if (visitors.length > 1000) {
            visitors = visitors.slice(-1000);
        }
        
        fs.writeFile(logFile, JSON.stringify(visitors, null, 2), (err) => {
            if (err) console.error('Error logging visitor:', err);
        });
    });
    
    next();
};

// Apply tracking middleware
app.use(trackVisitor);

// Main route
app.get('/', (req, res) => {
    res.render('index', {
        github: "https://github.com/AmanAyoub",
        twitter: "https://x.com/amanullah_ayoub",
        linkedIn: "https://www.linkedin.com/in/amanayoub/"
    });
});

// Simple analytics endpoint (protected - add authentication in production!)
app.get('/analytics', (req, res) => {
    const logFile = path.join(__dirname, 'visitors.json');
    
    fs.readFile(logFile, 'utf8', (err, data) => {
        if (err) {
            return res.json({ error: 'No visitor data available' });
        }
        
        try {
            const visitors = JSON.parse(data);
            const summary = {
                totalVisits: visitors.length,
                uniqueIPs: [...new Set(visitors.map(v => v.ip))].length,
                last24Hours: visitors.filter(v => 
                    new Date(v.timestamp) > new Date(Date.now() - 24*60*60*1000)
                ).length,
                recentVisitors: visitors.slice(-10).reverse()
            };
            res.json(summary);
        } catch (e) {
            res.json({ error: 'Error parsing visitor data' });
        }
    });
});

// Analytics dashboard view (add authentication in production!)
app.get('/analytics-dashboard', (req, res) => {
    res.render('analytics');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});