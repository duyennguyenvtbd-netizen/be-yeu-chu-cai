const API_KEY = "AIzaSyD-_BYD2oAaZVHR1tUE9ptV4yaDxlhzSMI";

// Danh sách 29 chữ cái với phát âm chuẩn mầm non và hình ảnh thực tế
const alphabet = [
    { char: 'a', sound: 'a', text: 'con cá', img: 'https://images.unsplash.com/photo-1524704659690-3f7a3fe19bb2?w=600' },
    { char: 'ă', sound: 'á', text: 'mặt trăng', img: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=600' },
    { char: 'â', sound: 'ớ', text: 'quả nấm', img: 'https://images.unsplash.com/photo-1504672281656-e4981d70414b?w=600' },
    { char: 'b', sound: 'bờ', text: 'con bò', img: 'https://images.unsplash.com/photo-1543955444-202284915af5?w=600' },
    { char: 'c', sound: 'cờ', text: 'con cua', img: 'https://images.unsplash.com/photo-1550504680-fe574996911c?w=600' },
    { char: 'd', sound: 'dờ', text: 'con dê', img: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600' },
    { char: 'đ', sound: 'đờ', text: 'quả đu đủ', img: 'https://images.unsplash.com/photo-1526907194377-dc0d408a3f12?w=600' },
    { char: 'e', sound: 'e', text: 'xe đạp', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600' },
    { char: 'ê', sound: 'ê', text: 'con ếch', img: 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=600' },
    { char: 'g', sound: 'gờ', text: 'con gà', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600' }
    // Bạn có thể thêm tiếp các chữ cái khác vào đây theo mẫu trên
];

let currentIndex = 0;

function updateDisplay() {
    const item = alphabet[currentIndex];
    document.getElementById('char-display').innerText = item.char;
    document.getElementById('example-text').innerText = item.text;
    document.getElementById('example-img').src = item.img;
    document.getElementById('feedback').innerText = "cô mời con học chữ " + item.char;
}

// Phát âm mẫu: Dùng Web Speech API với giọng Việt
function playSample() {
    const item = alphabet[currentIndex];
    const msg = new SpeechSynthesisUtterance(item.sound);
    msg.lang = 'vi-VN';
    msg.rate = 0.8; // Đọc chậm một chút cho bé nghe rõ
    window.speechSynthesis.speak(msg);
}

// Kết nối với cô giáo AI Gemini
async function askTeacherAI(voiceInput) {
    const item = alphabet[currentIndex];
    const feedbackEl = document.getElementById('feedback');
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Bạn là cô giáo mầm non Việt Nam. Bé đang học chữ "${item.char}" (phát âm chuẩn là "${item.sound}"). Bé vừa đọc là "${voiceInput}". Hãy nhận xét thật dịu dàng, khen ngợi nếu bé nói đúng hoặc động viên nếu chưa đúng. Trả lời rất ngắn gọn.` 
                    }]
                }]
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        
        feedbackEl.innerText = reply;
        const msg = new SpeechSynthesisUtterance(reply);
        msg.lang = 'vi-VN';
        window.speechSynthesis.speak(msg);
    } catch (error) {
        feedbackEl.innerText = "Ôi, cô chưa nghe rõ, con nói lại nhé!";
    }
}

// Xử lý Ghi âm giọng nói của bé
const recordBtn = document.getElementById('record-btn');
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    
    recordBtn.onclick = () => {
        recognition.start();
        document.getElementById('feedback').innerText = "cô đang nghe con đây...";
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        askTeacherAI(result);
    };
}

function changeChar(step) {
    currentIndex = (currentIndex + step + alphabet.length) % alphabet.length;
    updateDisplay();
}

// Khởi tạo lần đầu
updateDisplay();