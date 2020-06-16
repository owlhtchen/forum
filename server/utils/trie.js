const User = require('../models/user');
const Tag = require('../models/tag');

class Trie {
    constructor() {
        this.subtrie = {};
        this.objects = [];
    }

    insertWord(key, object) {
        if (key.length === 0) {
            this.objects = this.objects.concat(object);
            return;
        }
        const first = key.charAt(0);
        if (!(first in this.subtrie)) {
            let newtrie = new Trie();
            this.subtrie[first] = newtrie;
        }
        this.subtrie[first].insertWord(key.slice(1), object);
    }

    getTrie(prefix) {
        let res = [];
        if (prefix.length === 0) {
            res = this.objects.slice();

            for (let key in this.subtrie) {
                res = res.concat(this.subtrie[key].getTrie(''));
            }
            return res;
        }
        if (prefix.charAt(0) in this.subtrie) {
            res = this.subtrie[prefix.charAt(0)].getTrie(prefix.slice(1));
        }
        return res;
    }
}

buildUsernameTrie = async () => {
    let t = new Trie();
    const allUsers = await User.find();
    allUsers.forEach((user) => {
        t.insertWord(user.username, user);
    });
    return t;
};

buildTagTrie = async () => {
    let t = new Trie();
    const allTags = await Tag.find();
    allTags.forEach((tag) => {
        t.insertWord(tag.name, tag);
    });
    return t;
};

let usernameSingleton = (function () {
    let instance;

    async function createInstance() {
        return await buildUsernameTrie();
    }

    return {
        getInstance: async function () {
            if (!instance) {
                instance = await createInstance();
            }
            return instance;
        }
    }
})();

let tagNameSingleton = (function () {
    let instance;

    async function createInstance() {
        return await buildTagTrie();
    }

    return {
        getInstance: async function () {
            if (!instance) {
                instance = await createInstance();
            }
            return instance;
        }
    }
})();

module.exports = {
    usernameSingleton,
    tagNameSingleton
};