document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     HTMLを取得
  ========================= */

  const imageInput =
    document.getElementById("imageInput");

  const preview =
    document.getElementById("preview");

  const previewBox =
    document.getElementById("previewBox");

  const photoText =
    document.getElementById("photoText");

  const nameInput =
    document.getElementById("nameInput");

  const startButton =
    document.getElementById("startButton");

  const retryButton =
    document.getElementById("retryButton");

  const startScreen =
    document.getElementById("startScreen");

  const gameScreen =
    document.getElementById("gameScreen");

  const resultScreen =
    document.getElementById("resultScreen");

  const canvas =
    document.getElementById("gameCanvas");

  const ctx =
    canvas.getContext("2d");

  const timeText =
    document.getElementById("timeText");

  const lifeText =
    document.getElementById("lifeText");

  const bestText =
    document.getElementById("bestText");

  const levelText =
    document.getElementById("levelText");

  const notice =
    document.getElementById("notice");

  const resultTitle =
    document.getElementById("resultTitle");

  const finalTime =
    document.getElementById("finalTime");

  const miteCount =
    document.getElementById("miteCount");

  const itemCount =
    document.getElementById("itemCount");

  const snackCount =
    document.getElementById("snackCount");

  const speedRating =
    document.getElementById("speedRating");

  const alertRating =
    document.getElementById("alertRating");

  const commentText =
    document.getElementById("commentText");

  const resultImage =
    document.getElementById("resultImage");


  /* =========================
     ゲームデータ
  ========================= */

  let playerImage = null;

  let running = false;

  let startTime = 0;

  let elapsed = 0;

  let lastSpawn = 0;

  let lastItemSpawn = 0;

  let lives = 3;

  let totalMites = 0;

  let collectedItems = 0;

  let snacks = 0;

  let hitUntil = 0;

  let boostUntil = 0;

  let currentName = "このぬい";

  let mites = [];

  let items = [];

  let mouseX = 0;

  let mouseY = 0;

  let mouseActive = false;


  const player = {

    x: 0,

    y: 0,

    width: 100,

    height: 100

  };


  let best =
    Number(
      localStorage.getItem(
        "nuiEscapeBest"
      )
    ) || 0;


  bestText.textContent =
    best.toFixed(1);


  /* =========================
     今日のひとこと
  ========================= */

  const comments = [

    "まあ、こんなもん。",
    "次はもうちょい頑張ろう。",
    "途中から雑。",
    "逃げてるだけなのに疲れた。",
    "おやつ食べてました。",
    "ダニ、多すぎ。",
    "そこにいた。",
    "なんかずっと走ってた。",
    "普通に危なかった。",
    "最後ちょっと惜しかった。",
    "結構逃げた。",
    "思ったより生きた。",
    "もう寝ます。",
    "今日はここまで。",
    "知らんけど。",
    "たぶん大丈夫。",
    "次は勝てる気がする。",
    "ほうきに救われました。",
    "スプレー強すぎ。",
    "おやつしか見てない。",
    "ダニを見失いました。",
    "途中から何も考えてない。",
    "逃げるのうまい。",
    "普通に怖かった。",
    "もう一回やる？",
    "まだいけた。",
    "惜しい。",
    "終わった。",
    "無理でした。",
    "よくわからないけど生きた。"

  ];


  /* =========================
     写真読み込み
  ========================= */

  imageInput.addEventListener(
    "change",
    function () {

      const file =
        imageInput.files &&
        imageInput.files[0];


      if (!file) {
        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        function (event) {

          const img =
            new Image();


          img.onload =
            function () {

              playerImage =
                img;

              preview.src =
                event.target.result;

              previewBox.style.display =
                "block";

              photoText.textContent =
                "📷 写真を変更する";

            };


          img.src =
            event.target.result;

        };


      reader.readAsDataURL(file);

    }
  );


  /* =========================
     キャンバス
  ========================= */

  function resizeCanvas() {

    const dpr =
      window.devicePixelRatio || 1;

    canvas.width =
      window.innerWidth * dpr;

    canvas.height =
      window.innerHeight * dpr;

    canvas.style.width =
      window.innerWidth + "px";

    canvas.style.height =
      window.innerHeight + "px";

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

  }


  window.addEventListener(
    "resize",
    resizeCanvas
  );


  resizeCanvas();


  /* =========================
     マウス操作
  ========================= */

  window.addEventListener(
    "mousemove",
    function (event) {

      if (!running) {
        return;
      }

      mouseX =
        event.clientX;

      mouseY =
        event.clientY;

      mouseActive =
        true;

    }
  );


  /* =========================
     スマホ操作
  ========================= */

  window.addEventListener(
    "touchmove",
    function (event) {

      if (!running) {
        return;
      }

      const touch =
        event.touches[0];

      if (!touch) {
        return;
      }

      mouseX =
        touch.clientX;

      mouseY =
        touch.clientY;

      mouseActive =
        true;

    },
    {
      passive: true
    }
  );


  /* =========================
     プレイヤーサイズ
  ========================= */

  function setPlayerSize() {

    if (!playerImage) {
      return;
    }


    const maxWidth = 130;

    const maxHeight = 130;


    const scale =
      Math.min(
        maxWidth /
          playerImage.width,

        maxHeight /
          playerImage.height
      );


    player.width =
      playerImage.width *
      scale;

    player.height =
      playerImage.height *
      scale;

  }


  /* =========================
     ゲーム開始
  ========================= */

  startButton.addEventListener(
    "click",
    startGame
  );


  retryButton.addEventListener(
    "click",
    startGame
  );


  function startGame() {

    if (!playerImage) {

      alert(
        "先にぬいの写真を選んでね"
      );

      return;

    }


    currentName =
      nameInput.value.trim();


    if (!currentName) {

      currentName =
        "このぬい";

    }


    startScreen.style.display =
      "none";

    gameScreen.style.display =
      "block";

    resultScreen.style.display =
      "none";


    resizeCanvas();

    setPlayerSize();


    player.x =
      window.innerWidth / 2;

    player.y =
      window.innerHeight / 2;


    mites = [];

    items = [];

    lives = 3;

    elapsed = 0;

    totalMites = 0;

    collectedItems = 0;

    snacks = 0;

    hitUntil = 0;

    boostUntil = 0;

    mouseActive = false;


    lifeText.textContent =
      "♥♥♥";


    timeText.textContent =
      "0.0";


    levelText.textContent =
      "LEVEL 1";


    startTime =
      performance.now();

    lastSpawn =
      startTime;

    lastItemSpawn =
      startTime;

    running = true;


    spawnMite();


    requestAnimationFrame(
      gameLoop
    );

  }


  /* =========================
     ダニを作る
  ========================= */

  function spawnMite() {

    const side =
      Math.floor(
        Math.random() * 4
      );


    let x = 0;

    let y = 0;


    if (side === 0) {

      x =
        Math.random() *
        window.innerWidth;

      y = -20;

    }


    if (side === 1) {

      x =
        window.innerWidth + 20;

      y =
        Math.random() *
        window.innerHeight;

    }


    if (side === 2) {

      x =
        Math.random() *
        window.innerWidth;

      y =
        window.innerHeight + 20;

    }


    if (side === 3) {

      x = -20;

      y =
        Math.random() *
        window.innerHeight;

    }


    const level =
      Math.floor(
        elapsed / 5
      );


    const angle =
      Math.random() *
      Math.PI *
      2;


    const speed =
      0.35 +
      Math.random() * 0.45 +
      level * 0.055;


    mites.push({

      x: x,

      y: y,

      vx:
        Math.cos(angle) *
        speed,

      vy:
        Math.sin(angle) *
        speed,

      size:
        7 +
        Math.random() * 4,

      turn:
        60 +
        Math.random() *
        180

    });


    totalMites++;

  }


  /* =========================
     ダニを動かす
  ========================= */

  function updateMites() {

    mites.forEach(
      function (mite) {

        mite.x +=
          mite.vx;

        mite.y +=
          mite.vy;


        mite.turn--;


        if (
          mite.turn <= 0
        ) {

          const angle =
            Math.atan2(
              mite.vy,
              mite.vx
            ) +
            (
              Math.random() -
              .5
            ) *
            1.5;


          const speed =
            Math.sqrt(
              mite.vx *
                mite.vx +
              mite.vy *
                mite.vy
            );


          mite.vx =
            Math.cos(angle) *
            speed;

          mite.vy =
            Math.sin(angle) *
            speed;


          mite.turn =
            50 +
            Math.random() *
            180;

        }


        if (
          mite.x <
          mite.size
        ) {

          mite.x =
            mite.size;

          mite.vx =
            Math.abs(
              mite.vx
            );

        }


        if (
          mite.x >
          window.innerWidth -
          mite.size
        ) {

          mite.x =
            window.innerWidth -
            mite.size;

          mite.vx =
            -Math.abs(
              mite.vx
            );

        }


        if (
          mite.y <
          mite.size
        ) {

          mite.y =
            mite.size;

          mite.vy =
            Math.abs(
              mite.vy
            );

        }


        if (
          mite.y >
          window.innerHeight -
          mite.size
        ) {

          mite.y =
            window.innerHeight -
            mite.size;

          mite.vy =
            -Math.abs(
              mite.vy
            );

        }

      }
    );

  }


  /* =========================
     ぬいを動かす
  ========================= */

  function updatePlayer() {

    if (!mouseActive) {
      return;
    }


    let speed =
      0.075;


    if (
      performance.now() <
      boostUntil
    ) {

      speed =
        0.12;

    }


    player.x +=
      (
        mouseX -
        player.x
      ) *
      speed;


    player.y +=
      (
        mouseY -
        player.y
      ) *
      speed;


    const halfW =
      player.width / 2;

    const halfH =
      player.height / 2;


    player.x =
      Math.max(
        halfW,
        Math.min(
          window.innerWidth -
            halfW,
          player.x
        )
      );


    player.y =
      Math.max(
        halfH,
        Math.min(
          window.innerHeight -
            halfH,
          player.y
        )
      );

  }


  /* =========================
     アイテム
  ========================= */

  function spawnItem() {

    const types = [
      "vacuum",
      "spray",
      "snack"
    ];


    const type =
      types[
        Math.floor(
          Math.random() *
          types.length
        )
      ];


    items.push({

      type: type,

      x:
        40 +
        Math.random() *
        (
          window.innerWidth -
          80
        ),

      y:
        120 +
        Math.random() *
        Math.max(
          100,
          window.innerHeight -
          180
        ),

      size: 24

    });

  }


  function drawItem(item) {

    let emoji = "🍪";


    if (
      item.type === "vacuum"
    ) {

      emoji = "🧹";

    }


    if (
      item.type === "spray"
    ) {

      emoji = "🧴";

    }


    ctx.font =
      "27px sans-serif";

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";


    const bob =
      Math.sin(
        performance.now() / 250
      ) * 3;


    ctx.fillText(
      emoji,
      item.x,
      item.y + bob
    );

  }


  function collectItem(item) {

    collectedItems++;


    if (
      item.type === "vacuum"
    ) {

      mites = [];


      showNotice(
        "🧹 掃除機！　ダニが全部いなくなった"
      );

    }


    /* ★ここが修正済み */

    if (
      item.type === "spray"
    ) {

      boostUntil =
        performance.now() +
        5000;


      showNotice(
        "🧴 スプレー！　5秒間だいじょうぶ"
      );

    }


    if (
      item.type === "snack"
    ) {

      snacks++;


      showNotice(
        "🍪 おやつ！　ちょっと速くなった"
      );

    }

  }


  function checkItems() {

    for (
      let i =
        items.length - 1;
      i >= 0;
      i--
    ) {

      const item =
        items[i];


      const dx =
        player.x -
        item.x;

      const dy =
        player.y -
        item.y;


      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      if (
        distance <
        Math.max(
          player.width,
          player.height
        ) / 2 +
        item.size
      ) {

        collectItem(
          item
        );


        items.splice(
          i,
          1
        );

      }

    }

  }


  /* =========================
     ダニとの衝突
  ========================= */

  function checkCollision() {

    /*
      スプレー中は無敵
    */

    if (
      performance.now() <
      boostUntil
    ) {

      return;

    }


    /*
      被弾直後も無敵
    */

    if (
      performance.now() <
      hitUntil
    ) {

      return;

    }


    for (
      let i =
        mites.length - 1;
      i >= 0;
      i--
    ) {

      const mite =
        mites[i];


      const dx =
        player.x -
        mite.x;

      const dy =
        player.y -
        mite.y;


      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      const playerRadius =
        Math.max(
          player.width,
          player.height
        ) * .38;


      if (
        distance <
        playerRadius +
        mite.size
      ) {

        lives--;


        mites.splice(
          i,
          1
        );


        hitUntil =
          performance.now() +
          1200;


        updateLives();


        if (
          lives <= 0
        ) {

          gameOver();

        }


        break;

      }

    }

  }


  function updateLives() {

    lifeText.textContent =
      "♥".repeat(lives) +
      "♡".repeat(
        3 - lives
      );

  }


  /* =========================
     背景
  ========================= */

  function drawBackground() {

    ctx.fillStyle =
      "#d9d0c7";


    ctx.fillRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );


    ctx.globalAlpha =
      0.07;


    ctx.strokeStyle =
      "#665a52";


    ctx.lineWidth =
      1;


    const gap = 40;


    for (
      let x = 0;
      x < window.innerWidth;
      x += gap
    ) {

      ctx.beginPath();

      ctx.moveTo(
        x,
        0
      );

      ctx.lineTo(
        x,
        window.innerHeight
      );

      ctx.stroke();

    }


    for (
      let y = 0;
      y < window.innerHeight;
      y += gap
    ) {

      ctx.beginPath();

      ctx.moveTo(
        0,
        y
      );

      ctx.lineTo(
        window.innerWidth,
        y
      );

      ctx.stroke();

    }


    ctx.globalAlpha =
      1;

  }


  /* =========================
     ダニ描画
  ========================= */

  function drawMite(mite) {

    ctx.save();


    ctx.translate(
      mite.x,
      mite.y
    );


    ctx.strokeStyle =
      "#554039";

    ctx.lineWidth =
      1.3;


    for (
      let i = 0;
      i < 8;
      i++
    ) {

      const angle =
        Math.PI *
        2 /
        8 *
        i;


      ctx.beginPath();

      ctx.moveTo(
        Math.cos(angle) * 3,
        Math.sin(angle) * 3
      );

      ctx.lineTo(
        Math.cos(angle) * 10,
        Math.sin(angle) * 10
      );

      ctx.stroke();

    }


    ctx.beginPath();

    ctx.ellipse(
      0,
      0,
      mite.size,
      mite.size * .72,
      0,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      "#674d42";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
      mite.size * .65,
      0,
      mite.size * .32,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      "#3e302b";

    ctx.fill();


    ctx.restore();

  }


  /* =========================
     ぬい描画
  ========================= */

  function drawPlayer() {

    if (!playerImage) {
      return;
    }


    ctx.save();


    ctx.beginPath();

    ctx.ellipse(
      player.x,
      player.y +
        player.height / 2 +
        5,
      player.width * .35,
      6,
      0,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      "rgba(50,40,30,.13)";

    ctx.fill();


    /*
      写真そのまま
      丸くしない
    */

    ctx.drawImage(
      playerImage,

      player.x -
        player.width / 2,

      player.y -
        player.height / 2,

      player.width,

      player.height
    );


    /* =========================
       被弾中 → 赤
    ========================= */

    if (
      performance.now() <
      hitUntil
    ) {

      ctx.beginPath();

      ctx.arc(
        player.x,
        player.y,
        Math.max(
          player.width,
          player.height
        ) * .65,
        0,
        Math.PI * 2
      );


      ctx.strokeStyle =
        "rgba(220,70,70,.9)";

      ctx.lineWidth =
        4;

      ctx.shadowColor =
        "rgba(220,70,70,.4)";

      ctx.shadowBlur =
        10;

      ctx.stroke();

    }


    /* =========================
       スプレー中 → 白いバリア
    ========================= */

    if (
      performance.now() <
      boostUntil
    ) {

      const pulse =
        Math.sin(
          performance.now() / 180
        ) * 4;


      ctx.beginPath();

      ctx.arc(
        player.x,
        player.y,
        Math.max(
          player.width,
          player.height
        ) * .72 +
        pulse,
        0,
        Math.PI * 2
      );


      ctx.strokeStyle =
        "rgba(255,255,255,.95)";

      ctx.lineWidth =
        4;

      ctx.shadowColor =
        "rgba(255,255,255,.9)";

      ctx.shadowBlur =
        14;

      ctx.stroke();


      ctx.beginPath();

      ctx.arc(
        player.x,
        player.y,
        Math.max(
          player.width,
          player.height
        ) * .62,
        0,
        Math.PI * 2
      );


      ctx.strokeStyle =
        "rgba(255,255,255,.4)";

      ctx.lineWidth =
        2;

      ctx.shadowBlur =
        0;

      ctx.stroke();

    }


    ctx.restore();

  }


  /* =========================
     通知
  ========================= */

  function showNotice(text) {

    notice.textContent =
      text;

    notice.style.opacity =
      "1";


    clearTimeout(
      showNotice.timer
    );


    showNotice.timer =
      setTimeout(
        function () {

          notice.style.opacity =
            "0";

        },
        1500
      );

  }


  /* =========================
     ゲームループ
  ========================= */

  function gameLoop(now) {

    if (!running) {
      return;
    }


    elapsed =
      (
        now -
        startTime
      ) / 1000;


    timeText.textContent =
      elapsed.toFixed(1);


    const level =
      Math.floor(
        elapsed / 5
      );


    levelText.textContent =
      "LEVEL " +
      (level + 1);


    /*
      5秒ごとに難しくなる
    */

    const spawnInterval =
      Math.max(
        4500 -
          level * 500,
        900
      );


    if (
      now -
      lastSpawn >
      spawnInterval
    ) {

      const amount =
        Math.min(
          1 +
            Math.floor(
              level / 2
            ),
          5
        );


      for (
        let i = 0;
        i < amount;
        i++
      ) {

        spawnMite();

      }


      lastSpawn =
        now;

    }


    /*
      アイテムを出す
    */

    if (
      now -
      lastItemSpawn >
      6500
    ) {

      spawnItem();

      lastItemSpawn =
        now;

    }


    drawBackground();

    updatePlayer();

    updateMites();


    items.forEach(
      drawItem
    );


    mites.forEach(
      drawMite
    );


    drawPlayer();


    checkItems();

    checkCollision();


    requestAnimationFrame(
      gameLoop
    );

  }


  /* =========================
     星
  ========================= */

  function stars(number) {

    return (
      "★".repeat(number) +
      "☆".repeat(
        5 - number
      )
    );

  }


  /* =========================
     ゲーム終了
  ========================= */

  function gameOver() {

    running = false;


    if (
      elapsed >
      best
    ) {

      best =
        elapsed;


      localStorage.setItem(
        "nuiEscapeBest",
        best
      );


      bestText.textContent =
        best.toFixed(1);

    }


    /* リザルトにぬいの写真 */

    resultImage.src =
      playerImage.src;


    resultTitle.textContent =
      currentName +
      "、よく頑張った。";


    finalTime.textContent =
      elapsed.toFixed(1) +
      "秒";


    miteCount.textContent =
      totalMites +
      "匹";


    itemCount.textContent =
      collectedItems +
      "個";


    snackCount.textContent =
      snacks +
      "個";


    speedRating.textContent =
      stars(
        Math.max(
          1,
          Math.min(
            5,
            Math.floor(
              elapsed / 8
            ) + 1
          )
        )
      );


    alertRating.textContent =
      stars(
        Math.max(
          1,
          Math.min(
            5,
            6 -
            Math.floor(
              elapsed / 10
            )
          )
        )
      );


    commentText.textContent =
      comments[
        Math.floor(
          Math.random() *
          comments.length
        )
      ];


    resultScreen.style.display =
      "flex";

  }

});
