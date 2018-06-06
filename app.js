const tac = (() => {

  class WordCounter {
    constructor () {
      this._text = '';
      this._wordsToIgnore = [];
      this._wordRe = /\b[a-z'-\d]+\b/gi;
    }

    set text (val) {
      this._text = val;
    }

    set wordsToIgnore (val) {
      this._wordsToIgnore = val;      
    }

    get text () {
      return this._text;
    }

    get wordsToIgnore () {
      return this._wordsToIgnore;
    }

    get wordRe () {
      return this._wordRe
    };

    filterWordsToIgnore (ignoreCasing) {
      let words = this.text.match(this.wordRe);
      return words.filter(word =>  this.wordsToIgnore.indexOf(word.toLowerCase()) == -1);
    }

    countWordFrequency (ignoreCasing) {      
      let words = this.filterWordsToIgnore(ignoreCasing);
      // return this.text.match(this.wordRe)
      return words .reduce( (a, b) => {
        ignoreCasing ? b = b.toLowerCase() : b;
        a[b] ? a[b] += 1 : a[b] = 1;
        return a;
      }, {}); 
    }
    sortWordsByUsage (ignoreCasing) {
      const entries = Object.entries(this.countWordFrequency(ignoreCasing));      
      return entries.sort( (a, b) => {
        return b[1] - a[1];
      });
    }
  }

  // Private class instance
  const wordCounterInstance = new WordCounter();

  // Public methods
  const addText = (text, wordsToIgnore) => {
    wordCounterInstance.text = text;
    wordCounterInstance.wordsToIgnore = wordsToIgnore.map(word => word.toLowerCase());
  }
  const getText = () => wordCounterInstance.text;
  const getWordFreqWithCasing = (ignoreCasing) => wordCounterInstance.sortWordsByUsage(ignoreCasing);

  return {
    addText,
    getText,
    getWordFreqWithCasing,
  }
})();



const app = ( (ta) => {

  const ignoreTheseWords = ['a', 'is', 'of', 'the', 'make', 'and', 'it', 'that', 'who',
    'in', 'but', 'to', 'for', 'be', 'but', 'are', 'has', 'was', 'will', 'could', 'have',
    'than', 'this', 'they', 'with', 'through', 'by', 'were', 'get'];

  // Event listeners
  document.querySelector('#text-in-form').addEventListener('submit', handleSubmitForm); 
    
  // Event handlers
  function handleSubmitForm (event) {
    event.preventDefault();    
    let text = document.querySelector('#text-in').value;
    ta.addText(text, ignoreTheseWords);
    const sortedWords = ta.getWordFreqWithCasing(true);    
    displaySortedWords(sortedWords);
  }

  function displaySortedWords (sortedWords) {
    let outputList = document.querySelector('#output');
    outputList.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      let word = sortedWords[i];
      let li = document.createElement('li');
      li.textContent = `${word[0]}: ${word[1]}`;
      outputList.appendChild(li)
    }
  }


})(tac);

