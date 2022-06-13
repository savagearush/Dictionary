const form = document.getElementById("dictionary-form");
const API = "YbKEnqFNfazW5T2dJyuWVLDfKFp4rh2F";
const resultContainer = document.getElementById("resultContainer");
const resultWord = document.getElementById("result-word");
const resultPhonetic = document.getElementById("result-phonetics");
const resultMeaning = document.getElementById("result-meanings");
const gifsContainer = document.getElementById("gifs-container");

const getGifs = async (queryWord = "Words") => {
  const URL = `https://api.giphy.com/v1/gifs/search?q=${queryWord}&api_key=${API}&limit=6&rating=g`;
  const response = await fetch(URL);
  const { data } = await response.json();
  renderGifs(data);
};

const renderGifs = async (data) => {
  const container = document.getElementById("gifs-container");
  data.forEach(({ images: item }) => {
    const image = item["downsized"];
    let liTag = document.createElement("li");
    let imageTag = document.createElement("img");
    imageTag.setAttribute("src", image["url"]);
    imageTag.setAttribute("class", "rounded-lg");
    liTag.setAttribute("class", "px-3");
    liTag.appendChild(imageTag);
    container.append(liTag);
  });
};

getGifs();

form.onsubmit = async (e) => {
  e.preventDefault();
  resultMeaning.innerHTML = "";
  resultPhonetic.innerHTML = "";
  resultWord.innerHTML = "";
  gifsContainer.innerHTML = "";

  const formData = new FormData(e.target);
  const keyword = formData.get("search");
  try {
    const data = await getMeaning(keyword);
    getGifs(keyword);
    renderResult(data[0]);
  } catch (err) {
    alert("Word not Found !! 😔");
  }
};

const getMeaning = async (query) => {
  const DIC_API = `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`;
  const response = await fetch(DIC_API);
  return response.json();
};

const renderResult = (data) => {
  let { word, meanings, phonetics } = data;
  const { text, audio } = phonetics[phonetics.length - 1];

  // Searched Word Rendering
  let wordHeadingEle = document.createElement("h1");
  word[0] = word[0].toUpperCase();
  wordHeadingEle.innerText = word;
  wordHeadingEle.setAttribute("class", "text-6xl text-cyan-300");
  resultWord.appendChild(wordHeadingEle);

  let phoneticEle = document.createElement("div");
  // let phoneticHeadingEle = document.createElement("h1");
  // phoneticHeadingEle.innerText = "Phonetics : ";
  // phoneticHeadingEle.setAttribute("class", "text-2xl");
  // phoneticEle.appendChild(phoneticHeadingEle);

  let phoneticTextEle = document.createElement("h2");
  phoneticTextEle.innerHTML = text;
  phoneticTextEle.setAttribute("class", "text-4xl");

  phoneticEle.appendChild(phoneticTextEle);

  let phoneticAudioEle = document.createElement("audio");
  let sourceEle = document.createElement("source");
  sourceEle.setAttribute("src", audio);
  phoneticAudioEle.controls = true;
  phoneticAudioEle.setAttribute("class", "my-4");
  phoneticAudioEle.appendChild(sourceEle);
  phoneticEle.appendChild(phoneticAudioEle);

  resultPhonetic.appendChild(phoneticEle);

  // Render Meaning

  let partOfSpeechTag = document.createElement("div");
  partOfSpeechTag.setAttribute("class", "my-4");

  meanings.forEach((item, count) => {
    //For Each Meaning render Results

    const partOfSpeech = item.partOfSpeech;
    const definitions = item.definitions;
    const synonyms = item.synonyms;

    let partOfSpeechResultTag = document.createElement("h2");
    partOfSpeechResultTag.innerHTML = `${count + 1}. ${partOfSpeech}`;
    partOfSpeechResultTag.setAttribute("class", "ml-4 text-2xl color-red");
    partOfSpeechTag.appendChild(partOfSpeechResultTag);

    definitions.forEach((item) => {
      let defintionTag = document.createElement("h3");
      defintionTag.setAttribute("class", "text-xl ml-4 mt-3");
      defintionTag.innerHTML = `👉🏻 ${item.definition}`;
      partOfSpeechTag.appendChild(defintionTag);
    });

    resultMeaning.appendChild(partOfSpeechTag);

    let synoEle = document.createElement("div");
    let synTextTag = document.createElement("h2");
    synTextTag.innerHTML = "Synonyms: ";
    synTextTag.setAttribute("class", "text-2xl text-green-200");
    synoEle.appendChild(synTextTag);

    if (synonyms.length > 0) {
      synonyms.forEach((word) => {
        let sysWord = document.createElement("span");
        sysWord.innerHTML = word + ", ";
        sysWord.setAttribute("class", "text-xl ml-4");
        synoEle.appendChild(sysWord);
      });
      resultMeaning.appendChild(synoEle);
    }
  });
};
