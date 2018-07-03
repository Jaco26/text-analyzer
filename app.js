
const textController = ( () => {
  // Define private TextAnalyzer class
  class TextAnalyzer {
    constructor(ignoreCasing, order, wordsToIgnore, text){
      this.text = text;
      this.ignoreCasing = ignoreCasing;
      this.orderDescending = order;
      this.wordsToIgnore = wordsToIgnore;
      this.wordRe = /\b[a-z'-\d]+\b/gi;
      this.sortedEntries = this.countAndSortWords(ignoreCasing, order);
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

  // TODO: fix bug that results in <span> wrappers not being applied
  // in a way consistent with ignoring casing
  const hiliteTop = ({text, sortedEntries, ignoreCasing}, nHilight) => {    
    const top = ignoreCasing 
      ? sortedEntries.slice(0, nHilight).map(word => word[0].toLowerCase())
      : sortedEntries.slice(0, nHilight).map(word => word[0]);      
    const paras = text.match(/.+/g);
    if (ignoreCasing) {
      return paras.map(para => para.split(' ').map(word => {
        return top.indexOf(word.match(/\w/gi).join('')) != -1
          ? `<span class="hilite">${word}</span>`
          : word;
      }).join(' ') + '<br><br>').join(' ');
    } else {
      return paras.map(para => para.split(' ').map(word => {
        return top.indexOf(word.match(/\w/g).join('')) != -1
          ? `<span class="hilite">${word}</span>`
          : word;
      }).join(' ') + '<br><br>').join(' ');
    }
  }
 

  class App {
    constructor({ elems, data, handlers }) {
      this.elems = this.setElements(elems);
      this.data = data;
      this.handlers = this.bindHandlersToElems(handlers);
    }
  
    setElements(elements) {
      let entries = Object.entries(elements);
      return entries.reduce( (a, b) => {
        a[b[0]] = document.querySelector(b[1]);
          return a 
      }, {});
    }

    bindHandlersToElems(handlers) {
      let handlersKeysArr = Object.keys(handlers)
      return handlersKeysArr.reduce((a, b) => {
        let boundFunc = handlers[b].bind(this.elems)
        a[b] = boundFunc;
        return a
      }, {})
    }

  }

  return {
    sortWords,
    hiliteTop,
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
      outputList: '#output',
      outputHiLite: '#highlighted-output' 
    },
    data: {
      wordsToIgnore: ['a', 'is', 'of', 'the', 'make', 'and', 'it', 'that', 'who',
        'in', 'but', 'to', 'for', 'be', 'but', 'are', 'has', 'was', 'will', 'could', 'have',
        'than', 'this', 'they', 'with', 'through', 'by', 'were', 'get'],
      prevResults: [],
    },
    handlers: {
      handleFormSubmit(event){        
        event.preventDefault();
        let text = this.textIn.value;
        let orderBy = this.resultOrder.checked;
        let casing = this.ignoreCasing.checked;
        let wordsToIgnore = app.data.wordsToIgnore;
        let resultObject = tc.sortWords(casing, orderBy, wordsToIgnore, text);        
        app.handlers.displaySortedWords(resultObject);
        app.handlers.highlightTopWords(resultObject, this.resultNum.value);
        app.data.prevResults.push(resultObject);        
      },
      displaySortedWords ({sortedEntries}){
        this.outputList.innerHTML = '';        
        sortedEntries.forEach((word, index) => {
          if (index >= this.resultNum.value) {
            return
          }
          item = document.createElement('li');
          item.textContent = `${word[0]}: ${word[1]}`;
          this.outputList.appendChild(item)
        });
      },
      highlightTopWords (resultObj, nHilight) {
        const hilightedTop = tc.hiliteTop(resultObj, nHilight)
        this.outputHiLite.innerHTML = hilightedTop;
      },
      handleResultNumber(event){
        this.resultNumSpan.textContent = event.target.value;
      }
    }
  });


  // listeners
  app.elems.form.addEventListener('submit', app.handlers.handleFormSubmit);
  app.elems.resultNum.addEventListener('input', app.handlers.handleResultNumber);  



})(textController);

