
const textController = ( () => {
  // Define private TextAnalyzer class
  class TextAnalyzer {
    constructor(casing, order, wordsToIgnore, text){
      this.text = text;
      this.casing = casing;
      this.orderDescending = order;
      this.wordsToIgnore = wordsToIgnore;
      this.wordRe = /\b[a-z'-\d]+\b/gi;
      this.sortedEntries = this.countAndSortWords(casing, order);
    }

    filterWordsToIgnore(ignoreCasing) {
      return ignoreCasing 
        ? this.text.match(this.wordRe).filter(word => !this.wordsToIgnore.includes(word.toLowerCase())) 
        : this.text.match(this.wordRe).filter(word => !this.wordsToIgnore.includes(word));
    }

    countWordFrequency(ignoreCasing, words) {
      return words.reduce( (a, b) => {
        ignoreCasing ? b = b.toLowerCase() : b;
        a[b] ? a[b] += 1 : a[b] = 1;
        return a;
      }, {});
    }

    sortWordsByUsage(orderDescending, countedWordObj) {
      const entries = Object.entries(countedWordObj);
      return entries.sort( (a, b) => {
        return orderDescending ? b[1] - a[1] : a[1] - b[1];
      });
    }

    countAndSortWords (casing, order) {
      const filteredText = this.filterWordsToIgnore(casing);
      const countedWordObj = this.countWordFrequency(casing, filteredText); 
      const sortedWordEntries = this.sortWordsByUsage(order, countedWordObj);      
      return sortedWordEntries;
    }
  }


  // Public methods
  const sortWords = (text, wordsToIgnore, casing, order) => {
    return new TextAnalyzer(text, wordsToIgnore, casing, order);
  }

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
    sortWords,
    App
  };

})();



const appController = ( (tc) => { 

  const app = new tc.App({
    elems: {
      form: '#text-in-form',
      resultOrder: '#result-order',
      resultNum: '#number-of-results',
      resultNumSpan: '#result-num-span',
      ignoreCasing: '#ignore-casing',
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
        let orderBy = app.elems.resultOrder.checked;
        let casing = app.elems.ignoreCasing.checked;
        let wordsToIgnore = app.data.wordsToIgnore;
        let resultObject = tc.sortWords(casing, orderBy, wordsToIgnore, text);        
        app.handlers.displaySortedWords(resultObject.sortedEntries);
      },
      displaySortedWords(sortedWords){
        app.elems.outputList.innerHTML = '';        
        sortedWords.forEach((word, index) => {
          if (index >= app.elems.resultNum.value) {
            return
          }
          item = document.createElement('li');
          item.textContent = `${word[0]}: ${word[1]}`;
          app.elems.outputList.appendChild(item)
        });
      },
      handleResultNumber(event){
        app.elems.resultNumSpan.textContent = event.target.value;
      }
    }
  });


  // listeners
  app.elems.form.addEventListener('submit', app.handlers.handleFormSubmit);
  app.elems.resultNum.addEventListener('input', app.handlers.handleResultNumber);






})(textController);

