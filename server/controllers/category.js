const categorySingleton = require('../utils/trie')

module.exports = {
  getCategoryWithPrefix: async (req, res, next) => {
    try {
      const { prefix } = req.params;
      const categoryTrie = await categorySingleton.getInstance();
      categoryTrie.getTrie(prefix);
    } catch(err) {
      next(err);
    }
  }
}