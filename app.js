// DOM refs
const dots = document.getElementById("dots");
const initSection = document.getElementById("init-section");
const scannerSection = document.getElementById("scanner-section");
const finalMessage = document.getElementById("final-message");
const celebrationEffects = document.getElementById("celebration-effects");
const birthdayDisplay = document.getElementById("birthday-display");
const sparkContainer = document.getElementById("spark-container");
const banner = document.querySelector(".birthday-banner");
const heading = document.querySelector(".birthday-heading");
const letterSection = document.getElementById("letter-section");
const letterBox = document.querySelector(".letter-container");
const letterScrollBtn = document.getElementById("letter-scroll-btn");


// Prevent scroll on initial load
document.body.style.overflow = "hidden";


// Dot animation for "Initializing..."
let dotCount = 1;
const dotInterval = setInterval(() => {
  dotCount = (dotCount % 3) + 1;
  dots.textContent = ".".repeat(dotCount);
}, 500);

// Step 1: Initializing for 5s
setTimeout(() => {
  // stop dots
  clearInterval(dotInterval);
  // hide init section
  initSection.classList.add("hidden");

  // Step 2: show scanner
  scannerSection.classList.remove("hidden");

  // Step 2 duration: 4s (scanner runs)
  setTimeout(() => {
    // hide scanner, show final message
    scannerSection.classList.add("hidden");
    finalMessage.classList.remove("hidden");

    // trigger celebratory heart + confetti (immediately)
    triggerCelebration();

    // keep final message for 4.2s (so effects play)
    setTimeout(() => {
      finalMessage.classList.add("hidden");
    }, 4200);

    // after celebration finished (give small buffer) -> show birthday-display
    setTimeout(() => {
      showBirthdayDisplay();
      triggerCelebration();
    }, 4200); // bumped slightly after confetti

  }, 4000);

}, 5000);

// ---------------- celebration (hearts + confetti) ----------------
function triggerCelebration() {
  celebrationEffects.classList.remove("hidden");

  // Hearts
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.style.left = (Math.random() * 120 - 10) + "%"; // -10% to 110%
    h.style.bottom = "-10px";
    h.style.opacity = 0.95;
    h.style.transform = "rotate(45deg)";
    celebrationEffects.appendChild(h);
    // remove after animation
    setTimeout(() => h.remove(), 5000);
  }

  // Confetti (DOM pieces) - large spread, random colors
  const colors = ["#ffd700", "#ffecb3", "#ffb703", "#f4a261", "#ffb6c1"];
  for (let i = 0; i < 36; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = (Math.random() * 140 - 20) + "%"; // -20% to 120%
    c.style.top = (-80 - Math.random() * 80) + "px"; // -80 to -160
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    celebrationEffects.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }

  // Canvas confetti burst (optional extra)
  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 120,
      origin: { y: 0.6 },
      scalar: 0.9
    });
  }
}

// ---------------- show birthday display + spark burst + golden glow ----------------
function showBirthdayDisplay() {
  // reveal display and activate background style
  birthdayDisplay.classList.remove("hidden");
  birthdayDisplay.classList.add("active-bg");

  // smooth fade-in for banner & heading
  banner.style.opacity = 0;
  heading.style.opacity = 0;

  setTimeout(() => {
    banner.style.opacity = 1;
    banner.classList.add("golden-pulse");
  }, 200);

  setTimeout(() => {
    heading.style.opacity = 1;
    heading.classList.add("golden-pulse");
  }, 600);

  // 🔹 Spark burst & extra confetti after 2.5 s
  setTimeout(() => {
    triggerCelebration();   // reuse confetti + hearts
    // Delay spark burst by 3 seconds
    setTimeout(() => {
      sparkBurst();
    }, 2500);
  }, 100);

  // keep subtle glow looping
  banner.classList.add("soft-glow");
  heading.classList.add("soft-glow");
}

