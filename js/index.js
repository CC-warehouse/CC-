// 打字动画配置
const typingTexts = [
  "探索创意的无限可能",
  "每个想法都值得被看见",
  "让灵感在这里自由生长",
  "欢迎来到CC的宝藏仓库!",
];

// 动画参数
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let isWaiting = false;
let typingSpeed = 100;
let deletingSpeed = 50;
let waitTime = 1500;
let animationCompleted = false;
let currentTimeout = null;
let animationSkipped = false;

// DOM元素
const typingTextElement = document.getElementById("typingText");
const loadingScreen = document.getElementById("loading-screen");
const progressBar = document.getElementById("progressBar");
const loadingHint = document.getElementById("loadingHint");
const themeToggle = document.getElementById("theme-toggle");
const replayBtn = document.getElementById("replay-animation");
const skipBtn = document.getElementById("skip-animation");
const video = document.getElementById("bg-video");
const placeholder = document.getElementById("video-placeholder");
const mainContent = document.getElementById("mainContent");

// 打字动画主函数
function typeText() {
  // 如果动画被跳过，则直接返回
  if (animationSkipped) {
    return;
  }

  const currentText = typingTexts[currentTextIndex];
  const isLastText = currentTextIndex === typingTexts.length - 1;

  // 更新进度条
  const totalChars = typingTexts.reduce((sum, text) => sum + text.length, 0);
  const completedChars =
    typingTexts
      .slice(0, currentTextIndex)
      .reduce((sum, text) => sum + text.length, 0) + currentCharIndex;
  const progress = (completedChars / totalChars) * 100;
  progressBar.style.width = `${progress}%`;

  if (!isDeleting && !isWaiting) {
    // 打字模式
    typingTextElement.innerHTML = currentText.substring(
      0,
      currentCharIndex + 1,
    );
    currentCharIndex++;
    // 如果打完当前文本
    if (currentCharIndex === currentText.length) {
      if (isLastText) {
        // 最后一句：等待然后开始向上消失动画
        isWaiting = true;
        progressBar.style.width = "100%"; // 提前设置为100%

        setTimeout(() => {
          isWaiting = false;
          // 开始向上消失动画
          typingTextElement.classList.add("fade-out-up");

          // 等待向上消失动画完成，然后显示主内容
          setTimeout(() => {
            completeAnimation();
          }, 1000);
        }, waitTime);
      } else {
        // 非最后一句：等待然后开始删除
        isWaiting = true;
        setTimeout(() => {
          isWaiting = false;
          isDeleting = true;
          typeText();
        }, waitTime);
      }
      return;
    }
  } else if (isDeleting && !isLastText) {
    // 删除模式（仅非最后一句）
    typingTextElement.innerHTML = currentText.substring(
      0,
      currentCharIndex - 1,
    );
    currentCharIndex--;
    // 如果删除完成，移动到下一个文本
    if (currentCharIndex === 0) {
      isDeleting = false;
      currentTextIndex++;
    }
  }
  // 设置下一次调用的延迟
  const speed = isDeleting ? deletingSpeed : typingSpeed;
  currentTimeout = setTimeout(typeText, speed);
}

// 动画完成时的处理
function completeAnimation() {
  // 清除当前定时器
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  loadingHint.textContent = "加载完成！即将进入...";
  // 检查视频是否已加载
  if (video.readyState >= 3) {
    // 视频已加载，立即隐藏加载屏幕
    hideLoadingScreen();
  } else {
    // 视频未加载完成，等待
    const checkVideoLoad = setInterval(() => {
      if (video.readyState >= 3) {
        clearInterval(checkVideoLoad);
        hideLoadingScreen();
      }
    }, 100);
    // 设置最大等待时间
    setTimeout(() => {
      clearInterval(checkVideoLoad);
      hideLoadingScreen();
    }, 2000);
  }
}

// 隐藏加载屏幕
function hideLoadingScreen() {
  loadingScreen.classList.add("hidden");
  if (placeholder) {
    placeholder.style.display = "none";
  }
  // 添加向上浮现效果
  setTimeout(() => {
    if (mainContent) {
      mainContent.classList.add("fade-up");
    }
  }, 300);
}

// 跳过动画
function skipAnimation() {
  // 设置跳过标志
  animationSkipped = true;
  // 清除当前定时器
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  // 立即完成动画
  completeAnimation();
}

// 重新开始动画
function restartAnimation() {
  // 重置所有变量
  currentTextIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;
  isWaiting = false;
  animationCompleted = false;
  animationSkipped = false;
  // 移除主内容的淡入效果
  if (mainContent) {
    mainContent.classList.remove("fade-up");
  }
  // 重置进度条
  progressBar.style.width = "0%";
  loadingHint.textContent = "请稍候，正在为您准备最佳体验...";
  // 移除向上消失效果
  typingTextElement.classList.remove("fade-out-up");
  // 显示加载屏幕
  loadingScreen.classList.remove("hidden");
  // 重置打字文本
  typingTextElement.innerHTML = "";
  // 重新开始动画
  currentTimeout = setTimeout(() => {
    typeText();
  }, 300);
}

