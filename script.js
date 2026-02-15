document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize Lucide Icons ---
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const trailContainer = document.getElementById('cursor-trail');

    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            if (Math.random() < 0.3) {
                const dot = document.createElement('div');
                dot.className = 'trail-dot';
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
                trailContainer.appendChild(dot);
                setTimeout(() => dot.remove(), 500);
            }
        });
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    } else {
        cursor.style.display = 'none';
        trailContainer.style.display = 'none';
    }

    // --- Floating Background ---
    const bgContainer = document.getElementById('floating-background');
    const iconNames = ['heart', 'star', 'cloud', 'sparkles', 'music'];

    function spawnFloatingIcon() {
        const el = document.createElement('i');
        el.setAttribute('data-lucide', iconNames[Math.floor(Math.random() * iconNames.length)]);
        el.className = 'floating-icon';
        const size = Math.random() * 20 + 10;
        const dur = Math.random() * 10 + 10;
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = dur + 's';
        bgContainer.appendChild(el);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => el.remove(), dur * 1000);
    }
    setInterval(spawnFloatingIcon, 2000);

    // --- Modal Variables (defined early) ---
    const messageModal = document.getElementById('message-modal');
    const messageText = document.getElementById('message-text');
    const messageOkBtn = document.getElementById('message-ok-btn');
    const closeMessage = document.querySelector('.close-message');

    // --- Navigation ---
    const sections = [
        document.getElementById('welcome'),
        document.getElementById('love-game'),
        document.getElementById('memories'),
        document.getElementById('timer'),
        document.getElementById('catch-heart'),
        document.getElementById('secret')
    ];

    function showSection(idx) {
        sections.forEach(s => s.classList.remove('active-section'));
        if (sections[idx]) sections[idx].classList.add('active-section');
        window.scrollTo(0, 0);
    }

    // --- Music ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    bgMusic.volume = 0.05;
    let isPlaying = false;

    function updateMusicIcon(playing) {
        musicToggle.innerHTML = playing
            ? '<i data-lucide="pause"></i> Pause'
            : '<i data-lucide="music"></i> Play';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function tryPlay() {
        bgMusic.play().then(() => { isPlaying = true; updateMusicIcon(true); })
            .catch(() => console.log("Autoplay blocked."));
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) { bgMusic.pause(); isPlaying = false; }
        else {
            bgMusic.play().then(() => { isPlaying = true; })
                .catch(() => showMessage("Tap the page first to enable audio!"));
        }
        updateMusicIcon(isPlaying);
    });
    tryPlay();

    // --- Section 1: Welcome ---
    document.getElementById('enter-btn').addEventListener('click', () => {
        showSection(1);
        if (!isPlaying) tryPlay();
    });

    // --- Section 2: Love Game ---
    const noBtn = document.getElementById('no-btn');
    const moveNo = () => {
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '100';
        const btnW = noBtn.offsetWidth || 150;
        const btnH = noBtn.offsetHeight || 50;
        const maxX = window.innerWidth - btnW - 20;
        const maxY = window.innerHeight - btnH - 20;
        noBtn.style.left = Math.min(maxX, Math.max(20, Math.random() * maxX)) + 'px';
        noBtn.style.top = Math.min(maxY, Math.max(20, Math.random() * maxY)) + 'px';
    };
    noBtn.addEventListener('mouseover', moveNo);
    noBtn.addEventListener('click', moveNo);

    document.getElementById('yes-btn').addEventListener('click', () => {
        createConfetti();
        showSection(2);
    });

    // --- Section 3: Memories ---
    document.getElementById('next-memories-btn').addEventListener('click', () => showSection(3));

    // --- Section 4: Timer ---
    document.getElementById('next-timer-btn').addEventListener('click', () => showSection(4));

    // --- Section 5: Catch Heart ---
    document.getElementById('next-catch-btn').addEventListener('click', () => showSection(5));

    // --- Confetti ---
    function createConfetti() {
        const colors = ['#ff6b6b', '#ff9ff3', '#feca57', '#48dbfb', '#ff4757', '#a29bfe'];
        for (let i = 0; i < 40; i++) {
            const c = document.createElement('i');
            c.setAttribute('data-lucide', 'heart');
            c.className = 'confetti-svg';
            const size = Math.random() * 20 + 10;
            c.style.left = Math.random() * 100 + 'vw';
            c.style.top = '-50px';
            c.style.width = size + 'px';
            c.style.height = size + 'px';
            c.style.color = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDuration = (Math.random() * 3 + 2) + 's';
            c.style.pointerEvents = 'none';
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 5000);
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- Polaroids ---
    const modal = document.getElementById('modal');
    const modalMedia = document.getElementById('modal-media-container');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.polaroid').forEach(card => {
        card.style.setProperty('--rotation', (Math.random() * 10 - 5) + 'deg');
        card.addEventListener('click', () => {
            modalMedia.innerHTML = '';
            const img = card.querySelector('img');
            const video = card.querySelector('video');
            const caption = card.getAttribute('data-caption');
            if (img) {
                const el = document.createElement('img');
                el.src = img.src;
                modalMedia.appendChild(el);
            } else if (video) {
                const el = document.createElement('video');
                el.src = video.src;
                el.controls = true; el.autoplay = true; el.loop = true;
                modalMedia.appendChild(el);
            }
            modalCaption.innerText = caption;
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        });
    });

    const hideModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    };
    closeModal.addEventListener('click', hideModal);
    window.addEventListener('click', e => { if (e.target === modal) hideModal(); });

    // --- Timer ---
    const startDate = new Date("2022-05-12T00:00:00").getTime();
    function tick() {
        const diff = Date.now() - startDate;
        document.getElementById('days').innerText = Math.floor(diff / 86400000);
        document.getElementById('hours').innerText = Math.floor((diff % 86400000) / 3600000);
        document.getElementById('minutes').innerText = Math.floor((diff % 3600000) / 60000);
        document.getElementById('seconds').innerText = Math.floor((diff % 60000) / 1000);
    }
    setInterval(tick, 1000);
    tick();

    // --- Heart Game ---
    const heart = document.getElementById('moving-heart');
    const countSpan = document.getElementById('clicks-left');
    const infoCard = document.querySelector('#catch-heart .mini-card');
    let clicksNeeded = 5;

    const moveHeart = () => {
        heart.style.left = (Math.random() * (window.innerWidth - 150) + 20) + 'px';
        heart.style.top = (Math.random() * (window.innerHeight - 150) + 20) + 'px';
    };
    let heartTimer = setInterval(moveHeart, 2000);

    heart.addEventListener('click', () => {
        clicksNeeded--;
        countSpan.innerText = clicksNeeded;
        clearInterval(heartTimer);
        heartTimer = setInterval(moveHeart, Math.max(800, 2000 - (5 - clicksNeeded) * 300));
        moveHeart();

        if (clicksNeeded <= 0) {
            clearInterval(heartTimer);
            heart.style.display = 'none';
            if (infoCard) infoCard.style.display = 'none';
            document.getElementById('reward-container').classList.remove('hidden');
            showMessage("You caught my heart!");
        }
    });

    // --- SECRET LETTER (Envelope Animation) ---
    const openLetterBtn = document.getElementById('open-letter-btn');
    const envelopeBox = document.getElementById('envelope-box');
    const letterOverlay = document.getElementById('love-letter-overlay');
    const closeLetterBtn = document.getElementById('close-letter-btn');

    if (openLetterBtn && envelopeBox && letterOverlay) {
        openLetterBtn.addEventListener('click', () => {
            // Step 1: Open the flap (CSS handles animation)
            envelopeBox.classList.add('opened');

            // Step 2: Fade out the button
            openLetterBtn.style.transition = 'opacity 0.5s ease';
            openLetterBtn.style.opacity = '0';
            openLetterBtn.style.pointerEvents = 'none';

            // Step 3: After flap opens, shrink and show letter
            setTimeout(() => {
                envelopeBox.classList.add('fade-out');
            }, 1000);

            // Step 4: Show the letter overlay
            setTimeout(() => {
                letterOverlay.classList.remove('hidden');
                createConfetti();
                createConfetti();
            }, 1500);
        });

        // Close letter button
        if (closeLetterBtn) {
            closeLetterBtn.addEventListener('click', () => {
                letterOverlay.classList.add('hidden');
            });
        }
    }

    // --- Message Modal ---
    let msgCallback = null;
    function showMessage(text, cb) {
        messageText.innerText = text;
        messageModal.style.display = 'flex';
        setTimeout(() => messageModal.classList.add('show'), 10);
        createConfetti();
        msgCallback = cb || null;
    }
    function hideMessage() {
        messageModal.classList.remove('show');
        setTimeout(() => {
            messageModal.style.display = 'none';
            if (msgCallback) { msgCallback(); msgCallback = null; }
        }, 300);
    }
    messageOkBtn.addEventListener('click', hideMessage);
    closeMessage.addEventListener('click', hideMessage);
});