// spark burst implementation
function sparkBurst() {
  if (!sparkContainer) return;
  const rect = banner.getBoundingClientRect();
  // center relative to page
  const centerX = rect.left + rect.width / 2 + window.scrollX;
  const centerY = rect.top + rect.height / 2 + window.scrollY;

  // create small sparks
  for (let i = 0; i < 30; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    // random direction and distance
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 100;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;

    // place at center (relative to viewport) using fixed position
    s.style.left = (centerX) + "px";
    s.style.top = (centerY) + "px";

    // set target via CSS variable
    s.style.setProperty("--x", x + "px");
    s.style.setProperty("--y", y + "px");

    sparkContainer.appendChild(s);
    setTimeout(() => s.remove(), 900);

    // Inside showBirthdayDisplay()
    // setTimeout(() => {
    //   sparkBurst();
    //   triggerCelebration();
    // }, 2000);

    // 🟡 Show scroll button 5s later (after all effects)
    setTimeout(() => {
      const scrollBtn = document.getElementById("scroll-btn");
      scrollBtn.classList.remove("hidden");
      scrollBtn.classList.add("show");
    }, 2200);

    // Enable scroll + smooth move on click
    document.getElementById("scroll-btn").addEventListener("click", () => {
      document.body.style.overflow = "auto"; // unlock scroll
      const nextSection = document.querySelector("#letter-section"); // or your next section id
      nextSection.scrollIntoView({ behavior: "smooth" });
    });
  }
}

// ---------------- LETTER SECTION FADE-IN ON SCROLL ----------------
// Letter section reveal + delayed scroll-button
(function () {
  const letterSection = document.getElementById("letter-section");
  const letterBox = letterSection ? letterSection.querySelector(".letter-container") : null;
  const letterBtn = document.getElementById("letter-scroll-btn");
  let buttonTimer = null;
  let revealed = false;

  if (!letterSection || !letterBox || !letterBtn) return; // safety

  // IntersectionObserver to reveal when user scrolls to the letter section
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !revealed) {
        revealed = true;
        // reveal the letter box
        letterBox.classList.add("revealed");

        // start 15-second timer to show the button
        buttonTimer = setTimeout(() => {
          letterBtn.classList.remove("hidden");
          letterBtn.classList.add("show");
        }, 20000); // 20000 ms = 20 seconds

        // we don't need to observe anymore
        obs.disconnect();
      }
    });
  }, { threshold: 0.45 }); // 45% visibility triggers

  obs.observe(letterSection);
  
  // optional: if user scrolls away before 15s, keep the timer running — that's intended.
})();
// LETTER SECTION → Celebration section scroll
letterScrollBtn.addEventListener("click", () => {
  document.body.style.overflow = "auto";
  const next = document.querySelector("#celebration-section");
  if (next) {
    next.scrollIntoView({ behavior: "smooth" });
  }
  startCelebrationSlides()
});

/* CELEBRATION SECTION – FULL JS FUNCTIONALITY */

