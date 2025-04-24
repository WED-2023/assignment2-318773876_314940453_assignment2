let selectedFireKey = null;
let speedIncreaseCount = 0;
let enemySpeed = 2;
let enemyBulletSpeed = 4;
let gameDuration = 0;        
let timeRemaining = 0;       
let timerInterval = null;
let playerBullets = [];
let playerBulletSpeed = 6;
let score = 0;
let lives = 3;
let gameEnded = false;
let keysPressed = {};
let manualRestart = false;
let fireInterval = null;

function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");
    screens.forEach(screen => {
        screen.classList.remove("active");
    });
  
    document.getElementById(screenId).classList.add("active");
} 

function registerUser() {
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    const first = document.getElementById("reg-firstname").value.trim();
    const last = document.getElementById("reg-lastname").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const day = document.getElementById("reg-day").value;
    const month = document.getElementById("reg-month").value;
    const year = document.getElementById("reg-year").value;
  
    // בדיקת מילוי כל השדות
    if (!username || !password || !confirm || !first || !last || !email || !day || !month || !year) {
      alert("Please fill in all fields.");
      return false;
    }
  
    // אימות סיסמה
    if (password.length < 8 || !/\d/.test(password)) {
      alert("Password must be at least 8 characters and include a number.");
      return false;
    }
  
    if (password !== confirm) {
      alert("Passwords do not match.");
      return false;
    }
  
    // בדיקת שם פרטי ומשפחה – אותיות בלבד
    if (!/^[A-Za-z]+$/.test(first)) {
      alert("First name must contain only letters.");
      return false;
    }
  
    if (!/^[A-Za-z]+$/.test(last)) {
      alert("Last name must contain only letters.");
      return false;
    }
  
    // בדיקת אימייל
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
  
    // שמירה מקומית (פשוטה)
    localStorage.setItem("user", username);
    localStorage.setItem("pass", password);
  
    alert("Registration successful! You can now login.");
    showScreen("login");
    return false;
  }

  window.addEventListener("DOMContentLoaded", () => {

    const fireKeySelect = document.getElementById("fire-key");
    const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", " "];

    letters.forEach(key => {
        const option = document.createElement("option");
        option.value = key === " " ? " " : key;
        option.text = key === " " ? "Space" : key;
        fireKeySelect.appendChild(option);  
    });


    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
    document.getElementById('welcome').classList.add('active');
      
    const daySelect = document.getElementById("reg-day");
    const monthSelect = document.getElementById("reg-month");
    const yearSelect = document.getElementById("reg-year");
  
    // יום: 1 עד 31
    for (let i = 1; i <= 31; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;
      daySelect.appendChild(option);
    }
  
    // חודש: 1 עד 12
    for (let i = 1; i <= 12; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;
      monthSelect.appendChild(option);
    }
  
    // שנה: 1900 עד השנה הנוכחית
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;
      yearSelect.appendChild(option);
    }

    const dialog = document.getElementById("aboutDialog");
    if (dialog) {
        dialog.addEventListener("click", (event) => {
        const rect = dialog.getBoundingClientRect();
        const clickedInDialog =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (!clickedInDialog) {
            dialog.close();
        }
        });
        }

    document.querySelector('#new-game-box button').addEventListener('click', startNewGame);

});

  
function login() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
  
    // קריאה למידע מהמערכת (localStorage)
    const storedUser = localStorage.getItem("user");
    const storedPass = localStorage.getItem("pass");

    const prevUser = localStorage.getItem("lastUser");
    if (prevUser && prevUser !== username) {
        localStorage.removeItem(`scoreHistory_${prevUser}`);
    }
    localStorage.setItem("lastUser", username);

    // משתמש קבוע
    const fixedUser = "p";
    const fixedPass = "testuser";
  
    // תנאים לבדיקה
    if (
        (username === storedUser && password === storedPass) ||
        (username === fixedUser && password === fixedPass)
      ) {
        localStorage.setItem("currentUser", username); 
        showScreen("configuration");
      } else {
        document.getElementById("login-error").innerText =
          "Incorrect username or password. Please try again.";
      }
  }

  function openAbout() {
    const dialog = document.getElementById("aboutDialog");
    dialog.showModal();
  }
  
  function closeAbout() {
    const dialog = document.getElementById("aboutDialog");
    if (dialog.open) dialog.close();
  }
      
    function startGame(skipHistory = false) {
        manualRestart = skipHistory;

        const music = document.getElementById("background-music");
        music.currentTime = 0;
        music.play();

        selectedFireKey = document.getElementById("fire-key").value;
        const duration = document.getElementById("game-duration").value;
        const theme = document.getElementById("theme-select").value;

        if (!selectedFireKey) {
            alert("Please select a fire key.");
            return;
        }

        // עדכון זמן המשחק לפי הבחירה
        gameDuration = parseInt(duration);
        timeRemaining = gameDuration * 60; 
        updateTimerDisplay();

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                endGame("time");
            }
        }, 1000);

        // שינוי תמונת החללית לפי צבע
        const player = document.getElementById("player");

        if (theme === "blue") {
            player.style.backgroundImage = "url('images/blue.png')";
        } else if (theme === "purple") {
            player.style.backgroundImage = "url('images/purple.png')";
        } else if (theme === "pink") {
            player.style.backgroundImage = "url('images/pink.png')";
        } else {
            player.style.backgroundImage = "url('images/blue.png')";
        }

        showScreen("game");
        document.getElementById("new-game-box").style.display = "block";
        document.getElementById("scoreboard").style.display = "block";

        const container = document.getElementById("game-container");

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const playerWidth = player.offsetWidth;
        const playerHeight = player.offsetHeight;

        // מיקום התחלתי קבוע
        const startX = (containerWidth - playerWidth) / 2;
        const startY = containerHeight - playerHeight - 5;  

        player.style.left = `${startX}px`;
        player.style.top = `${startY}px`;

        // איפוס מערך האויבים
        enemies.length = 0;

        for (let row = 0; row < enemyRows; row++) {
            for (let col = 0; col < enemyCols; col++) {
                const x = enemyOffsetLeft + col * (enemyWidth + enemyPadding);
                const y = enemyOffsetTop + row * (enemyHeight + enemyPadding);
                const img = enemyImages[row]; 
                enemies.push({ x, y, img});
            }
        }

        let imagesLoaded = 0;
        enemyImages.forEach(img => {
        if (img.complete) {
            imagesLoaded++;
        } else {
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === enemyImages.length) {
                    gameLoop();
                }
            };
        }
        });

        if (imagesLoaded === enemyImages.length) {
            gameLoop();
        }

        speedIncreaseCount = 0;
        enemySpeed = 2;
        enemyBulletSpeed = 4;

        setInterval(() => {
            if (speedIncreaseCount < 4) {
                enemySpeed *= 1.5;
                enemyBulletSpeed *= 1.3;
                speedIncreaseCount++;
            }
        }, 5000);

    }

    function endGame(reason) {
        gameEnded = true;  
        clearInterval(timerInterval); 
        const music = document.getElementById("background-music");
        music.pause();
    
        const messageBox = document.getElementById("end-message");
        let message = "";
    
        if (reason === "lost") {
            message = "You Lost!";
        } else if (reason === "time") {
            if (score < 100) {
                message = `You can do better. Score: ${score}`;
            } else {
                message = `Winner! Score: ${score}`;
            }
        } else if (reason === "allEnemiesDestroyed") {
            message = "Champion!";
        } else {
            message = "Game Over!";
        }
    
        messageBox.innerHTML = `<p style="font-size: 24px; color: white;">${message}</p>`;
        messageBox.style.display = "block";
    
        if (!manualRestart) {
            const currentUser = localStorage.getItem("currentUser");
            saveScoreToHistory(currentUser, score);
            showScoreHistory(currentUser);
        }        

        if (!manualRestart) {
            setTimeout(() => {
                location.reload();
            }, 6000);
        }
    }

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    const enemyRows = 4;
    const enemyCols = 5;
    const enemyWidth = 40;
    const enemyHeight = 40;
    const enemyPadding = 20;
    const enemyOffsetTop = 30;
    const enemyOffsetLeft = 30;
    
    let enemyDirection = 1; // 1 = right, -1 = left
    
    const enemies = [];

    const enemyImages = [
        new Image(),
        new Image(),
        new Image(),
        new Image()
      ];
      
      enemyImages[0].src = "images/bad.png"; // תמונה לשורה הראשונה
      enemyImages[1].src = "images/bad2.png"; // לשורה השנייה
      enemyImages[2].src = "images/bad3.png"; // לשורה השלישית
      enemyImages[3].src = "images/bad4.png"; // לשורה הרביעית
      

    function drawEnemies() {
        enemies.forEach(enemy => {
            if (enemy.img.complete) {
                ctx.drawImage(enemy.img, enemy.x, enemy.y, enemyWidth, enemyHeight);
            } else {
                ctx.fillStyle = "red";
                ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
            }
        });
    }
      
    function updateEnemies() {
    // בודק אם אחד מהאויבים הגיע לגבול
        let reachedEdge = false;
        
        enemies.forEach(enemy => {
            enemy.x += enemySpeed * enemyDirection;
            if (enemy.x + enemyWidth > canvas.width || enemy.x < 0) {
                reachedEdge = true;
            }
        });
        
        if (reachedEdge) {
            enemyDirection *= -1;
        }
    }

    function gameLoop() {
        if (gameEnded) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // תנועה רציפה של השחקן
        const player = document.getElementById("player");
        const step = 5;
        let top = player.offsetTop;
        let left = player.offsetLeft;

        if (keysPressed["ArrowLeft"] && left - step >= 0) left -= step;
        if (keysPressed["ArrowRight"] && left + step + player.offsetWidth <= canvas.width) left += step;
        if (keysPressed["ArrowUp"] && top - step >= canvas.height * 0.6) top -= step;
        if (keysPressed["ArrowDown"] && top + step + player.offsetHeight <= canvas.height) top += step;

        player.style.left = `${left}px`;
        player.style.top = `${top}px`;

        drawEnemies();
        updateEnemies();

        fireEnemyBullet();
        updateEnemyBullets();
        drawEnemyBullets();
        checkEnemyBulletCollisionWithPlayer();

        updatePlayerBullets();
        drawPlayerBullets();
        checkPlayerBulletCollision();

        if (enemies.length === 0) {
            endGame("allEnemiesDestroyed");
            return;
        }

        requestAnimationFrame(gameLoop);
    }

    const enemyBullets = [];
    const fireThresholdY = canvas.height * 0.75;  // שלב הירי הבא - אחרי שעבר 3/4 מהמסך
    let lastBulletFired = null;

    function fireEnemyBullet() {
        // בדוק אם כבר יש כדור שלא עבר 3/4 מהמסך
        if (lastBulletFired && lastBulletFired.y < fireThresholdY) return;
    
        // בחר חללית רנדומלית
        const shootingEnemies = enemies.filter(e => e); // כל האויבים הקיימים
        if (shootingEnemies.length === 0) return;
    
        const randomIndex = Math.floor(Math.random() * shootingEnemies.length);
        const shooter = shootingEnemies[randomIndex];
    
        const bullet = {
            x: shooter.x + enemyWidth / 2 - 2,
            y: shooter.y + enemyHeight,
            width: 4,
            height: 10,
        };
    
        enemyBullets.push(bullet);
        lastBulletFired = bullet;
    }

    function updateEnemyBullets() {
        enemyBullets.forEach(bullet => {
            bullet.y += enemyBulletSpeed;
        });
    
        // הסרה של כדורים שיצאו מהמסך
        while (enemyBullets.length > 0 && enemyBullets[0].y > canvas.height) {
            enemyBullets.shift();
        }
    }

    function drawEnemyBullets() {
        ctx.fillStyle = "red";
        enemyBullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    function checkEnemyBulletCollisionWithPlayer() {
        const player = document.getElementById("player");
    
        const playerX = player.offsetLeft;
        const playerY = player.offsetTop;
        const playerW = player.offsetWidth;
        const playerH = player.offsetHeight;
    
        for (const bullet of enemyBullets) {
            if (
                bullet.x < playerX + playerW &&
                bullet.x + bullet.width > playerX &&
                bullet.y < playerY + playerH &&
                bullet.y + bullet.height > playerY
            ) {
                lives--;
                document.getElementById("lives").textContent = lives;
                enemyBullets.splice(enemyBullets.indexOf(bullet), 1);
    
                 // איפוס מיקום החללית לנקודת ההתחלה:
                const container = document.getElementById("game-container");
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;
                const playerWidth = player.offsetWidth;
                const playerHeight = player.offsetHeight;

                const startX = (containerWidth - playerWidth) / 2;
                const startY = containerHeight - playerHeight - 5;

                player.style.left = `${startX}px`;
                player.style.top = `${startY}px`;

                document.getElementById("death-sound").currentTime = 0;
                document.getElementById("death-sound").play();

                if (lives === 0) {
                    endGame("lost");
                    return;
                }
                return;
            }
        }
    }


    function updatePlayerBullets() {
        playerBullets.forEach(bullet => bullet.y -= playerBulletSpeed);
        playerBullets = playerBullets.filter(b => b.y > 0);
    }
    
    function drawPlayerBullets() {
        ctx.fillStyle = "white";
        playerBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
    }

    function checkPlayerBulletCollision() {
        for (let i = playerBullets.length - 1; i >= 0; i--) {
            const bullet = playerBullets[i];
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (
                    bullet.x < enemy.x + enemyWidth &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemyHeight &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    // ניקוד לפי שורה
                    const rowIndex = Math.floor((enemy.y - enemyOffsetTop) / (enemyHeight + enemyPadding));
                    const points = (4 - rowIndex) * 5; 
                    score += points;
                    document.getElementById("score").textContent = score;
    
                    enemies.splice(j, 1);
                    playerBullets.splice(i, 1);
                    document.getElementById("hit-sound").currentTime = 0;
                    document.getElementById("hit-sound").play();
                    break;
                }
            }
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        document.getElementById("time-left").textContent = formatted;
    }    

    document.addEventListener("keydown", (event) => {
        // אם המשחק נגמר – אל תעשה כלום
        if (gameEnded) return;
    
        // מניעת גלילה בחצים
        const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault();
        }

        keysPressed[event.key] = true;
    
        //  סגירת about
        if (event.key === "Escape") {
            closeAbout();
            return;
        }
    
        //  אם נלחץ input של fire-key – נעדכן את הערך בו (למעלה)
        const fireInput = document.getElementById("fire-key");
        if (document.activeElement === fireInput) {
            event.preventDefault();
            fireInput.value = event.key.toUpperCase();
            return;
        }
    
        //  תזוזת החללית
        const player = document.getElementById("player");
        const canvas = document.getElementById("gameCanvas");
        if (!player || !canvas) return;
    
        const step = 10;
        let top = player.offsetTop;
        let left = player.offsetLeft;
    
        switch (event.key) {
            case "ArrowLeft":
                if (left - step >= 0) left -= step;
                break;
            case "ArrowRight":
                if (left + step + player.offsetWidth <= canvas.width) left += step;
                break;
            case "ArrowUp":
                if (top - step >= canvas.height * 0.6) top -= step;
                break;
            case "ArrowDown":
                if (top + step + player.offsetHeight <= canvas.height) top += step;
                break;
        }
    
        player.style.left = `${left}px`;
        player.style.top = `${top}px`;
    
        // ירי (רק אם יש fire key)
        const keyPressed = event.key === " " || event.code === "Space" ? " " : event.key.toUpperCase();
        if (selectedFireKey && keyPressed === selectedFireKey && !fireInterval) {
            fireBullet(); 
            fireInterval = setInterval(() => {
                fireBullet();
            }, 250);
        }
    });

    function fireBullet() {
        const player = document.getElementById("player");
        if (playerBullets.length >= 3) return;
    
        const bullet = {
            x: player.offsetLeft + player.offsetWidth / 2 - 2,
            y: player.offsetTop,
            width: 4,
            height: 10
        };
        playerBullets.push(bullet);
    
        const shootSound = document.getElementById("shoot-sound");
        if (shootSound) {
            shootSound.currentTime = 0;
            shootSound.play();
        }
    }
    

    document.addEventListener("keyup", (event) => {
        delete keysPressed[event.key];
        const keyReleased = event.key === " " || event.code === "Space" ? " " : event.key.toUpperCase();
        if (keyReleased === selectedFireKey && fireInterval) {
            clearInterval(fireInterval);
            fireInterval = null;
        }
    });
    
    function showScoreHistory(username) {
        const history = getScoreHistory(username);
        const table = document.createElement("table");
        table.style.marginTop = "20px";
        table.style.color = "white";
        table.style.width = "100%";
        table.innerHTML = `
            <tr><th>Rank</th><th>Score</th></tr>
            ${history.map((s, i) => `
                <tr ${s === score ? 'style="font-weight:bold;background:#444"' : ""}>
                    <td>${i + 1}</td><td>${s}</td>
                </tr>
            `).join("")}
        `;
        const messageBox = document.getElementById("end-message");
        messageBox.appendChild(table);
    }

    function startNewGame() {
        stopGame();
        gameEnded = false;
        score = 0;
        document.getElementById("score").textContent = 0;
        lives = 3;
        document.getElementById("lives").textContent = 3;

        const messageBox = document.getElementById("end-message");
        messageBox.style.display = "none";
        messageBox.innerHTML = "";

        speedIncreaseCount = 0;
        enemySpeed = 2;
        enemyBulletSpeed = 4;
     
        startGame(true);
    }
    

    function getScoreHistory(username) {
        const raw = localStorage.getItem(`scoreHistory_${username}`);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }
    
    function saveScoreToHistory(username, score) {
        if (!username) return;
        const history = getScoreHistory(username);
        history.push(score);
        history.sort((a, b) => b - a); // מיון יורד
        localStorage.setItem(`scoreHistory_${username}`, JSON.stringify(history));
    }
    
    function stopGame() {
        clearInterval(timerInterval);  
        gameEnded = true;  
    }

    // function resetGame() {
    //     // איפוס משתנים
    //     score = 0;
    //     lives = 3;
    //     timeRemaining = gameDuration * 60; 
    //     speedIncreaseCount = 0;
    //     enemySpeed = 2;
    //     enemyBulletSpeed = 4;
    //     playerBullets = [];
    //     enemyBullets = [];
      
    //     // איפוס המיקום של החללית
    //     resetPlayerPosition();
    
    //     // יצירת אויבים מחדש (לאפס את רשימת האויבים)
    //     enemies.length = 0;
    //     for (let row = 0; row < enemyRows; row++) {
    //         for (let col = 0; col < enemyCols; col++) {
    //             const x = enemyOffsetLeft + col * (enemyWidth + enemyPadding);
    //             const y = enemyOffsetTop + row * (enemyHeight + enemyPadding);
    //             const img = enemyImages[row]; 
    //             enemies.push({ x, y, img});
    //         }
    //     }
    
    //     document.getElementById("score").textContent = 0;
    //     document.getElementById("lives").textContent = 3;
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);

    //     // להתחיל את הלולאה מחדש אם יש צורך
    //     gameLoop();
    // }
    
    // function resetPlayerPosition() {
    //     const player = document.getElementById("player");
    //     const container = document.getElementById("game-container");
    //     const containerWidth = container.offsetWidth;
    //     const containerHeight = container.offsetHeight;
    //     const playerWidth = player.offsetWidth;
    //     const playerHeight = player.offsetHeight;
    
    //     // איפוס המיקום של החללית למרכז המסך (בתחתית)
    //     const startX = (containerWidth - playerWidth) / 2;
    //     const startY = containerHeight - playerHeight - 5;
    
    //     player.style.left = `${startX}px`;
    //     player.style.top = `${startY}px`;
    // }
    
    
    


    
    