const wordCounter = (() => {
  // Define private TextAnalyzer class
  class WordCounter {
    constructor(ignoreCasing, order, wordsToIgnore, text) {
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
      return words.reduce((a, b) => {
        ignoreCasing ? b = b.toLowerCase() : b;
        a[b] ? a[b] += 1 : a[b] = 1;
        return a;
      }, {});
    }

    sortWordsByUsage(orderDescending, countedWordObj) {
      const entries = Object.entries(countedWordObj);
      return entries.sort((a, b) => {
        return orderDescending ? b[1] - a[1] : a[1] - b[1];
      });
    }

    countAndSortWords(casing, order) {
      const filteredText = this.filterWordsToIgnore(casing);
      const countedWordObj = this.countWordFrequency(casing, filteredText);
      const sortedWordEntries = this.sortWordsByUsage(order, countedWordObj);
      return sortedWordEntries;
    }
  }

  // Public methods
  const sortWords = (text, wordsToIgnore, casing, order) => {
    return new WordCounter(text, wordsToIgnore, casing, order);
  }

  class App {
    constructor({ elems, data, handlers }) {
      this.elems = this.setElements(elems);
      this.data = data;
      this.handlers = this.bindHandlersToElems(handlers);
    }

    setElements(elements) {
      let entries = Object.entries(elements);
      return entries.reduce((a, b) => {
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
    App
  };

})();

