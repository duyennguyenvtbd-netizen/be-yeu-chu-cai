/* chuyển màn hình */
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

/* ----------------
   học phát âm
---------------- */
const letters = ['a','ă','â','b','c','d','đ','e','ê','g','h','i','k','l','m','n','o','ô','ơ','p','q','r','s','t','u','ư','v','x','y'];
let letterIndex = 0;

function playLetter() {
  const letter = letters[letterIndex];
  const utter = new SpeechSynthesisUtterance(letter);
  utter.lang = 'vi-vn';
  speechSynthesis.speak(utter);
}

function nextLetter() {
  letterIndex = (letterIndex + 1) % letters.length;
  document.getElementById('currentLetter').innerText = letters[letterIndex];
  document.getElementById('feedback').innerText = '';
}

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('trình duyệt chưa hỗ trợ nghe giọng nói');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'vi-vn';
  recognition.start();

  recognition.onresult = function(event) {
    const spoken = event.results[0][0].transcript.trim().toLowerCase();
    const correct = letters[letterIndex];

    if (spoken.includes(correct)) {
      speakFeedback('con phát âm rất đúng rồi');
      document.getElementById('feedback').innerText = 'con phát âm rất đúng rồi';
    } else {
      speakFeedback('con thử nói lại nhé, chữ này là ' + correct);
      document.getElementById('feedback').innerText = 'con thử nói lại nhé, chữ này là ' + correct;
    }
  };
}

function speakFeedback(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-vn';
  speechSynthesis.speak(utter);
}

/* ----------------
   vẽ theo nét
---------------- */
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#4caf50';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  document.getElementById('drawFeedback').innerText = 'con vẽ rất cố gắng rồi, tiếp tục nhé';
  speakFeedback('con vẽ rất cố gắng rồi, tiếp tục nhé');
}

/* ----------------
   trò chơi điền chữ
---------------- */
const game = {
  word: 'c_n mèo',
  missing: 'o',
  full: 'con mèo'
};

function chooseLetter(letter) {
  if (letter === game.missing) {
    document.getElementById('gameFeedback').innerText = 'đúng rồi, ' + game.full;
    speakFeedback('đúng rồi, ' + game.full);
  } else {
    document.getElementById('gameFeedback').innerText = 'chưa đúng, con thử lại nhé';
    speakFeedback('chưa đúng, con thử lại nhé');
  }
}
