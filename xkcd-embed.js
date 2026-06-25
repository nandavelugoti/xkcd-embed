/*
 *  ----------------------
 * |   < 123  124  125 >  |
 * |----------------------|
 * |                      |
 * |                      |
 * |                      |
 * |         COMIC        |
 * |                      |
 * |                      |
 * |                      |
 * |----------------------|
 * | github random latest |
 *  ----------------------
*/

const BASE_URL = 'https://xkcd.com'
const LATEST_URL = `${BASE_URL}/info.0.json`
const urlFromID = id => `${BASE_URL}/${id}/info.0.json`

const proxify = url => url
const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function getComic(id) {
  let comic = null
  await fetch(proxify(urlFromID(id)))
    .then(response => response.json())
    .then(data => comic = data)  
    .catch(ex => console.log(`[xkcd-embed] getComic(${id}): ${ex}`))
  return comic
}

async function getComicLatest() {
  let comic = null
  await fetch(proxify(LATEST_URL))
    .then(response => response.json())
    .then(data => comic = data)  
    .catch(ex => console.log(`[xkcd-embed] getComic(${id}): ${ex}`))
  return comic
}

document.addEventListener("DOMContentLoaded", async (event) => {
  const htmlToEmbed = `
    <!-- Embedded HTML below. For more see: -->
    <style>
      .mainContainer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }
      .topNav {
        display:flex;
        justify-content: space-between;
      }
      .comic {
        align-self: center;
        object-fit: scale-down;
      }
      .bottomNav {
        display:flex;
        justify-content: space-between;
      }
      .linkBtn {
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        color: #0066cc;
        font-family: inherit;
        font-size: inherit;
        cursor: pointer;
        display: inline; 
        padding: 10px;
      }
    </style>

    <div class="mainContainer">
      <div class="topNav">
        <input class="linkBtn" type="button" id="prev"        value="<" />
        <input class="linkBtn" type="button" id="predecessor" value=""  />
        <b><p id="current"></p></b>
        <input class="linkBtn" type="button" id="successor"   value=""  />
        <input class="linkBtn" type="button" id="next"        value=">" />
      </div>
      <img class="comic" id="comic" alt="xkcd comic not found!" />
      <div class="bottomNav">
        <input class="linkBtn" type="button" id="github" value="github" />
        <input class="linkBtn" type="button" id="random" value="random" />
        <input class="linkBtn" type="button" id="latest" value="latest" />
      </div>
    </div>
    <!-- Embedded HTML above. For more see: -->
  `

  const embedDiv = document.getElementById("xkcd-embed")
  embedDiv.innerHTML = htmlToEmbed
  embedDiv.style.height = "100%"

  const currText = document.getElementById("current")
  const prevBtn  = document.getElementById("prev")
  const nextBtn  = document.getElementById("next")
  const predBtn  = document.getElementById("predecessor")
  const succBtn  = document.getElementById("successor")
  const gitBtn   = document.getElementById("github")
  const randBtn  = document.getElementById("random")
  const lateBtn  = document.getElementById("latest")
  const comicImg = document.getElementById("comic")

  let latestComic = await getComicLatest()

  function updateUI(currComic) {
    let isLatestComic = (latestComic.num == currComic.num) 
    comicImg.src = currComic.img
    currText.innerHTML = currComic.num
    predBtn.value = `${parseInt(currComic.num)-1}`
    succBtn.value = isLatestComic ? '' : `${parseInt(currComic.num)+1}`
    nextBtn.style.visibility = isLatestComic ? 'hidden' : 'visible'
  }

  prevBtn.onclick = async () => updateUI(await getComic(parseInt(currText.innerHTML)-2))
  nextBtn.onclick = async () => updateUI(await getComic(parseInt(currText.innerHTML)+2))
  predBtn.onclick = async () => updateUI(await getComic(parseInt(predBtn.value)))
  succBtn.onclick = async () => updateUI(await getComic(parseInt(succBtn.value)))
  randBtn.onclick = async () => updateUI(await getComic(randomNum(0, parseInt(latestComic.num))))
  lateBtn.onclick = () => updateUI(latestComic)
  updateUI(latestComic)
});
