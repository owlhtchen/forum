import axios from 'axios'

export const formatDate = (date) => {
    let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};

export const dateInfo = (date) => {
    return ' on '.concat(formatDate(new Date(Date.parse(date))));
};

export const handleError = (e) => {
    if(e.message.match(/401/g)) {
        alert('please sign in');
        window.location.href = '/users/signin';
    } else {
        console.log(e);
    }
}