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
  
    const fireInput = document.getElementById("fire-key");
  if (fireInput) {
    fireInput.addEventListener("keydown", (e) => {
      e.preventDefault();
      fireInput.value = e.key.toUpperCase();
    });
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && dialog.open) {
        dialog.close();
      }
    });
  }
});

  
function login() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
  
    // קריאה למידע מהמערכת (localStorage)
    const storedUser = localStorage.getItem("user");
    const storedPass = localStorage.getItem("pass");

    // משתמש קבוע
    const fixedUser = "p";
    const fixedPass = "testuser";
  
    // תנאים לבדיקה
    if (
        (username === storedUser && password === storedPass) ||
        (username === fixedUser && password === fixedPass)
      ) {
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
      
    function startGame() {
        const music = document.getElementById("background-music");
        music.currentTime = 0;
        music.play();


        const fireKey = document.getElementById("fire-key").value;
        const duration = document.getElementById("game-duration").value;
        const theme = document.getElementById("theme-select").value;

        if (!fireKey) {
            alert("Please select a fire key.");
            return;
        }

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
        document.getElementById("scoreboard").style.display = "block";

        const container = document.getElementById("game-container");

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const playerWidth = player.offsetWidth;
        const playerHeight = player.offsetHeight;

        // מיקום התחלתי קבוע – באמצע למטה בתוך ה-canvas
        const startX = (containerWidth - playerWidth) / 2;
        const startY = containerHeight - playerHeight - 5; // טיפה מעל התחתית

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

    }

    function endGame() {
        const music = document.getElementById("background-music");
        music.pause();
    
        alert("Game Over!");
        location.reload();
    }
    



    document.addEventListener("keydown", (event) => {
        const player = document.getElementById("player");
        const canvas = document.getElementById("gameCanvas");
    
        if (!player || !canvas) return;
    
        const step = 10; // כמה פיקסלים לזוז בכל לחיצה
        const playerRect = player.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
    
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
                if (top - step >= canvas.height * 0.6) top -= step;  // עד 60% מגובה ה-canvas
                break;
            case "ArrowDown":
                if (top + step + player.offsetHeight <= canvas.height) top += step;
                break;
        }
    
        player.style.left = `${left}px`;
        player.style.top = `${top}px`;
    });
    
      

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
    let enemySpeed = 1;
    
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
        
        // אם אחד מהם הגיע לקצה – שנה כיוון
        if (reachedEdge) {
            enemyDirection *= -1;
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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
            alert("You win!");
            endGame();}

        requestAnimationFrame(gameLoop);
    }

    const enemyBullets = [];
    const enemyBulletSpeed = 4;
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
        const playerRect = player.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
    
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
    
                if (lives === 0) {
                    alert("Game Over!");
                    endGame();
                }
                return;
            }
        }
        document.getElementById("death-sound").play();
    }

    let playerBullets = [];
    let playerBulletSpeed = 6;
    let score = 0;
    let lives = 3;
    let speedIncreaseCount = 0;

    document.addEventListener("keydown", (event) => {
        const fireKey = document.getElementById("fire-key");
        const letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", " "];

        letters.forEach(key => {
        const option = document.createElement("option");
        option.value = key === " " ? " " : key;
        option.text = key === " " ? "Space" : key;
        fireKeySelect.appendChild(option);  
    });
    });

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
                    const points = (4 - rowIndex) * 5; // 4 -> 5pts, 3->10pts ...
                    score += points;
                    document.getElementById("score").textContent = score;
    
                    enemies.splice(j, 1);
                    playerBullets.splice(i, 1);
                    break;
                }
            }
        }
        document.getElementById("hit-sound").play();
    }

    setInterval(() => {
        if (speedIncreaseCount < 4) {
            enemySpeed += 0.5;
            playerBulletSpeed += 0.5;
            speedIncreaseCount++;
        }
    }, 5000);
    




    
    
    


