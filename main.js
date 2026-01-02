const API_KEY = "AIzaSyD-_BYD2oAaZVHR1tUE9ptV4yaDxlhzSMI";

// Danh sách dữ liệu phong phú cho 3 phần
const data = [
    { char: 'a', sound: 'a', text: 'con cá', img: 'https://images.unsplash.com/photo-1524704659690-3f7a3fe19bb2?w=500', quiz: 'c_n cá', correct: 'a' },
    { char: 'ă', sound: 'á', text: 'mặt trăng', img: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=500', quiz: 'mặt tr_ng', correct: 'ă' },
    { char: 'â', sound: 'ớ', text: 'con gấu', img: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500', quiz: 'con g_u', correct: 'â' },
    { char: 'b', sound: 'bờ', text: 'con bò', img: 'https://images.unsplash.com/photo-1543955444-202284915af5?w=500', quiz: 'con b_', correct: 'ò' },
    { char: 'c', sound: 'cờ', text: 'con cò', img: 'https://images.unsplash.com/photo-1621266512384-991599540097?w=500', quiz: 'con _ò', correct: 'c' },
    { char: 'd', sound: 'dờ', text: 'con dê', img: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=500', quiz: 'con _ê', correct: 'd' },
    { char: 'đ', sound: 'đờ', text: 'quả đu đủ', img: 'https://images.unsplash.com/photo-1526907194377-dc0d408a3f12?w=500', quiz: 'đ_ đủ', correct: 'u' },
    { char: 'e', sound: 'e', text: 'xe đạp', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500', quiz: 'x_ đạp', correct: 'e' },
    { char: 'ê', sound: 'ê', text: 'con ếch', img: 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=500', quiz: 'con _ch', correct: 'ế' },
    { char: 'g', sound: 'gờ', text: 'con gà', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500', quiz: 'con _à', correct: 'g' },
    { char: 'h', sound: 'hờ', text: 'con hổ', img: 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=500', quiz: 'con _ổ', correct: 'h' },
    { char: 'o', sound: 'o', text: 'con ong', img: 'https://images.unsplash.com/photo-1559060680-36ab4303d803?w=500', quiz: 'c_n ong', correct: 'o' }
];

let idx = 0;
let gameIdx = 0;

// 1. CHUYỂN ĐỔI GIỮA 3 PHẦN
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
    
    if(id === 'trace') initCanvas();
    if(id === 'game') updateGame();
}

// 2. PHẦN HỌC PHÁT ÂM
function updatePronounce() {
    const item = data[idx];
    document.getElementById('char-display').innerText = item.char;
    document.getElementById('example-text').innerText = item.text;
    document.getElementById('example-img').src = item.img;
    document.getElementById('feedback').innerText = "cô mời bé học!";
}

function playSample() {
    const item = data[idx];
    const msg = new SpeechSynthesisUtterance(item.sound);
    msg.lang = 'vi-VN';
    window.speechSynthesis.speak(msg);
}

// AI NHẬN XÉT GIỌNG NÓI
async function analyzeVoice(voiceInput) {
    const item = data[idx];
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Cô giáo mầm non nhận xét bé phát âm chữ "${item.char}" (đọc là ${item.sound}). Bé nói: "${voiceInput}". Nếu đúng hãy khen thật ngọt ngào, nếu sai bảo bé "con gần đúng rồi, thử lại nhé". Ngắn 1 câu.` }] }]
            })
        });
        const json = await res.json();
        const reply = json.candidates[0].content.parts[0].text;
        document.getElementById('feedback').innerText = reply;
        const msg = new SpeechSynthesisUtterance(reply);
        msg.lang = 'vi-VN';
        window.speechSynthesis.speak(msg);
    } catch (e) { console.error("Lỗi AI:", e); }
}

// 3. PHẦN TRÒ CHƠI (GAME)
function updateGame() {
    const item = data[gameIdx];
    document.getElementById('game-img').src = item.img;
    document.getElementById('quiz-word').innerText = item.quiz;
    
    // Tạo nút lựa chọn ngẫu nhiên
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    
    // Trộn đáp án đúng và 2 đáp án sai
    const choices = [item.correct, 'm', 'u', 'i'].slice(0, 3);
    choices.sort(() => Math.random() - 0.5);

    choices.forEach(letter => {
        const btn = document.createElement('button');
        btn.innerText = letter;
        btn.onclick = () => checkGame(letter, item.correct);
        optionsContainer.appendChild(btn);
    });
}

function checkGame(selected, correct) {
    if (selected === correct) {
        alert("Giỏi quá! Đúng rồi!");
        gameIdx = (gameIdx + 1) % data.length; // Sang câu tiếp theo
        updateGame();
    } else {
        alert("Ôi, chưa đúng rồi, con chọn lại nhé!");
    }
}

// 4. PHẦN TẬP TÔ (CANVAS)
const canvas = document.getElementById('traceCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function initCanvas() {
    document.getElementById('trace-guide').innerText = data[idx].char;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#4caf50";
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
}

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; });
canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener('touchend', () => { drawing = false; ctx.beginPath(); });
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); });

function draw(e) {
    if(!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.pageX) - rect.left;
    const y = (e.clientY || e.pageY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
function nextTrace() { changeChar(1); initCanvas(); }

function changeChar(n) {
    idx = (idx + n + data.length) % data.length;
    updatePronounce();
}

// GHI ÂM
const recordBtn = document.getElementById('record-btn');
if ('webkitSpeechRecognition' in window) {
    const rec = new webkitSpeechRecognition();
    rec.lang = 'vi-VN';
    recordBtn.onclick = () => { rec.start(); document.getElementById('feedback').innerText = "Cô đang nghe..."; };
    rec.onresult = (e) => analyzeVoice(e.results[0][0].transcript);
}

updatePronounce();

