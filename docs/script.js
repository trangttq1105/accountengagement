const SHEET_ID = "13vSv0Mz4EUU10GxLjGkAWF_QW2soVzrW8I8v424qgCo";

const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let sentences = [];

/* =====================
   LOAD GOOGLE SHEET
===================== */

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));

    sentences = json.table.rows
      .map(r => r.c[0]?.v)
      .filter(Boolean);

    console.log("Loaded sentences:", sentences.length);
  });


/* =====================
   RANDOM PICK
===================== */

function getRandomItems(arr, n) {
  return [...arr]
    .sort(() => 0.5 - Math.random())
    .slice(0, n);
}


/* =====================
   GENERATE REPLIES
===================== */

document.getElementById("generateBtn").onclick = () => {

  const tweetLink =
    document.getElementById("tweetLink").value.trim();

  const customText =
    document.getElementById("customText").value.trim();

  if (!tweetLink) {
    alert("Please paste X post link");
    return;
  }

  if (!customText) {
    alert("Custom text is required");
    return;
  }

  const selected = getRandomItems(sentences, 5);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  selected.forEach(sentence => {

    const replyText =
`${sentence} ${customText}

#CatForCashEP7`;

    const replyURL =
      "https://twitter.com/intent/tweet?in_reply_to=" +
      extractTweetId(tweetLink) +
      "&text=" +
      encodeURIComponent(replyText);

    const div = document.createElement("div");
    div.className = "post";

    const preview = replyText.replace(/\n/g, "<br>");

    div.innerHTML = `
      <p>${preview}</p>
      <a href="${replyURL}" target="_blank">
        <button>Reply on X</button>
      </a>
    `;

    resultDiv.appendChild(div);
  });
};


/* =====================
   EXTRACT TWEET ID
===================== */

function extractTweetId(url) {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : "";
}
