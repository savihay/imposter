# Imposter! - משחק המתחזה

## Overview
A Hebrew party game web app where players try to identify the "imposter" — the one player who doesn't know the secret word. Built as a static PWA (Progressive Web App) hosted on GitHub Pages.

## Tech Stack
- **HTML/CSS/JS** — vanilla, no frameworks
- **PWA** — installable with offline support via service worker
- **Hosting** — GitHub Pages (https://savihay.github.io/imposter/)
- **Font** — Rubik (Google Fonts)

## Project Structure
```
imposter/
├── index.html          # Single-page app with all game screens
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (network-first caching)
├── css/
│   └── style.css       # All styling (light cream/blue theme, RTL)
├── js/
│   ├── app.js          # Game logic & screen management
│   └── topics.js       # Topic loading & random word selection
├── icons/
│   ├── icon-192.png    # App icon 192x192
│   └── icon-512.png    # App icon 512x512
└── topics/             # Each JSON file = one topic
    ├── index.json      # Manifest listing all topic filenames
    ├── animals.json
    ├── food.json
    ├── countries.json
    ├── professions.json
    └── sports.json
```

## Game Flow
1. **Title** — logo + start button
2. **Setup** — player count (3-20), optional names, topic selection
3. **Word Reveal** — each player press-and-holds a card to see the secret word; one random player (the imposter) sees a hint instead
4. **Game Start** — shows who goes first; players play verbally in real life
5. **Results** — imposter identity, secret word, and hint revealed

## Key Design Decisions
- **Press-and-hold reveal** — card flips only while pressed, auto-unflips on release (prevents accidental reveals)
- **Modular topics** — each topic is a separate JSON file; adding a new file + updating `index.json` adds it to the game
- **Single-word hints** — hints are one word loosely related to the secret word (not too easy)
- **No server** — fully static, everything runs client-side
- **RTL Hebrew** — all UI is right-to-left with Rubik font
