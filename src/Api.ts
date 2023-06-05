import axios from "axios";

export const submitFile = async (file: File) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        Authorization: import.meta.env.VITE_API_KEY,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/predict`,
        formData,
        config
      );
      //console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
};
