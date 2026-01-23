// ゲームの状態管理
let currentNumber = 0;
let correctCount = 0;
let totalCount = 0;
let selectedAnswer = null;

// DOM要素の取得
const questionNumberEl = document.getElementById('question-number');
const questionDotsEl = document.getElementById('question-dots');
const answerDotsEl = document.getElementById('answer-dots');
const numberButtons = document.querySelectorAll('.number-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackEl = document.getElementById('feedback');
const correctCountEl = document.getElementById('correct-count');
const totalCountEl = document.getElementById('total-count');

// 視覚的なドットを生成
function createDots(container, count, isAnswer = false) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = isAnswer ? 'dot answer' : 'dot';
        dot.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(dot);
    }
}

// 新しい問題を生成
function generateNewQuestion() {
    // 0から10のランダムな数字を生成
    currentNumber = Math.floor(Math.random() * 11);
    questionNumberEl.textContent = currentNumber;
    
    // 視覚的なドットを表示
    createDots(questionDotsEl, currentNumber, false);
    createDots(answerDotsEl, 0, true);
    
    // 選択をリセット
    selectedAnswer = null;
    numberButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    
    // ボタンの表示切り替え
    nextBtn.classList.add('hidden');
    feedbackEl.classList.add('hidden');
}

// 答えをチェック
function checkAnswer() {
    if (selectedAnswer === null) {
        return;
    }
    
    const correctAnswer = 10 - currentNumber;
    
    // 問題数をカウント
    totalCount++;
    totalCountEl.textContent = totalCount;
    
    // 答えの判定
    if (selectedAnswer === correctAnswer) {
        // 正解の場合
        correctCount++;
        correctCountEl.textContent = correctCount;
        
        feedbackEl.textContent = `🎉 せいかい！ ${currentNumber} + ${correctAnswer} = 10 だね！`;
        feedbackEl.className = 'feedback correct';
        
        // 効果音（ブラウザのビープ音）
        playSuccessSound();
    } else {
        // 不正解の場合
        feedbackEl.textContent = `😢 ざんねん... こたえは ${correctAnswer} だよ。${currentNumber} + ${correctAnswer} = 10`;
        feedbackEl.className = 'feedback incorrect';
    }
    
    // フィードバックを表示
    feedbackEl.classList.remove('hidden');
    
    // ボタンを無効化
    numberButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    // ボタンの表示切り替え
    nextBtn.classList.remove('hidden');
}

// 成功音を再生（簡易版）
function playSuccessSound() {
    // Web Audio APIを使った簡易的な効果音
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // 音が再生できなくても問題なし
        console.log('効果音を再生できませんでした');
    }
}

// イベントリスナーの設定
// 数字ボタンのクリックイベント
numberButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.disabled) return;
        
        // 選択状態をリセット
        numberButtons.forEach(b => b.classList.remove('selected'));
        
        // 選択された数字を保存
        selectedAnswer = parseInt(btn.dataset.number);
        btn.classList.add('selected');
        
        // 視覚的なドットを更新
        createDots(answerDotsEl, selectedAnswer, true);
        
        // 自動的に答えをチェック
        setTimeout(() => {
            checkAnswer();
        }, 500);
    });
});

nextBtn.addEventListener('click', generateNewQuestion);

// ページ読み込み時に最初の問題を生成
window.addEventListener('DOMContentLoaded', () => {
    generateNewQuestion();
});
