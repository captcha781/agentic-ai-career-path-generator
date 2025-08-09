import handleResponse from "../../lib/handleResponse";
import axios from "./Axios";

export const sendChat = async (data, id) => {
  try {
    const response = await axios({
      url: `/user/chat/${id}`,
      method: "POST",
      data,
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const getChatsForCareer = async (id) => {
  try {
    const response = await axios({
      url: `/user/chat/${id}`,
      method: "GET",
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};
