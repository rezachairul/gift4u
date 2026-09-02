(() => {
  // ============================================================
  // HELPER
  // ============================================================

  const $ = (selector) => document.querySelector(selector);

  const pages = {
    login: $("#loginPage"),
    game: $("#gamePage"),
    collage: $("#collagePage"),
    final: $("#finalPage"),
  };

  const bgMusic = $("#bgMusic");
  const challengeMusic = $("#challengeMusic");

  // Game state
  let game = {
    flipped: [],
    matched: 0,
    locked: false,
  };

  let messageIndex = 0;

  // ============================================================
  // PAGE NAVIGATION
  // ============================================================

  function showPage(page) {
    Object.values(pages).forEach((p) => {
      if (p) {
        p.classList.remove("active");
      }
    });

    if (page) {
      page.classList.add("active");
    }
  }

  // ============================================================
  // MUSIC
  // ============================================================

  function startBirthdayMusic() {
    if (challengeMusic) {
      challengeMusic.pause();
      challengeMusic.currentTime = 0;
    }

    if (bgMusic) {
      bgMusic.play().catch(() => {
        console.log("Background music membutuhkan interaksi user.");
      });
    }
  }

  function startChallengeMusic() {
    if (bgMusic) {
      bgMusic.pause();
    }

    if (challengeMusic) {
      challengeMusic.currentTime = 0;

      challengeMusic.play().catch(() => {
        console.log("Challenge music membutuhkan interaksi user.");
      });
    }
  }

  // ============================================================
  // DATE VALIDATION
  // ============================================================

  function validDate(value) {
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);

    if (!match) {
      return false;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  // ============================================================
  // BIRTH DATE INPUT FORMAT
  // ============================================================

  const birthDateInput = $("#birthDate");

  if (birthDateInput) {
    birthDateInput.addEventListener("input", (e) => {
      let value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 8);

      if (value.length > 4) {
        value =
          value.slice(0, 2) +
          "-" +
          value.slice(2, 4) +
          "-" +
          value.slice(4);
      } else if (value.length > 2) {
        value =
          value.slice(0, 2) +
          "-" +
          value.slice(2);
      }

      e.target.value = value;
    });
  }

  // ============================================================
  // LOGIN
  // ============================================================

  const loginForm = $("#loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("#fullName").value.trim();
      const birth = $("#birthDate").value.trim();
      const error = $("#loginError");

      // Validasi kosong
      if (!name || !birth) {
        error.textContent =
          "Nama dan tanggal lahir wajib diisi.";

        return;
      }

      // Validasi nama
      if (
        name.toLowerCase() !==
        BIRTHDAY_CONFIG.allowedName.toLowerCase()
      ) {
        error.textContent =
          "Nama belum sesuai. Coba periksa lagi ya. ♡";

        return;
      }

      // Validasi tanggal lahir
      if (
        !validDate(birth) ||
        birth !== BIRTHDAY_CONFIG.allowedBirthDate
      ) {
        error.textContent =
          "Tanggal lahir belum sesuai. Gunakan format DD-MM-YYYY.";

        return;
      }

      // Reset error
      error.textContent = "";

      // Pindah ke game
      showPage(pages.game);

      // Mulai music
      startChallengeMusic();

      // Mulai game
      initGame();
    });
  }

  // ============================================================
  // MEMORY GAME
  // ============================================================

  function initGame() {
    console.log("Memory game initialized");

    // 6 ICON
    const icons = [
      "🎉",
      "🎁",
      "♥️",
      "💝",
      "💌",
      "💋",
    ];

    // Duplicate = 12 cards
    const deck = [...icons, ...icons];

    // Fisher-Yates shuffle
    shuffle(deck);

    const board = $("#gameBoard");

    if (!board) {
      console.error("#gameBoard tidak ditemukan!");

      return;
    }

    // Reset board
    board.innerHTML = "";

    // Reset game state
    game = {
      flipped: [],
      matched: 0,
      locked: false,
    };

    // Reset status
    const gameStatus = $("#gameStatus");

    if (gameStatus) {
      gameStatus.textContent =
        "0 / 6 pasangan ditemukan 💕";
    }

    // Hide next button
    const gameNext = $("#gameNext");

    if (gameNext) {
      gameNext.classList.add("hidden");
    }

    // Create cards
    deck.forEach((icon, index) => {
      const card = document.createElement("button");

      // IMPORTANT
      card.type = "button";

      card.className = "memory-card";

      card.dataset.icon = icon;
      card.dataset.index = index;

      card.setAttribute(
        "aria-label",
        "Kartu memory"
      );

      card.innerHTML = `
        <span class="card-inner">

          <!-- FRONT / TERTUTUP -->
          <span class="card-face card-front">
            ♡
          </span>

          <!-- BACK / ICON -->
          <span class="card-face card-back">
            ${icon}
          </span>

        </span>
      `;

      // CLICK EVENT
      card.addEventListener("click", () => {
        flipCard(card);
      });

      board.appendChild(card);
    });
  }

  // ============================================================
  // SHUFFLE
  // ============================================================

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [array[i], array[j]] = [
        array[j],
        array[i],
      ];
    }

    return array;
  }

  // ============================================================
  // FLIP CARD
  // ============================================================

  function flipCard(card) {
    console.log(
      "Card clicked:",
      card.dataset.icon
    );

    // Jangan bisa klik saat game locked
    if (game.locked) {
      return;
    }

    // Jangan flip kartu yang sudah terbuka
    if (card.classList.contains("flipped")) {
      return;
    }

    // Jangan klik kartu yang sudah match
    if (card.classList.contains("matched")) {
      return;
    }

    // ==========================================================
    // FLIP CARD
    // ==========================================================

    card.classList.add("flipped");

    // Tambahkan ke kartu yang sedang dibuka
    game.flipped.push(card);

    // ==========================================================
    // BARU 1 KARTU
    // ==========================================================

    if (game.flipped.length === 1) {
      return;
    }

    // ==========================================================
    // SUDAH 2 KARTU
    // ==========================================================

    if (game.flipped.length === 2) {
      game.locked = true;

      const firstCard = game.flipped[0];
      const secondCard = game.flipped[1];

      const firstIcon =
        firstCard.dataset.icon;

      const secondIcon =
        secondCard.dataset.icon;

      console.log(
        "Compare:",
        firstIcon,
        secondIcon
      );

      // ========================================================
      // MATCH
      // ========================================================

      if (firstIcon === secondIcon) {
        handleMatch(
          firstCard,
          secondCard
        );
      }

      // ========================================================
      // NOT MATCH
      // ========================================================

      else {
        handleMismatch(
          firstCard,
          secondCard
        );
      }
    }
  }

  // ============================================================
  // HANDLE MATCH
  // ============================================================

  function handleMatch(
    firstCard,
    secondCard
  ) {
    setTimeout(() => {
      firstCard.classList.add(
        "matched"
      );

      secondCard.classList.add(
        "matched"
      );

      // Tambah score
      game.matched++;

      // Reset flipped
      game.flipped = [];

      // Unlock
      game.locked = false;

      // Update status
      updateGameStatus();

      // Semua pasangan selesai
      if (game.matched === 6) {
        gameCompleted();
      }
    }, 500);
  }

  // ============================================================
  // HANDLE MISMATCH
  // ============================================================

  function handleMismatch(
    firstCard,
    secondCard
  ) {
    setTimeout(() => {
      // Tutup kembali
      firstCard.classList.remove(
        "flipped"
      );

      secondCard.classList.remove(
        "flipped"
      );

      // Reset
      game.flipped = [];

      // Unlock
      game.locked = false;
    }, 1000);
  }

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  function updateGameStatus() {
    const gameStatus = $("#gameStatus");

    if (!gameStatus) {
      return;
    }

    gameStatus.textContent =
      `${game.matched} / 6 pasangan ditemukan 💕`;
  }

  // ============================================================
  // GAME COMPLETED
  // ============================================================

  function gameCompleted() {
    const gameStatus = $("#gameStatus");
    const gameNext = $("#gameNext");

    if (gameStatus) {
      gameStatus.textContent =
        "Yeay! Semua pasangan berhasil ditemukan! 🎉💝";
    }

    if (gameNext) {
      setTimeout(() => {
        gameNext.classList.remove(
          "hidden"
        );
      }, 500);
    }
  }

  // ============================================================
  // NEXT GAME
  // ============================================================

  const gameNext = $("#gameNext");

  if (gameNext) {
    gameNext.addEventListener(
      "click",
      () => {
        showPage(pages.collage);

        startBirthdayMusic();

        initCollage();
      }
    );
  }

  // ============================================================
  // PHOTO
  // ============================================================

  function photoHTML(filename) {
    return `
      <img
        class="photo"
        src="assets/images/${filename}"
        alt="Memory photo"
        loading="lazy"
      >
    `;
  }

  // ============================================================
  // INIT COLLAGE
  // ============================================================

  function initCollage() {
    const rowTop = $("#rowTop");
    const rowBottom = $("#rowBottom");

    if (!rowTop || !rowBottom) {
      return;
    }

    const top =
      BIRTHDAY_CONFIG.topPhotos
        .map(photoHTML)
        .join("");

    const bottom =
      BIRTHDAY_CONFIG.bottomPhotos
        .map(photoHTML)
        .join("");

    // Duplicate agar infinite loop
    rowTop.innerHTML =
      top + top;

    rowBottom.innerHTML =
      bottom + bottom;

    // Reset message
    messageIndex = 0;

    renderMessage(messageIndex);
  }

  // ============================================================
  // RENDER MESSAGE
  // ============================================================

  function renderMessage(index) {
    const data =
      BIRTHDAY_CONFIG.messages[index];

    if (!data) {
      return;
    }

    const card = $("#messageCard");

    // Restart animation
    if (card) {
      card.style.animation = "none";

      void card.offsetWidth;

      card.style.animation =
        "cardIn .55s ease";
    }

    // Message number
    const messageNumber =
      $("#messageNumber");

    if (messageNumber) {
      messageNumber.textContent =
        `${String(index + 1)
          .padStart(2, "0")} / ${String(
            BIRTHDAY_CONFIG.messages.length
          ).padStart(2, "0")}`;
    }

    // Icon
    const messageIcon =
      $("#messageIcon");

    if (messageIcon) {
      messageIcon.textContent =
        data.icon;
    }

    // Title
    const messageTitle =
      $("#messageTitle");

    if (messageTitle) {
      messageTitle.textContent =
        data.title;
    }

    // Text
    const messageText =
      $("#messageText");

    if (messageText) {
      messageText.textContent =
        data.text;
    }

    // Next button
    const messageNext =
      $("#messageNext");

    // Last message
    if (
      index ===
      BIRTHDAY_CONFIG.messages.length - 1
    ) {
      if (messageText) {
        messageText.innerHTML = `
          ${data.text}

          <br>
          <br>

          <video
            controls
            playsinline
            preload="metadata"
            style="
              width: 100%;
              max-height: 190px;
              border-radius: 16px;
              margin-top: 4px;
              background: #f4d9e2;
            "
          >
            <source
              src="assets/video/birthday.mp4"
              type="video/mp4"
            >

            Browser kamu belum mendukung video.
          </video>
        `;
      }

      if (messageNext) {
        messageNext.textContent =
          "Finish ♥";
      }
    } else {
      if (messageNext) {
        messageNext.textContent =
          "→";
      }
    }
  }

  // ============================================================
  // NEXT MESSAGE
  // ============================================================

  const messageNext =
    $("#messageNext");

  if (messageNext) {
    messageNext.addEventListener(
      "click",
      () => {
        // Last message
        if (
          messageIndex ===
          BIRTHDAY_CONFIG.messages.length - 1
        ) {
          showPage(pages.final);

          return;
        }

        // Next message
        messageIndex++;

        renderMessage(
          messageIndex
        );
      }
    );
  }

  // ============================================================
  // RESTART
  // ============================================================

  const restartBtn =
    $("#restartBtn");

  if (restartBtn) {
    restartBtn.addEventListener(
      "click",
      () => {
        // Reset message
        messageIndex = 0;

        // Reset form
        $("#fullName").value = "";
        $("#birthDate").value = "";

        // Reset game
        game = {
          flipped: [],
          matched: 0,
          locked: false,
        };

        // Stop music
        if (bgMusic) {
          bgMusic.pause();

          bgMusic.currentTime = 0;
        }

        if (challengeMusic) {
          challengeMusic.pause();

          challengeMusic.currentTime = 0;
        }

        // Back to login
        showPage(pages.login);
      }
    );
  }

  // ============================================================
  // AUDIO FALLBACK
  // ============================================================

  document.addEventListener(
    "click",
    () => {
      if (
        pages.collage &&
        pages.collage.classList.contains(
          "active"
        ) &&
        bgMusic &&
        bgMusic.paused
      ) {
        bgMusic.play().catch(() => {});
      }
    },
    {
      passive: true,
    }
  );

})();