// 主题切换
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  themeToggle.innerHTML = isDark
    ? `<svg viewBox="0 0 24 24">
              <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0-0.39-0.15-0.75-0.44-1.01c-0.29-0.26-0.67-0.4-1.05-0.4c-0.39,0-0.75,0.15-1.01,0.44l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41c0.39,0.39,1.03,0.39,1.41,0l1.06-1.06C19.26,6.75,19.42,6.38,19.42,5.99z M7.05,18.36 c0-0.39-0.15-0.75-0.44-1.01c-0.29-0.26-0.67-0.4-1.05-0.4c-0.39,0-0.75,0.15-1.01,0.44L3.48,18.36c-0.39,0.39-0.39,1.03,0,1.41 c0.39,0.39,1.03,0.39,1.41,0l1.06-1.06C6.89,19.39,7.05,19.02,7.05,18.36z"></path>
            </svg><span>浅色</span>`
    : `<svg viewBox="0 0 24 24">
              <path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>
            </svg><span>深色</span>`;
}

// 初始化
document.addEventListener("DOMContentLoaded", function () {
  // 开始打字动画
  currentTimeout = setTimeout(() => {
    typeText();
  }, 500);
  // 视频加载成功
  video.addEventListener("loadeddata", function () {
    if (placeholder) {
      placeholder.style.opacity = "0";
      setTimeout(() => {
        placeholder.style.display = "none";
      }, 500);
    }
  });
  // 视频加载失败
  video.addEventListener("error", function () {
    if (placeholder) {
      placeholder.innerHTML = "视频加载失败，已显示备用背景";
      placeholder.style.backgroundColor = "#1a1a2e";
    }
  });
  // 绑定按钮事件
  themeToggle.addEventListener("click", toggleTheme);
  replayBtn.addEventListener("click", restartAnimation);
  skipBtn.addEventListener("click", skipAnimation);
  // 平滑滚动
  // document.querySelector(".btn").addEventListener("click", function (e) {
  //   e.preventDefault();
  //   const targetId = this.getAttribute("href");
  //   if (targetId === "#about") {
  //     alert('"关于"部分尚未创建');
  //   }
  // });

  // 响应式视频调整
  function adjustVideoSize() {
    if (video.videoWidth && video.videoHeight) {
      const container = document.querySelector(".video-container");
      const containerRatio = container.clientWidth / container.clientHeight;
      const videoRatio = video.videoWidth / video.videoHeight;

      if (containerRatio > videoRatio) {
        video.style.width = "100%";
        video.style.height = "auto";
      } else {
        video.style.width = "auto";
        video.style.height = "100%";
      }
    }
  }

  // 初始化视频调整
  window.addEventListener("load", adjustVideoSize);
  window.addEventListener("resize", adjustVideoSize);
  video.addEventListener("loadedmetadata", adjustVideoSize);
  setTimeout(adjustVideoSize, 100);
  // 移动端控制按钮调整
  function adjustControls() {
    if (window.innerWidth <= 480) {
      skipBtn.innerHTML = `<svg viewBox="0 0 24 24">
              <path d="M6.5 5.5L12 11l5.5-5.5L19 7l-7 7-7-7 1.5-1.5z"/>
            </svg>`;

      replayBtn.innerHTML = `<svg viewBox="0 0 24 24">
              <path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z"></path>
            </svg>`;
      themeToggle.innerHTML = document.body.classList.contains("dark-theme")
        ? `<svg viewBox="0 0 24 24">
                  <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0-0.39-0.15-0.75-0.44-1.01c-0.29-0.26-0.67-0.4-1.05-0.4c-0.39,0-0.75,0.15-1.01,0.44l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41c0.39,0.39,1.03,0.39,1.41,0l1.06-1.06C19.26,6.75,19.42,6.38,19.42,5.99z M7.05,18.36 c0-0.39-0.15-0.75-0.44-1.01c-0.29-0.26-0.67-0.4-1.05-0.4c-0.39,0-0.75,0.15-1.01,0.44L3.48,18.36c-0.39,0.39-0.39,1.03,0,1.41 c0.39,0.39,1.03,0.39,1.41,0l1.06-1.06C6.89,19.39,7.05,19.02,7.05,18.36z"></path>
                </svg>`
        : `<svg viewBox="0 0 24 24">
                  <path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>
                </svg>`;
    } else {
      skipBtn.innerHTML = `<svg viewBox="0 0 24 24">
              <path d="M6.5 5.5L12 11l5.5-5.5L19 7l-7 7-7-7 1.5-1.5z"/>
            </svg><span>跳过动画</span>`;

      replayBtn.innerHTML = `<svg viewBox="0 0 24 24">
              <path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z"></path>
            </svg><span>重播</span>`;
      themeToggle.innerHTML = document.body.classList.contains("dark-theme")
        ? `<svg viewBox="0 0 24 24">
                  <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0-0.39-0.15-0.75-0.44-1.01c-0.29-0.26-0.67-0.4-1.05-0.4c-0.39,0-0.75,0.15-1.01,0.44l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41c0.39,0.39,1.03,0.39,1.41,0l1.06-1.06C19.26,6.75,19.42,6.38,19.42,5.99z M7.05,18.36 c0-0.39-0.15-0.75-0.44-1.01c-0.29-0.26-0.67-0.4-1.05-0.4c-0.39,0-0.75,0.15-1.01,0.44L3.48,18.36c-0.39,0.39-0.39,1.03,0,1.41 c0.39,0.39,1.03,0.39,1.41,0l1.06-1.06C6.89,19.39,7.05,19.02,7.05,18.36z"></path>
                </svg><span>浅色</span>`
        : `<svg viewBox="0 0 24 24">
                  <path d="M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36c-0.98,1.37-2.58,2.26-4.4,2.26 c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>
                </svg><span>深色</span>`;
    }
  }

  window.addEventListener("resize", adjustControls);
  adjustControls(); // 初始调整
});
