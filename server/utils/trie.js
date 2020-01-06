const Category = require('../models/category');

class Trie {
  constructor() {
    this.subtrie = {};
    this.words = [];
  }

  insertWord(word, depth = 0) {
    if(word.length === depth) {
      this.words = this.words.concat(word)
      return;
    } 
    const first = word.charAt(depth);
    if(!(first in this.subtrie)) {
      let newtrie = new Trie();
      this.subtrie[first] = newtrie;
    }
    this.subtrie[first].insertWord(word, depth + 1);
  }

  getTrie(prefix) {
    let res = [];
    if(prefix.length === 0) {
      res = this.words.slice();

      for (let key in this.subtrie) {
        res = res.concat(this.subtrie[key].getTrie(''));
      }
      return res;
    }
    if(prefix.charAt(0) in this.subtrie) {
      res = this.subtrie[prefix.charAt(0)].getTrie(prefix.slice(1));
    } 
    return res;
  }
}

buildCategoryTrie = async () => {
  t = new Trie();
  const allCategories = await Category.find();
  allCategories.forEach((category) => {
    t.insertWord(category);
  })
  return t;
}

var categorySingleton = (function() {
  var instance;

  async function createInstance() {
    object = await buildCategoryTrie();
    setTimeout(buildCategoryTrie,
      1000 * 60 * 60 * 24);
    return object;
  }

  return {
    getInstance: async function() {
      if(!instance) {
        instance = await createInstance();
      }
      return instance;
    }
  }
})();

module.exports = categorySingleton;

// t = new Trie()
// t.insertWord('abcd')
// t.insertWord('abc')
// console.log("1")
// console.log(t.getTrie('abc'))

// s = new Trie()
// s.insertWord('abcd')
// s.insertWord('def')
// console.log("2")
// console.log(s.getTrie('d'))