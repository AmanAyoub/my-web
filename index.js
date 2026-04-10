const express = require("express");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3080;
const profile = {
    name: "Aman Ayoub",
    title: "Full-Stack Developer",
    headline: "Building useful products from backend systems to polished interfaces.",
    bio: "Full-stack developer shipping scalable web experiences from Kabul, Afghanistan.",
    email: "ayoubamanullah@gmail.com",
    location: "Kabul, Afghanistan",
    company: {
        name: "Dimmi",
        url: "https://dimmi.app/"
    },
    socials: {
        github: "https://github.com/AmanAyoub",
        twitter: "https://x.com/amanayb",
        linkedIn: "https://www.linkedin.com/in/amanayoub/"
    }
};

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
    const personJsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        url: "https://amanayoub.com",
        image: "https://amanayoub.com/images/profile.jpg",
        jobTitle: profile.title,
        email: profile.email,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Kabul",
            addressCountry: "Afghanistan"
        },
        sameAs: [
            profile.socials.github,
            profile.socials.twitter,
            profile.socials.linkedIn
        ]
    });

    res.render('index', {
        profile,
        personJsonLd
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
