const API_KEY = "AIzaSyANHXdmXZ8aMRKURZ09bDxAYLfgbFo4tY8";

const data = [
    { 
        char: 'a', sound: 'a', text: 'con cá', 
        img: 'https://images.unsplash.com/photo-1524704659690-3f7a3fe19bb2?w=600',
        quiz: 'c_n cá', qImg: 'https://images.unsplash.com/photo-1524704659690-3f7a3fe19bb2?w=600'
    },
    { 
        char: 'ă', sound: 'á', text: 'mặt trăng', 
        img: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=600',
        quiz: 'mặt tr_ng', qImg: 'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?w=600'
    },
    { 
        char: 'â', sound: 'ớ', text: 'quả nấm', 
        img: 'https://images.unsplash.com/photo-1504672281656-e4981d70414b?w=600',
        quiz: 'quả n_m', qImg: 'https://images.unsplash.com/photo-1504672281656-e4981d70414b?w=600'
    },
    { 
        char: 'b', sound: 'bờ', text: 'con bò', 
        img: 'https://images.unsplash.com/photo-1543955444-202284915af5?w=600',
        quiz: 'con b_', qImg: 'https://images.unsplash.com/photo-1543955444-202284915af5?w=600'
    },
    { 
        char: 'đ', sound: 'đờ', text: 'quả đu đủ', 
        img: 'https://images.unsplash.com/photo-1526907194377-dc0d408a3f12?w=600', // Đu đủ thực tế
        quiz: 'quả đ_ đủ', qImg: 'https://images.unsplash.com/photo-1526907194377-dc0d408a3f12?w=600'
    }
];

let idx = 0;

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
    if(id === 'trace') initCanvas();
}

function updateUI() {
    const item = data[idx];
    document.getElementById('char-display').innerText = item.char;
    document.getElementById('example-text').innerText = item.text;
    document.getElementById('example-img').src = item.img;
    // Cập nhật game
    document.getElementById('game-img').src = item.qImg;
    document.getElementById('quiz-word').innerText = item.quiz;
}

function playSample() {
    const item = data[idx];
    const msg = new SpeechSynthesisUtterance(item.sound);
    msg.lang = 'vi-VN';
    window.speechSynthesis.speak(msg);
}

// ... (Giữ nguyên phần vẽ Canvas và Ghi âm như mã trước) ...
// Nhớ thêm phần ghi âm để AI nhận xét
