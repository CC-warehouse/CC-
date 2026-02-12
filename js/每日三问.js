// 控制文字显示的逻辑
let currentQuote = 1;
const quotes = ["quote1", "quote2", "quote3", "quote4"];
let animationTimeout; // 用于存储动画的timeout，便于清除

// 开始动画的函数
function startAnimation() {
  // 重置状态
  currentQuote = 1;

  // 隐藏所有文字
  quotes.forEach((quoteId) => {
    document.getElementById(quoteId).classList.remove("show");
  });

  // 隐藏输入框
  document.getElementById("inputArea").classList.remove("show");

  // 显示第一段文字
  document.getElementById(quotes[0]).classList.add("show");

  // 开始动画序列
  setTimeout(showNextQuote, 2000);
}

// 显示下一段文字的函数
function showNextQuote() {
  // 清除之前的timeout
  if (animationTimeout) {
    clearTimeout(animationTimeout);
  }

  // 隐藏当前文字
  document.getElementById(quotes[currentQuote - 1]).classList.remove("show");

  if (currentQuote < quotes.length) {
    // 显示下一段文字
    setTimeout(function () {
      document.getElementById(quotes[currentQuote]).classList.add("show");
      currentQuote++;

      if (currentQuote < quotes.length) {
        // 继续显示下一段
        animationTimeout = setTimeout(showNextQuote, 2000);
      } else {
        // 最后一段显示后，显示输入框
        setTimeout(function () {
          document.getElementById("inputArea").classList.add("show");
        }, 2000);
      }
    }, 1000);
  }
}

// 开始显示文字序列
setTimeout(startAnimation, 0);

// 保存功能的逻辑
document.getElementById("saveBtn").addEventListener("click", function () {
  const text = document.getElementById("userThoughts").value;

  if (text.trim() !== "") {
    // 保存到浏览器本地存储
    localStorage.setItem("myThoughts", text);

    // 显示保存成功消息
    const message = document.getElementById("saveMessage");
    message.textContent = "✓ 已保存！刷新页面试试，回答不会丢失！";
    message.classList.add("show");

    // 3秒后隐藏消息
    setTimeout(function () {
      message.classList.remove("show");
    }, 3000);
  } else {
    alert("请输入一些内容再保存哦！");
  }
});

// 重播按钮的逻辑
document.getElementById("replayBtn").addEventListener("click", function () {
  // 清除本地存储
  localStorage.removeItem("myThoughts");

  // 清空输入框
  document.getElementById("userThoughts").value = "";

  // 显示重播消息
  const message = document.getElementById("saveMessage");
  message.textContent = "重新开始回答，已清除保存的回答！";
  message.className = "message replay-message show";

  // 3秒后隐藏消息
  setTimeout(function () {
    message.classList.remove("show");
    message.className = "message";
  }, 3000);

  // 重新开始动画
  startAnimation();
});

// 页面加载时检查是否有保存过的内容
window.onload = function () {
  const savedText = localStorage.getItem("myThoughts");
  if (savedText) {
    document.getElementById("userThoughts").value = savedText;
  }
};
