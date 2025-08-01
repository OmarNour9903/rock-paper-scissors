/*
    المتغيرات الأساسية
*/
// عدد نقاط اللاعب
let playerScore = 0;
// عدد نقاط الكمبيوتر
let computerScore = 0;
// حالة اللعب (هل الجولة شغالة؟)
let isPlaying = false;
// حالة انتهاء اللعبة
let gameOver = false;

/*
    تشغيل المؤثرات الصوتية
*/
// أصوات بسيطة باستخدام Web Audio API
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if (type === 'win') {
        // صوت الفوز (عدة نغمات سريعة)
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(300 + i * 100, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            }, i * 150);
        }
    } else if (type === 'lose') {
        // صوت الخسارة (نغمة هابطة)
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.8);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.8);
    } else if (type === 'tie') {
        // صوت التعادل (نغمة متوسطة)
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
    }
}

/*
    عرض الاحتفال على الشاشة
*/
function showCelebration(emoji) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = emoji;
    document.body.appendChild(celebration);

    setTimeout(() => {
        document.body.removeChild(celebration);
    }, 2000);
}

/*
    تشغيل جولة من اللعبة
*/
function playGame(playerChoice) {
    // لو الجولة شغالة أو اللعبة خلصت، ماينفعش تبدأ جولة تانية
    if (isPlaying || gameOver) return;
    isPlaying = true;

    // إزالة التحديدات السابقة من الاختيارات
    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.remove('selected', 'computer-selected');
    });

    // تمييز اختيار اللاعب
    document.querySelectorAll('#playerSection .choice').forEach(choice => {
        if (choice.getAttribute('data-choice') === playerChoice) {
            choice.classList.add('selected');
        }
    });

    // عرض أن الكمبيوتر بيفكر
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = "Computer is choosing..";
    resultDiv.className = 'game-result computer-thinking';

    // الكمبيوتر يختار بعد تأخير بسيط
    setTimeout(() => {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];

        // تمييز اختيار الكمبيوتر
        document.querySelectorAll('#computerSection .choice').forEach(choice => {
            if (choice.getAttribute('data-choice') === computerChoice) {
                choice.classList.add('computer-selected');
            }
        });

        /*
            تحديد نتيجة الجولة
        */
        let result, resultClass, soundType, celebrationEmoji;

        if (playerChoice === computerChoice) {
            result = "تعادل! 🤝";
            resultClass = 'result-tie';
            soundType = 'tie';
            celebrationEmoji = '🤝';
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            result = "You win this round! 🎉";
            resultClass = 'result-win';
            soundType = 'win';
            celebrationEmoji = '🎉';
            playerScore++;
            document.getElementById('playerScore').textContent = playerScore;
        } else {
            result = "Computer wins this round 🤦‍♀️";
            resultClass = 'result-lose';
            soundType = 'lose';
            celebrationEmoji = '😔';
            computerScore++;
            document.getElementById('computerScore').textContent = computerScore;
        }

        // عرض النتيجة والتأثيرات
        resultDiv.textContent = result;
        resultDiv.className = `game-result ${resultClass}`;
        playSound(soundType);

        /*
            التحقق من نهاية اللعبة
        */
        if (playerScore === 5 || computerScore === 5) {
            const finalMessage = playerScore === 5 
                ? "You won the game 🤩" 
                : "Computer won the game 😓";

            setTimeout(() => {
                document.getElementById("final").textContent = finalMessage;
                gameOver = true;
            }, 2000);
        } else {
            // إعادة تعيين الجولة بعد وقت بسيط
            setTimeout(() => {
                isPlaying = false;
                document.querySelectorAll('.choice').forEach(choice => {
                    choice.classList.remove('selected', 'computer-selected');
                });
            }, 2000);
        }
    }, 1500);
}

/*
    إعادة تعيين اللعبة من البداية
*/
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    document.getElementById('result').textContent = '';
    document.getElementById('result').className = 'game-result';
    document.getElementById('final').textContent = '';

    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.remove('selected', 'computer-selected');
    });

    gameOver = false;
    isPlaying = false;
}

/*
    تهيئة اللعبة عند تحميل الصفحة
*/
window.onload = function() {
    // ربط كل اختيار لاعب بزر الضغط الخاص بيه
    document.querySelectorAll('#playerSection .choice').forEach(choice => {
        choice.addEventListener('click', () => {
            const playerChoice = choice.getAttribute('data-choice');
            playGame(playerChoice);
        });
    });
};
