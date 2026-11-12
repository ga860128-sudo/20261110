// 儲存停止動畫的橫向精靈圖。
let stopSheet; // 保留載入完成的停止動畫圖片。
// 儲存行走動畫的橫向精靈圖。
let walkSheet; // 保留載入完成的行走動畫圖片。
// 儲存跳躍動畫的橫向精靈圖。
let jumpSheet; // 保留載入完成的跳躍動畫圖片。
// 設定角色目前的水平位置。
let characterX = 0; // 角色會在 setup() 中移到畫布中央。
// 設定角色目前的垂直位置。
let characterY = 0; // 角色會在 setup() 中移到畫布中央。
// 設定角色站立時的垂直位置。
let groundY = 0; // 跳躍完成後角色會回到這個高度。
// 設定角色目前的垂直速度。
let verticalVelocity = 0; // 負值向上移動，正值向下移動。
// 記錄角色是否正在跳躍。
let isJumping = false; // 空中時播放跳躍動畫。
// 設定角色面向的方向，1 代表右方，-1 代表左方。
let facingDirection = 1; // 角色一開始面向右方。
// 設定精靈圖中的動畫格數。
const FRAME_COUNT = 8; // 停止與行走動畫都各有八格。
// 設定跳躍精靈圖中的動畫格數。
const JUMP_FRAME_COUNT = 14; // 跳躍動畫有十四格。
// 設定每一動畫格持續的畫面數。
const FRAME_DELAY = 6; // 數值越大，動畫播放速度越慢。
// 設定跳躍動畫每一格持續的畫面數。
const JUMP_FRAME_DELAY = 2; // 讓十四格動畫可在一次跳躍中循環播放。
// 設定角色每一畫面移動的像素數。
const MOVE_SPEED = 4; // 按住方向鍵時角色持續移動。
// 設定跳躍起跳速度與重力。
const JUMP_SPEED = 12; // 起跳時向上的初速度。
const GRAVITY = 0.6; // 每一畫面將角色向下加速。

// 在畫布建立前載入動畫圖片。
function preload() { // p5.js 會等 preload() 載入圖片後才執行 setup()。
  // 載入停止動畫精靈圖，並在失敗時於主控台顯示錯誤。
  stopSheet = loadImage('2/stop/stop.png', undefined, (error) => console.error('停止動畫圖片載入失敗：', error)); // 使用相對於 index.html 的圖片路徑。
  // 載入行走動畫精靈圖，並在失敗時於主控台顯示錯誤。
  walkSheet = loadImage('2/walk/wolk.png', undefined, (error) => console.error('行走動畫圖片載入失敗：', error)); // 保留圖片檔名 wolk.png。
  // 載入跳躍動畫精靈圖，並在失敗時於主控台顯示錯誤。
  jumpSheet = loadImage('2/jump/jump.png', undefined, (error) => console.error('跳躍動畫圖片載入失敗：', error)); // 圖片包含十四格跳躍動畫。
} // 結束 preload()。

// 建立全螢幕畫布並設定角色初始位置。
function setup() { // p5.js 在圖片載入完成後執行此函式。
  // 依照目前瀏覽器視窗大小建立畫布。
  createCanvas(windowWidth, windowHeight); // 畫布寬高會配合整個視窗。
  // 將角色的水平位置設在畫布中央。
  characterX = width / 2; // 角色一開始位於畫布中央。
  // 將角色的垂直位置設在畫布中央。
  groundY = height / 2; // 角色站立時位於畫布中央。
  characterY = groundY; // 角色一開始位於站立高度。
  // 讓畫布不會因預設樣式產生額外邊界。
  imageMode(CENTER); // 以角色中心點作為圖片繪製座標。
} // 結束 setup()。

