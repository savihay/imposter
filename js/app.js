/**
 * Imposter! — Main game logic
 * 
 * Flow: Title → Setup → Word Reveal → Game Start → Results
 */

(() => {
    'use strict';

    // ===== Game State =====
    const state = {
        playerCount: 4,
        playerNames: [],
        selectedTopics: [],
        secretWord: null,   // { word, hint, topicName }
        imposterIndex: -1,
        firstPlayerIndex: -1,
        currentRevealIndex: 0,
        hasRevealed: false,       // Has current player revealed the card?
        isTransitioning: false    // Prevents flash when switching cards
    };

    // ===== DOM Elements =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // Screens
    const screens = {
        title: $('#screen-title'),
        setup: $('#screen-setup'),
        reveal: $('#screen-reveal'),
        gamestart: $('#screen-gamestart'),
        results: $('#screen-results')
    };

    // ===== Screen Management =====
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
        window.scrollTo(0, 0);
    }


    // ===== Setup Screen =====
    function renderSetup() {
        renderPlayerCount();
        renderPlayerNames();
        renderTopics();
        updateBeginButton();
    }

    function renderPlayerCount() {
        $('#player-count').textContent = state.playerCount;
    }

    function renderPlayerNames() {
        const container = $('#player-names-container');
        container.innerHTML = '';
        for (let i = 0; i < state.playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'player-name-input';
            input.placeholder = `שחקן ${i + 1}`;
            input.value = state.playerNames[i] || '';
            input.dataset.index = i;
            input.addEventListener('input', (e) => {
                state.playerNames[parseInt(e.target.dataset.index)] = e.target.value.trim();
            });
            container.appendChild(input);
        }
    }

    async function renderTopics() {
        const container = $('#topics-container');
        const topics = TopicsManager.getTopics();

        if (topics.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">טוען נושאים...</p>';
            return;
        }

        container.innerHTML = '';
        topics.forEach(topic => {
            const btn = document.createElement('button');
            btn.className = 'topic-btn';
            if (state.selectedTopics.includes(topic.name)) {
                btn.classList.add('selected');
            }
            btn.innerHTML = `
                <span class="topic-icon">${topic.icon}</span>
                <span>${topic.name}</span>
            `;
            btn.addEventListener('click', () => {
                toggleTopic(topic.name);
                btn.classList.toggle('selected');
                updateBeginButton();
            });
            container.appendChild(btn);
        });
    }

    function toggleTopic(name) {
        const idx = state.selectedTopics.indexOf(name);
        if (idx >= 0) {
            state.selectedTopics.splice(idx, 1);
        } else {
            state.selectedTopics.push(name);
        }
    }

    function updateBeginButton() {
        const btn = $('#btn-begin');
        btn.disabled = state.selectedTopics.length === 0;
    }

    // Player count controls
    $('#btn-increase').addEventListener('click', () => {
        if (state.playerCount < 20) {
            state.playerCount++;
            renderPlayerCount();
            renderPlayerNames();
        }
    });

    $('#btn-decrease').addEventListener('click', () => {
        if (state.playerCount > 3) {
            state.playerCount--;
            state.playerNames = state.playerNames.slice(0, state.playerCount);
            renderPlayerCount();
            renderPlayerNames();
        }
    });

    // Begin game
    $('#btn-begin').addEventListener('click', () => {
        startGame();
    });

    // ===== Game Initialization =====
    function startGame() {
        // Fill in default names for empty slots
        for (let i = 0; i < state.playerCount; i++) {
            if (!state.playerNames[i]) {
                state.playerNames[i] = `שחקן ${i + 1}`;
            }
        }

        // Pick random word from selected topics
        state.secretWord = TopicsManager.getRandomWord(state.selectedTopics);
        if (!state.secretWord) {
            alert('לא נמצאו מילים בנושאים שנבחרו');
            return;
        }

        // Pick random imposter
        state.imposterIndex = Math.floor(Math.random() * state.playerCount);

        // Pick random first player
        state.firstPlayerIndex = Math.floor(Math.random() * state.playerCount);

        // Start reveal phase
        state.currentRevealIndex = 0;
        state.hasRevealed = false;
        state.isTransitioning = false;
        showScreen('reveal');
        renderReveal();
    }

    // ===== Word Reveal Phase =====
    function renderReveal() {
        const card = $('#reveal-card');
        const playerName = state.playerNames[state.currentRevealIndex];
        const nextBtn = $('#btn-next-player');

        // Reset card to front (not flipped)
        card.classList.remove('flipped');
        // Hide the next button until they reveal
        state.hasRevealed = false;
        nextBtn.classList.add('hidden');

        // Player name on front
        $('#reveal-player-name').textContent = playerName;

        // Progress
        $('#reveal-progress-text').textContent = `${state.currentRevealIndex + 1} מתוך ${state.playerCount}`;
        $('#reveal-progress-bar').style.width = `${((state.currentRevealIndex + 1) / state.playerCount) * 100}%`;

        // Prepare back content
        const contentDiv = $('#reveal-content');
        if (state.currentRevealIndex === state.imposterIndex) {
            contentDiv.innerHTML = `
                <div class="reveal-imposter-label">אתה המתחזה! 🕵️</div>
                <div class="reveal-hint-label">הרמז שלך:</div>
                <div class="reveal-hint">${state.secretWord.hint}</div>
            `;
        } else {
            contentDiv.innerHTML = `
                <div class="reveal-role">המילה הסודית:</div>
                <div class="reveal-word">${state.secretWord.word}</div>
            `;
        }

        // Remove transitioning state after brief delay
        if (state.isTransitioning) {
            setTimeout(() => {
                state.isTransitioning = false;
            }, 100);
        }
    }

    // Press-and-hold to reveal: flip on press, unflip on release
    const revealCard = $('#reveal-card');
    let revealTimer = null;

    function flipCard() {
        if (state.isTransitioning) return;
        revealCard.classList.add('flipped');
        state.hasRevealed = true;
        
        if (!revealTimer) {
            revealTimer = setTimeout(() => {
                if (revealCard.classList.contains('flipped')) {
                    $('#btn-next-player').classList.remove('hidden');
                }
                revealTimer = null;
            }, 500);
        }
    }

    function unflipCard() {
        revealCard.classList.remove('flipped');
        if (revealTimer) {
            clearTimeout(revealTimer);
            revealTimer = null;
        }
    }

    // Mouse events
    revealCard.addEventListener('mousedown', () => {
        flipCard();
    });
    revealCard.addEventListener('mouseup', unflipCard);
    revealCard.addEventListener('mouseleave', unflipCard);

    // Touch events
    revealCard.addEventListener('touchstart', (e) => {
        e.preventDefault();
        flipCard();
    });
    revealCard.addEventListener('touchend', (e) => {
        e.preventDefault();
        unflipCard();
    });
    revealCard.addEventListener('touchcancel', unflipCard);

    // "Next player" button
    $('#btn-next-player').addEventListener('click', (e) => {
        e.stopPropagation();
        state.currentRevealIndex++;
        state.isTransitioning = true;

        if (state.currentRevealIndex >= state.playerCount) {
            // All players have seen — go to game start
            showScreen('gamestart');
            renderGameStart();
        } else {
            // Brief blank transition to prevent content flash
            const contentDiv = $('#reveal-content');
            contentDiv.innerHTML = '';
            revealCard.classList.remove('flipped');

            setTimeout(() => {
                renderReveal();
            }, 50);
        }
    });

    // ===== Game Start Screen =====
    function renderGameStart() {
        $('#first-player-name').textContent = state.playerNames[state.firstPlayerIndex];
        $('#info-players').textContent = `${state.playerCount} שחקנים`;
    }

    // Reveal imposter button
    $('#btn-reveal-imposter').addEventListener('click', () => {
        showScreen('results');
        renderResults();
    });

    // ===== Results Screen =====
    function renderResults() {
        $('#results-imposter').textContent = state.playerNames[state.imposterIndex];
        $('#results-word').textContent = state.secretWord.word;
        $('#results-hint').textContent = state.secretWord.hint;
    }

    // Play again (same settings, new word)
    $('#btn-play-again').addEventListener('click', () => {
        startGame();
    });

    // New game (back to title)
    $('#btn-new-game').addEventListener('click', () => {
        state.selectedTopics = TopicsManager.getTopics().map(t => t.name);
        state.secretWord = null;
        state.imposterIndex = -1;
        state.firstPlayerIndex = -1;
        state.currentRevealIndex = 0;
        state.hasRevealed = false;
        state.isTransitioning = false;
        showScreen('setup');
        renderSetup();
    });

    // ===== Initialization =====
    async function init() {
        await TopicsManager.loadTopics();
        state.selectedTopics = TopicsManager.getTopics().map(t => t.name);
        console.log(`Loaded ${TopicsManager.getTopics().length} topics`);

        setTimeout(() => {
            const titleScreen = $('#screen-title');
            titleScreen.style.transition = 'opacity 0.5s ease';
            titleScreen.style.opacity = '0';
            setTimeout(() => {
                showScreen('setup');
                renderSetup();
                titleScreen.style.opacity = '1';
                titleScreen.style.transition = '';
            }, 500);
        }, 2000);
    }

    init();
})();