function startCelebrationSlides() {

  /* ------------------ GET ELEMENTS ------------------ */
  const celebrateSlide   = document.getElementById("slide-celebrate");
  const candleSlide      = document.getElementById("slide-candle");
  const wishSlide        = document.getElementById("slide-wish");
  const errorSlide       = document.getElementById("slide-error");
  const followSlide      = document.getElementById("slide-follow");

  const flame            = document.getElementById("flame");
  const smokeContainer   = document.getElementById("smoke-container");
  const blowBtn          = document.getElementById("blow-btn");
  const blowGuide        = document.getElementById("blow-guide");

  const audio            = document.getElementById("hb-audio");
  const audioFallback    = document.getElementById("audio-fallback");
  const fallbackPlayBtn  = document.getElementById("play-audio-fallback");

  const slides = [
    celebrateSlide,
    candleSlide,
    wishSlide,
    errorSlide,
    followSlide
  ];

  let current = 0;

  /* ------------------ HELPER: SHOW SLIDE ------------------ */
  function showSlide(i) {
    slides.forEach((s, index) => {
      if (!s) return;
      s.classList.toggle("show", index === i);
    });
    current = i;
  }


  /* SHOW "LET'S CELEBRATE" */
  showSlide(0);
  // showBirthdayDisplay();
  triggerCelebration();

  setTimeout(() => {

    /* SHOW CANDLE SLIDE */
    showSlide(1);

    // Fade-in guide text
    blowGuide.style.opacity = "1";

    /* START MUSIC (2s later) */
    setTimeout(() => {
      if (audio) {
        let p = audio.play();
        if (p !== undefined) {
          p.catch(() => {
            audioFallback.classList.remove("hidden");
          });
        }
      }
    }, 2000);

    /* Autoplay fallback */
    if (fallbackPlayBtn) {
      fallbackPlayBtn.onclick = () => {
        audio.play();
        audioFallback.classList.add("hidden");
      };
    }

    /* AUTO BLOW THE CANDLE (8s after candle slide) */
    setTimeout(() => {
      blowCandle();
    }, 8000);

    /* Manual blow button backup */
    // blowBtn.onclick = blowCandle;

    /* -------------------------
   📌 MANUAL BLOW + COUNTDOWN
    ---------------------------*/
    let autoBlowTime = 8; // seconds before auto blow
    const blowCount = document.getElementById("blow-count");

    // live countdown on button
    const countdownInterval = setInterval(() => {
      autoBlowTime--;
      if (blowCount) blowCount.textContent = autoBlowTime;

      if (autoBlowTime <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // manual blow handler
    blowBtn.onclick = () => {
      clearInterval(countdownInterval);
      blowBtn.disabled = true;
      blowBtn.textContent = "Blowing...";
      blowCandle();
    };


  }, 4300); // Delay after Let's Celebrate slide



  /* BLOW CANDLE FUNCTION */
  function blowCandle() {

    if (!flame) {
      goToWish();
      return;
    }

    // Blow animation
    flame.style.transition = "opacity .6s ease, transform .6s ease";
    flame.style.opacity = "0";
    flame.style.transform = "translateX(-50%) scaleY(0.2)";

    // Optional small puff sound
    try {
      const puff = new Audio("puff.mp3");
      puff.volume = 0.8;
      puff.play();
    } catch (e) {}

    // Smoke effect
    createSmoke();

    // After animation go to wish slide
    setTimeout(() => {
      goToWish();
    }, 3500);
  }


  /* SMOKE EFFECT */
  function createSmoke() {
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("div");
      s.className = "smoke-puff";

      const size = 14 + Math.random() * 18;
      const drift = (Math.random() - 0.5) * 50;

      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = 50 + drift + "%";

      smokeContainer.appendChild(s);

      setTimeout(() => s.remove(), 3000);
    }
  }


  /* WISH TEXT → ERROR → FOLLOW UP MESSAGE */
  
  function goToWish() {

    // Show "Make a wish"
    showSlide(2);

    setTimeout(() => {

      // Show glitch error
      showSlide(3);

      // keep error for 5s then show follow-up
      setTimeout(() => {

        showSlide(4);

        // show final scroll button after follow-up message
        const finalBtn = document.getElementById("final-scroll-btn");

        setTimeout(() => {
          finalBtn.classList.remove("hidden");
          finalBtn.classList.add("show");
        }, 15000);

      }, 8000);  // <-- error stays for 5 seconds

    }, 10000);
  }


}


/* AUTO-START CELEBRATION WHEN SECTION ENTERS VIEW */
document.addEventListener("DOMContentLoaded", () => {

  const target = document.getElementById("celebration-section");
  if (!target) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCelebrationSlides();
        observer.disconnect(); // run only once
      }
    });
  }, { threshold: 0.4 });

  observer.observe(target);
});

// FINAL BUTTON → scroll to last section
document.getElementById("final-scroll-btn").addEventListener("click", () => {
    const next = document.querySelector("#closing-section");  // change ID if needed
    if (next) {
        next.scrollIntoView({ behavior: "smooth" });
    }
});

/* Reveal Closing Section on Scroll */
(function () {
  const closing = document.getElementById("closing-section");
  if (!closing) return;

  const box = closing.querySelector(".closing-box");

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        box.classList.add("revealed");
        obs.disconnect();
      }
    });
  }, { threshold: 0.35 });

  obs.observe(closing);
})();
