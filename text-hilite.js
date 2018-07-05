const textHilighter = ( () => {

  const getMostUsed = (sortedEntries, nHilite) => {
    return sortedEntries.slice(0, nHilite).map(word => word[0]).join(' ');
  }

  const wordRegex = (word, ignoreCasing) => {
    return ignoreCasing ? new RegExp(word, 'gi') : new RegExp(word, 'g');
  }

  const hiliteMostUsedWords = (wordsToHilite, parasList, ignoreCasing) => {
    return parasList.map(para => para.match(/('\w+)|(\w+'\w+)|(\w+')|(\w+)/gi).map(word => {
      const wordRe = wordRegex(word, ignoreCasing);
      return wordsToHilite.match(wordRe) 
        ? `<span class="hilite">${word}</span>`
        : word;
    }).join(' ') + '<br><br>').join(' ');
  }

  const hilightedText = (text, sortedEntries, ignoreCasing, nHilite) => {
    const mostUsedWords = getMostUsed(sortedEntries, nHilite);    
    const paras = text.match(/.+/g);
    return hiliteMostUsedWords(mostUsedWords, paras, ignoreCasing);
  }

  return {
    hilightedText,
  }

})()