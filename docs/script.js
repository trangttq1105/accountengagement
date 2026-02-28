const SHEET_ID = "13vSv0Mz4EUU10GxLjGkAWF_QW2soVzrW8I8v424qgCo";
const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let sheetData = [];
let dataLoaded = false;


// ===== Load Sheet =====
fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    sheetData = json.table.rows;
    dataLoaded = true;

    console.log("Sheet loaded:", sheetData.length);
  })
  .catch(err => console.error(err));


// ===== Random helper =====
function getRandomItems(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}


// ===== Generate =====
document.getElementById("generateBtn").onclick = () => {

  if (!dataLoaded) {
    alert("Data still loading, wait a moment!");
    return;
  }

  // ✅ FIXED ID HERE
  const postLink = document.getElementById("tweetLink").value.trim();
  const customText = document.getElementById("customText").value.trim();

  if (!postLink) {
    alert("Please paste X post link");
    return;
  }

  if (!customText) {
    alert("Custom text is required");
    return;
  }

  const sentences = sheetData
    .map(row => row.c[0]?.v)
    .filter(Boolean);

  const selected = getRandomItems(sentences, 5);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  selected.forEach(sentence => {

    let fullText =
`${sentence} ${customText}

#CatForCashEP7`;

    const tweetId = extractTweetId(postLink);

    const replyUrl =
      "https://twitter.com/intent/tweet?in_reply_to=" +
      tweetId +
      "&text=" +
      encodeURIComponent(fullText);

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p>${fullText.replace(/\n/g,"<br>")}</p>
      <a href="${replyUrl}" target="_blank">
        <button>Reply on X</button>
      </a>
    `;

    resultDiv.appendChild(div);
  });
};


// ===== Extract Tweet ID =====
function extractTweetId(url) {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : "";
}
