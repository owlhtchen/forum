module.exports = {
    handleError: (e) => {
        if(e.message.match(/401/g)) {
            alert('please sign in');
            window.location.href = '/users/signin';
        } else {
            console.log(e);
        }
    }
};