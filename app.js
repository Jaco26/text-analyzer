
const textController = ( () => {
  // Define private TextAnalyzer class
  class TextAnalyzer {
    constructor(){
      this._text = '';
      this._wordsToIgnore = [];
      this.wordReI = /\b[a-z'-\d]+\b/gi;
      this.wordReC = /\b[a-z'-\d]+\b/g;
    }

    set text(text) {
      this._text = text;
    }

    set wordsToIgnore(words){
      this._wordsToIgnore = words;
    }

    get text () {
      return this._text;
    }

    get wordsToIgnore () {
      return this._wordsToIgnore;
    }
    
    filterWordsToIgnore(ignoreCasing) {
      return ignoreCasing 
        ? this.text.split(' ').filter(word => !this.wordsToIgnore.includes(word.toLowerCase())) 
        : this.text.split(' ').filter(word => !this.wordsToIgnore.includes(word));
    }

    countWordFrequency(ignoreCasing) {
      const words = this.filterWordsToIgnore(ignoreCasing);
      return words.reduce( (a, b) => {
        ignoreCasing ? b = b.toLowerCase() : b;
        a[b] ? a[b] += 1 : a[b] = 1;
        return a;
      }, {});
    }

    sortWordsByUsage (desc, ignoreCasing) {
      const entries = Object.entries(this.countWordFrequency(ignoreCasing));
      return entries.sort( (a, b) => {
        return desc ? b[1] - a[1] : a[1] - b[1];
      });
    }
  }

  // Private class instance
  const ta = new TextAnalyzer();

  // Public methods
  const setText = (text) => ta.text = text;
  const getText = () => ta.text;
  const setWordsToIgnore = (words) => ta.wordsToIgnore = words;
  const getWordsToIgnore = () => ta.wordsToIgnore;
  const sortWords = (desc, ignoreCasing) => ta.sortWordsByUsage(desc, ignoreCasing)

  class App {
    constructor({ elems, data, handlers }) {
      this.elems = this.setElements(elems);
      this.data = data;
      this.handlers = handlers;
    }

    setElements(elements) {
      let entries = Object.entries(elements);
      return entries.reduce( (a, b) => {
        a[b[0]] = document.querySelector(b[1]);
          return a 
      }, {});
    }
  }

  return {
    setText,
    getText,
    setWordsToIgnore,
    getWordsToIgnore,
    sortWords,
    App
  };

})();



const appController = ( (tc) => { 

  const app = new tc.App({
    elems: {
      form: '#text-in-form',
      resultOrder: '#result-order',
      textIn: '#text-in',
      outputList: '#output'
    },
    data: {
      wordsToIgnore: ['a', 'is', 'of', 'the', 'make', 'and', 'it', 'that', 'who',
        'in', 'but', 'to', 'for', 'be', 'but', 'are', 'has', 'was', 'will', 'could', 'have',
        'than', 'this', 'they', 'with', 'through', 'by', 'were', 'get'],
    },
    handlers: {
      handleFormSubmit(event){
        event.preventDefault();
        let text = app.elems.textIn.value;
        tc.setText(text);
        tc.setWordsToIgnore(app.data.wordsToIgnore);
        let desc = app.elems.resultOrder.checked;
        let sortedWords = tc.sortWords(desc, false);
        app.handlers.displaySortedWords(sortedWords);
      },
      displaySortedWords(sortedWords){
        app.elems.outputList.innerHTML = '';
        sortedWords.forEach(word => {
          item = document.createElement('li');
          item.textContent = `${word[0]}: ${word[1]}`;
          app.elems.outputList.appendChild(item)
        });
      }
    }
  });

  console.log(app);

  // listeners
  app.elems.form.addEventListener('submit', app.handlers.handleFormSubmit);







})(textController);

