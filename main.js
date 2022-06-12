const form = document.getElementById("dictionary-form");
const API = "YbKEnqFNfazW5T2dJyuWVLDfKFp4rh2F";
const resultContainer = document.getElementById("resultContainer");
const resultWord = document.getElementById("result-word");
const resultPhonetic = document.getElementById("result-phonetics");
const resultMeaning = document.getElementById("result-meanings");
const gifsContainer = document.getElementById("gifs-container");

const getGifs = async (queryWord = "Words") => {
  const URL = `https://api.giphy.com/v1/gifs/search?q=${queryWord}&api_key=YbKEnqFNfazW5T2dJyuWVLDfKFp4rh2F&limit=6&rating=g`;
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
    imageTag.setAttribute("width", 200);
    imageTag.setAttribute("height", 200);
    liTag.setAttribute("class", "px-4");
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
  const data = await getMeaning(keyword);
  getGifs(keyword);
  renderResult(data[0]);
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
  wordHeadingEle.setAttribute("class", "text-6xl");
  resultWord.appendChild(wordHeadingEle);

  let phoneticEle = document.createElement("div");
  let phoneticHeadingEle = document.createElement("h1");
  phoneticHeadingEle.innerText = "Phonetics : ";
  phoneticHeadingEle.setAttribute("class", "text-2xl");

  phoneticEle.appendChild(phoneticHeadingEle);
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

  let meaningTextTag = document.createElement("h2");
  meaningTextTag.innerHTML = "Meanings: ";
  meaningTextTag.setAttribute("class", "text-2xl my-2");
  resultMeaning.appendChild(meaningTextTag);

  let partOfSpeechTag = document.createElement("div");
  let partOfSpeechTextTag = document.createElement("h2");
  partOfSpeechTextTag.innerHTML = "Part of Speech : ";
  partOfSpeechTextTag.setAttribute("class", "text-2xl");
  partOfSpeechTag.setAttribute("class", "my-4");
  partOfSpeechTag.appendChild(partOfSpeechTextTag);

  meanings.forEach((item, count) => {
    //For Each Meaning render Results
    // Render PartOfSpeech First

    const partOfSpeech = item.partOfSpeech;
    const definitions = item.definitions;
    const synonyms = item.synonyms;

    let definitionTextTag = document.createElement("h2");
    definitionTextTag.innerHTML = "Definitions: ";
    definitionTextTag.setAttribute("class", "my-4 text-2xl");

    let partOfSpeechResutTag = document.createElement("h2");
    partOfSpeechResutTag.innerHTML = `${count + 1}. ${partOfSpeech}`;
    partOfSpeechResutTag.setAttribute("class", "text-2xl color-red");
    partOfSpeechTag.appendChild(partOfSpeechResutTag);

    definitions.forEach((item) => {
      let defintionTag = document.createElement("h3");
      defintionTag.setAttribute("class", "text-xl");
      defintionTag.innerHTML = `👉🏻 ${item.definition}`;

      partOfSpeechTag.appendChild(definitionTextTag);
      partOfSpeechTag.appendChild(defintionTag);
    });

    if (synonyms.length > 1) {
      let synoEle = document.createElement("div");
      let SysTextTag = document.createElement("h2");
      SysTextTag.innerHTML = "Synonyms: ";
      SysTextTag.setAttribute("class", "text-2xl");

      synonyms.forEach((word) => {
        let sysWord = document.createElement("span");
        sysWord.innerHTML = word + ", ";
        sysWord.setAttribute("class", "text-xl");
        synoEle.appendChild(sysWord);
      });
    }
  });
  resultMeaning.appendChild(partOfSpeechTag);
};
