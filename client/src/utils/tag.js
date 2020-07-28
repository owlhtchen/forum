import axios from "axios";

export const getTagByID = async (tagID) => {
    let res = await axios.get('/tags-back/tag-by-id/' + tagID);
    return res.data;
}