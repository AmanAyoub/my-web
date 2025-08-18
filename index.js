const express = require("express");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3080;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
    res.render('index', {
        github: "https://github.com/AmanAyoub",
        twitter: "https://x.com/amanullah_ayoub",
        linkedIn: "https://www.linkedin.com/in/amanayoub/"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});