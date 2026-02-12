// --- 1. Audio Interaction Handler ---
const music = document.getElementById('bg-music');

const startMusic = () => {
    music.play().catch(e => console.log("Audio waiting for interaction..."));
    window.removeEventListener('click', startMusic);
    window.removeEventListener('touchstart', startMusic);
};

window.addEventListener('click', startMusic);
window.addEventListener('touchstart', startMusic);

// --- 2. Particle System ---
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

const res = () => { 
    pCanvas.width = window.innerWidth; 
    pCanvas.height = window.innerHeight; 
};
window.addEventListener('resize', res);
res();

class P {
    constructor(type) { this.reset(type, true); }
    reset(type = null, initial = false) {
        this.type = type || (Math.random() > 0.5 ? 'heart' : 'pearl');
        this.x = Math.random() * pCanvas.width;
        this.y = initial ? Math.random() * pCanvas.height : pCanvas.height + 30;
        this.baseX = this.x;
        this.size = this.type === 'heart' ? 11 + Math.random() * 6 : 8 + Math.random() * 4;
        this.speed = 0.18 + Math.random() * 0.15;
        this.opacity = 0;
        this.fadeSpeed = 0.004;
        this.wave = Math.random() * Math.PI * 2;
        this.waveSpeed = 0.01 + Math.random() * 0.008;
        this.waveWidth = 10 + Math.random() * 8;
        this.pulse = Math.random() * Math.PI * 2;
        this.heartColor = ['#ff6b81','#ff8fa3','#ff758f'][Math.floor(Math.random()*3)];
    }

    update() {
        this.y -= this.speed;
        this.wave += this.waveSpeed;
        this.x = this.baseX + Math.sin(this.wave) * this.waveWidth;
        if (this.opacity < 0.9) this.opacity += this.fadeSpeed;
        this.pulse += 0.02;
        if (this.y < -40) this.reset(this.type);
    }

    draw() {
        pCtx.save();
        pCtx.globalAlpha = this.opacity;
        pCtx.translate(this.x, this.y);
        if (this.type === 'heart') {
            const pulseScale = 1 + Math.sin(this.pulse) * 0.04;
            pCtx.scale((this.size / 20) * pulseScale, (this.size / 20) * pulseScale);
            pCtx.shadowColor = this.heartColor;
            pCtx.shadowBlur = 6;
            pCtx.beginPath();
            pCtx.moveTo(0, 0);
            pCtx.bezierCurveTo(0, -10, -15, -10, -15, 0);
            pCtx.bezierCurveTo(-15, 10, 0, 15, 0, 20);
            pCtx.bezierCurveTo(0, 15, 15, 10, 15, 0);
            pCtx.bezierCurveTo(15, -10, 0, -10, 0, 0);
            pCtx.fillStyle = this.heartColor;
            pCtx.fill();
        } else {
            pCtx.shadowColor = 'rgba(255, 240, 225, 0.3)';
            pCtx.shadowBlur = 2;
            const gradient = pCtx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            gradient.addColorStop(0, 'rgba(255, 250, 245, 0.5)');
            gradient.addColorStop(0.6, 'rgba(240, 228, 215, 0.45)');
            gradient.addColorStop(1, 'rgba(225, 210, 195, 0.4)');
            pCtx.fillStyle = gradient;
            pCtx.beginPath();
            pCtx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
            pCtx.fill();
        }
        pCtx.restore();
    }
}

for (let i = 0; i < 60; i++) particles.push(new P());

function loop() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
}
loop();

// --- 3. Stage 1 Logic ---
const noBtn = document.getElementById('no-btn');
const handleNo = (e) => {
    e.preventDefault();
    noBtn.style.animation = 'none';
    noBtn.offsetHeight; 
    noBtn.style.animation = 'shake 0.5s ease-in-out';
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.max(10, Math.floor(Math.random() * maxX)) + 'px';
    noBtn.style.top = Math.max(10, Math.floor(Math.random() * maxY)) + 'px';
};

noBtn.addEventListener('touchstart', handleNo, {passive: false});
noBtn.addEventListener('click', handleNo);

document.getElementById('yes-btn').onclick = () => nextStage(2);

function nextStage(n) {
    document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
    document.getElementById(`stage-${n}`).classList.add('active');
    if(n===2) formHeartShowcase();
}

