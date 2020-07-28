import Axios from "axios";

export const getSearchResultsWith = async (keyword) => {
    let res = await Axios.get('/search-back/' + keyword);
    return res.data;
}