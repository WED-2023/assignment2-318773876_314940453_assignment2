function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");
    screens.forEach(screen => {
      screen.style.display = "none";
    });
  
    document.getElementById(screenId).style.display = "block";
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
  
    // תנאים לבדיקה
    if (
      (username === "testuser") || 
      (username === storedUser && password === storedPass)
    ) {
      showScreen("configuration"); 
    } else {
       document.getElementById("login-error").innerText = "Incorrect username or password. Please try again.";
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
        const fireKey = document.getElementById("fire-key").value;
        const duration = document.getElementById("game-duration").value;
        const theme = document.getElementById("theme-select").value;
      
        if (!fireKey) {
          alert("Please select a fire key.");
          return;
        }
      
        // כאן אפשר לשמור את ההגדרות ב-localStorage או להעביר למסך הבא
        console.log("Fire Key:", fireKey);
        console.log("Duration:", duration);
        console.log("Theme:", theme);
      
        showScreen("game"); // או מסך אחר שמגיע אחרי קונפיגורציה
      }
      

  
 

  
  