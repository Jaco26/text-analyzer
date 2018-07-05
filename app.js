const appController = ((wordCounterMod, textHilighterMod) => { 
  const wc = wordCounterMod;
  const ht = textHilighterMod;

  const app = new wc.App({
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
        let resultObject = wc.sortWords(casing, orderBy, wordsToIgnore, text);        
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
      highlightTopWords({ text, sortedEntries, ignoreCasing }, nHilight) {
        const hilightedTop = ht.hilightedText(text, sortedEntries, ignoreCasing, nHilight)
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



})(wordCounter, textHilighter);