// 每一畫面更新角色位置並繪製動畫。
function draw() { // p5.js 會持續呼叫 draw() 形成動畫。
  // 填滿指定的淺綠色背景。
  background('#b5e48c'); // 背景顏色為 b5e48c。
  // 記錄目前是否正在移動。
  let isWalking = false; // 沒有按方向鍵時播放停止動畫。
  // 按住鍵盤右方向鍵時向右移動。
  if (keyIsDown(RIGHT_ARROW)) { // 持續檢查右方向鍵是否按住。
    characterX += MOVE_SPEED; // 將角色往畫面右方移動。
    facingDirection = 1; // 讓角色面向右方。
    isWalking = true; // 切換到行走動畫。
  } // 結束右方向鍵判斷。
  // 按住鍵盤左方向鍵時向左移動。
  else if (keyIsDown(LEFT_ARROW)) { // 持續檢查左方向鍵是否按住。
    characterX -= MOVE_SPEED; // 將角色往畫面左方移動。
    facingDirection = -1; // 讓角色面向左方。
    isWalking = true; // 切換到行走動畫。
  } // 結束左方向鍵判斷。
  // 跳躍時套用垂直速度與重力。
  if (isJumping) { // 角色離開地面後持續更新跳躍位置。
    characterY += verticalVelocity; // 依目前速度更新垂直位置。
    verticalVelocity += GRAVITY; // 重力逐漸讓角色向下落。
    // 角色落回站立高度時結束跳躍。
    if (characterY >= groundY) { // 判斷角色是否已經落地。
      characterY = groundY; // 將角色對齊站立高度。
      verticalVelocity = 0; // 清除落地後的垂直速度。
      isJumping = false; // 恢復待機或行走動畫。
    } // 結束落地判斷。
  } // 結束跳躍位置更新。
  // 選擇角色目前應播放的精靈圖。
  const activeSheet = isJumping ? jumpSheet : (isWalking ? walkSheet : stopSheet); // 空中播放跳躍，否則依移動狀態選動畫。
  // 圖片載入完成後才計算格子並繪製角色。
  if (activeSheet) { // 避免圖片尚未載入時讀取寬高。
    // 選擇目前精靈圖的動畫格數。
    const activeFrameCount = isJumping ? JUMP_FRAME_COUNT : FRAME_COUNT; // 跳躍十四格，其餘動畫八格。
    // 選擇目前動畫每一格的播放時間。
    const activeFrameDelay = isJumping ? JUMP_FRAME_DELAY : FRAME_DELAY; // 跳躍動畫使用較快速度。
    // 計算精靈圖中單一動畫格的寬度。
    const frameWidth = activeSheet.width / activeFrameCount; // 依目前精靈圖格數平均切分。
    // 計算動畫目前播放到的格子編號。
    const frameIndex = Math.floor(frameCount / activeFrameDelay) % activeFrameCount; // 動畫格數到達末尾後循環播放。
    // 限制角色位置，避免角色移出畫布左右邊界。
    characterX = constrain(characterX, frameWidth / 2, width - frameWidth / 2); // 以目前動畫格寬度保留邊界。
    // 儲存目前畫布的轉換狀態。
    push(); // 避免角色的翻轉影響其他畫布繪製。
    // 移動畫布座標原點至角色中心。
    translate(characterX, characterY); // 讓角色以自己的中心點定位。
    // 依面向方向翻轉角色圖片。
    scale(facingDirection, 1); // 左向時水平鏡射，右向時維持原方向。
    // 從精靈圖裁切目前動畫格並繪製角色。
    image(activeSheet, 0, 0, frameWidth, activeSheet.height, frameIndex * frameWidth, 0, frameWidth, activeSheet.height); // 依圖片原始大小顯示單一格。
    // 還原畫布轉換狀態。
    pop(); // 讓下一畫面不受角色翻轉影響。
  } // 結束圖片載入檢查。
} // 結束 draw()。

// 視窗大小改變時同步調整畫布和角色位置。
function windowResized() { // p5.js 在瀏覽器尺寸改變時呼叫此函式。
  // 將畫布調整為新的視窗大小。
  resizeCanvas(windowWidth, windowHeight); // 持續保持全螢幕畫布。
  // 將角色站立高度維持在畫布中央。
  groundY = height / 2; // 視窗高度改變後重新設定站立高度。
  // 角色未跳躍時同步更新垂直位置。
  if (!isJumping) { // 避免調整視窗時中斷空中的跳躍。
    characterY = groundY; // 未跳躍時角色停在新的站立高度。
  } // 結束站立位置更新。
  // 將角色水平位置限制在新畫布範圍內。
  characterX = constrain(characterX, 0, width); // 避免縮小視窗後角色留在畫布外。
} // 結束 windowResized()。

// 阻止方向鍵觸發瀏覽器預設的捲動畫面行為。
function keyPressed() { // p5.js 在按下鍵盤按鍵時呼叫此函式。
  // 按下向上鍵且角色在地面時開始跳躍。
  if (keyCode === UP_ARROW && !isJumping) { // 空中再次按上鍵不會重新起跳。
    isJumping = true; // 切換到跳躍動畫。
    verticalVelocity = -JUMP_SPEED; // 以向上的初速度起跳。
  } // 結束跳躍按鍵判斷。
  // 方向鍵交由遊戲控制，不讓瀏覽器捲動頁面。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) { // 攔截所有方向鍵。
    return false; // 阻止瀏覽器的預設方向鍵操作。
  } // 結束方向鍵判斷。
} // 結束 keyPressed()。
