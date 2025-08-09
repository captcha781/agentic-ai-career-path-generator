import handleResponse from "../../lib/handleResponse";
import axios from "./Axios";

export const refreshToken = async () => {
  try {
    const response = await axios({
      url: "/auth/refresh-token",
      method: "GET",
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const signup = async (data) => {
  try {
    const response = await axios({
      url: "/auth/signup",
      method: "POST",
      data,
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await axios({
      url: `/auth/email-verify/${token}`,
      method: "GET",
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const createPassword = async (data) => {
  try {
    const response = await axios({
      url: "/auth/create-password",
      method: "POST",
      data,
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const signin = async (data) => {
  try {
    const response = await axios({
      url: "/auth/signin",
      method: "POST",
      data,
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const signout = async () => {
  try {
    const response = await axios({
      url: "/auth/signout",
      method: "GET",
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const userInfo = async () => {
  try {
    const response = await axios({
      url: "/user/user-info",
      method: "GET",
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const createCareerPath = async (data) => {
  try {
    const response = await axios({
      url: "/user/career-path",
      method: "POST",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const getCareerPaths = async () => {
  try {
    const response = await axios({
      url: "/user/career-path",
      method: "GET",
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const getCareerPathById = async (id) => {
  try {
    const response = await axios({
      url: `/user/career-path/${id}`,
      method: "GET",
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};

export const updateCareerTasks = async (data, id) => {
  try {
    const response = await axios({
      url: `/user/career-path/${id}`,
      method: "PUT",
      data,
    });

    return handleResponse(response, "success");
  } catch (error) {
    return handleResponse(error, "error");
  }
};
