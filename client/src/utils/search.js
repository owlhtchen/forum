import Axios from "axios";

export const getSearchResultsWith = async (keyword) => {
    let res = await Axios.get('/search/' + keyword);
    return res.data;
}