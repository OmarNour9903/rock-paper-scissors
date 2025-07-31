let playerScore = 0;
let computerScore = 0;
let isPlaying = false;
let gameOver = false;

// AudioContext object
// صوت بيتوافق مع المتصفحات القديمه والجديده
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Sound effects using Web Audio API
function playSound(type) {
    if (type === 'win') {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                // مولد الصوت اللي بيطلع النغمه
                const oscillator = audioContext.createOscillator();
                // صوت الفوز
                const gainNode = audioContext.createGain();
                
                // بنوصل الصوت للمتحكم ف الصوت 
                oscillator.connect(gainNode);
                // بنوصل المتحكم ف الصوت بالسماعه
                gainNode.connect(audioContext.destination); // السماعه الخارجيه

                // كل مرة بيشغل صوت الفوز النغمة بتتغير عشوائيًا شوية علشان تبقى حماسية ومتكررش نفس الصوت بالضبط.
                oscillator.frequency.setValueAtTime(200 + Math.random() * 200, audioContext.currentTime); // التردد = من 200 إلى 400 Hz (لأننا ضفنا Math.random() * 200).
                // نغمه غليظه =(200Hz) و نغمه خفيفه =(400Hz)

                // هنا شده الصوت 0.1 يعني شده الصوت منخفضه
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                // هناا على مدار 0.3 ثانية، قلّل الصوت تدريجيًا من 0.1 إلى 0.01
                // الصوت يبدا عالي وينخفض تدريجياً
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                // دا اللي بيقول للصوت اشتغل
                oscillator.start();
                // الصوت بينخفض بعد 0.8 ثانيه
                oscillator.stop(audioContext.currentTime + 0.8);
            }, i * 100);
        }
    } else if (type === 'lose') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    } else if (type === 'tie') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

function showCelebration(emoji) {
    // هنا عملنا div جديد ف الصفحه
    const celebration = document.createElement('div');
    // اديناله كلاس عشان اقدر اتحكم فييه وف الاستايل بتاعه
    celebration.className = 'celebration';
    // بتحط الإيموجي جوه الـ div
    celebration.textContent = emoji;
    document.body.appendChild(celebration);

    // بعد 2 ثانية (2000 ملي ثانية)، بتشيل العنصر تاني علشان يختفي من الشاشة
    setTimeout(() => {
        document.body.removeChild(celebration);
    }, 2000);
}

function playGame(playerChoice) {
    if (isPlaying || gameOver) return; // لو اللعبة شغالة أو خلصت، متعملش حاجة
    isPlaying = true;

    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const resultDiv = document.getElementById('result');

    // شيل التحديد القديم
    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.remove('selected', 'computer-selected');
    });

    // يحدد اختيار اللاعب
    document.querySelector(`[data-choice="${playerChoice}"]`).classList.add('selected');

    // يظهر رسالة مؤقتة إن الكمبيوتر بيفكر
    resultDiv.textContent = "Computer is choosing...";
    resultDiv.className = 'game-result computer-thinking';

    setTimeout(() => {
        // بعد 1.5 ثانية، الكمبيوتر يختار
        document.querySelector(`[data-choice="${computerChoice}"]`).classList.add('computer-selected');

        let result, resultClass, soundType, celebrationEmoji;

        if (playerChoice === computerChoice) {
            result = "It's a tie! 🤝";
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

        resultDiv.textContent = result;
        resultDiv.className = `game-result ${resultClass}`;
        playSound(soundType);
        showCelebration(celebrationEmoji);

        // لو حد وصل لـ 5 نقاط
        if (playerScore === 5 || computerScore === 5) {
            const finalMessage = playerScore === 5
                ? "You won the game 🤩"
                : "Computer won the game 😓";

            setTimeout(() => {
                document.getElementById("final").textContent = finalMessage;
                gameOver = true;
            }, 2200);
        } else {
            // يرجّع اللعبة تاني بعد 2 ثانية
            setTimeout(() => {
                isPlaying = false;
                document.querySelectorAll('.choice').forEach(choice => {
                    choice.classList.remove('selected', 'computer-selected');
                });
            }, 2000);
        }
    }, 1500);
}

// reset Game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    document.getElementById('result').textContent = '';
    document.getElementById('result').className = 'game-result';

    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.remove('selected', 'computer-selected');
    });

    document.getElementById('final').textContent = ''; // اخفاء الرسالة بعد الريست
    gameOver = false; // يرجّع التحكم في اللعب
    isPlaying = false;
}

// هناا بنختار كل العناصر اللي واخده choice اللي هما حجر او ورقه او مقص
document.querySelectorAll('.choice').forEach(choice => {
    // لما اليوزر يضغط علي اي واحده من ال3 اللي واخدين choice
    //  يقرا نوع ال  data-choice بتاعها اي 
    choice.addEventListener('click', () => {
        const playerChoice = choice.getAttribute('data-choice');
        // بيشغل اللعبه والfunction playGame()
        playGame(playerChoice);
    });
});
