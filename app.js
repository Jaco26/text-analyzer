const ta = (() => {
  // Data
  const data = {
    text: '',
    wordFreq: {},
    sortedWordFreq: [],
  }

  const wordRe = /\b[a-z'-\d]+\b/gi;

  // Private methods
  const setText = (text) => {
    data.text = text;
  }

  const setReducedByWord = () => {
    if (!data.text) {
      return 'There\'s nothing to analyze. Please add some text.';
    }
    data.wordFreq = data.text.match(wordRe)
      .reduce((a, b) => {
        b = b.toLowerCase();
        a[b] ? a[b] += 1 : a[b] = 1;
        return a;
      }, {});
    return data.wordFreq;
  }

  const setSortedWordFreq = () => {
    let entries = Object.entries(data.wordFreq);
    return entries.sort((a, b) => {
      return b[1] - a[1];
    });
  }

  const getText = () => data.text;
  const getWordFreq = () => data.wordFreq;
  const getSortedWordFreq = () => data.sortedWordFreq;

  // Public methods
  const addText = (text) => setText(text);
  const fetchText = () => getText();
  const reduceByWord = () => setReducedByWord();
  const sortWordFreq = () => setSortedWordFreq();
  
  return {
    addText,
    fetchText,
    reduceByWord,
    sortWordFreq
  }
})();

const app = ( (ta) => {
  document.querySelector('#text-in-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let text = document.querySelector('#text-in').value;
    ta.addText(text);
    ta.fetchText();
    ta.reduceByWord();
    let sortedWordFrequencies = ta.sortWordFreq();
    let outputList = document.querySelector('#output');
    outputList.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      let word = sortedWordFrequencies[i];
      let li = document.createElement('li');
      li.textContent = `${word[0]}: ${word[1]}`;
      outputList.appendChild(li)
    }
   
  });

})(ta);