// --- 4. Stage 2: Gallery ---
const imgSources = [
    "https://th.bing.com/th/id/OIP.ia1P2RB_iV1HYr1LOdK64wHaLj?w=200&h=312&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", 
    "https://i.pinimg.com/originals/84/a2/e1/84a2e147cb9e1e72bcc8a8adf286bbe7.jpg", 
    "https://www.hdwallpapers.in/download/couple_standing_in_blur_green_leaves_background_hd_couple-1920x1080.jpg", 
    "https://i.pinimg.com/originals/27/a3/f3/27a3f316fadb1b3e87c97a7772190116.jpg", 
    "https://wallpapercave.com/wp/wp5010109.jpg",
    "https://wallpapercave.com/wp/wp11015400.jpg",
    "https://static.vecteezy.com/system/resources/previews/001/421/389/large_2x/beautiful-wedding-couple-hugging-in-the-park-with-sun-halos-free-photo.jpg",
    "https://images.pexels.com/photos/16122198/pexels-photo-16122198/free-photo-of-couple-hugging-in-nature-on-sunset.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", 
    "https://th.bing.com/th/id/R.c9243fcd81772e5f3eeaa266024c2e36?rik=YE%2fDATXDyvRUXA&riu=http%3a%2f%2fwww.brandedgirls.com%2fwp-content%2fuploads%2f2015%2f12%2fmarried-couple-hugging5.jpg&ehk=L4JDUNOzUitSLsyV5ziXQlQUgdYb%2fm%2bka78zPPFZCz8%3d&risl=&pid=ImgRaw&r=0",
    "https://wallpaperbat.com/img/155864-couple-standing-in-the-seashore-hugging-each-other-during-sunset.jpg"
];
const captions = ["Your Presence 🤍", "Your Smile 😊", "Every Moment 🫶", "My Love 🫴", "Our World 🌎", "Our Adventures 💗", "Our Dream 🌝", "Our Inside Jokes 🙈", "Simply us 🦢", "Your Eyes 👀"];

const heartPattern = [
    {x: -55, y: -90}, {x: 55, y: -90},
    {x: -95, y: -35}, {x: -32, y: -35}, {x: 32, y: -35}, {x: 95, y: -35},
    {x: -65, y: 30}, {x: 0, y: 30}, {x: 65, y: 30}, {x: 0, y: 95}
];

async function formHeartShowcase() {
    const gallery = document.getElementById('heart-gallery');
    gallery.innerHTML = '';
    
    for (let i = 0; i < imgSources.length; i++) {
        const div = document.createElement('div');
        div.className = 'mini-polaroid';
        div.innerHTML = `<img src="${imgSources[i]}"><p>${captions[i]}</p>`;
        div.style.transform = "translate(0, 0) scale(0)";
        gallery.appendChild(div);

        await new Promise(r => setTimeout(r, 100));
        div.style.transform = `translate(0, 0) scale(2.8) rotate(${(Math.random()-0.5)*10}deg)`;
        div.style.zIndex = "1000";

        await new Promise(r => setTimeout(r, 1300));

        const pos = heartPattern[i];
        const randomRot = (Math.random() - 0.5) * 30;
        const finalTrans = `translate(${pos.x}px, ${pos.y}px) scale(1) rotate(${randomRot}deg)`;
        
        div.style.zIndex = "5";
        div.style.transform = finalTrans;
        div.dataset.origTrans = finalTrans;

        div.onclick = (e) => {
            e.stopPropagation();
            if(div.classList.contains('zoomed')) {
                div.classList.remove('zoomed');
                div.style.transform = div.dataset.origTrans;
            } else {
                closeAllPhotos();
                div.classList.add('zoomed');
            }
        };
    }
    setTimeout(() => {
        document.getElementById('swipe-wrap').classList.add('show');
        initSlider();
    }, 600);
}

function closeAllPhotos() {
    document.querySelectorAll('.mini-polaroid.zoomed').forEach(p => {
        p.classList.remove('zoomed');
        p.style.transform = p.dataset.origTrans;
    });
}

function initSlider() {
    const knob = document.getElementById('heart-knob'), fill = document.getElementById('fill'), track = document.getElementById('track');
    let dragging = false;
    const startDragging = (e) => { dragging = true; if(e.type === 'touchstart') e.preventDefault(); };
    const stopDragging = () => dragging = false;
    const onMove = (e) => {
        if(!dragging) return;
        const rect = track.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left - 27;
        let p = Math.max(0, Math.min(x / (rect.width - 55), 1));
        knob.style.left = (p * (rect.width - 55)) + 'px';
        fill.style.width = (p * 100) + '%';
        if(p > 0.98) { dragging = false; nextStage(3); }
    };
    knob.addEventListener('mousedown', startDragging);
    knob.addEventListener('touchstart', startDragging);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
}

// --- 5. Stage 3 Scratch Logic ---
const envelope = document.getElementById('envelope');
envelope.onclick = () => { envelope.classList.add('open'); setTimeout(initScratch, 500); };

function initScratch() {
    const canvas = document.getElementById('scratch-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grad.addColorStop(0,'#e2e2e2'); grad.addColorStop(0.5,'#ffb3c1'); grad.addColorStop(1,'#d1d1d1');
    ctx.fillStyle = grad; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#ff4d6d'; ctx.font='bold 16px "Shantell Sans"'; ctx.textAlign='center';
    ctx.fillText('SCRATCH HERE', canvas.width/2, canvas.height/2+5);
    const scratch = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 25, 0, Math.PI*2); ctx.fill();
    };
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e.touches[0].clientX, e.touches[0].clientY); });
    canvas.addEventListener('mousemove', (e) => { if(e.buttons === 1) scratch(e.clientX, e.clientY); });
}