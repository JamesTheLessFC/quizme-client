import axios from "axios";

export const fetchUserDetails = async () => {
  const authToken = localStorage.getItem("AuthToken");
  axios.defaults.headers.common = { Authorization: `${authToken}` };
  const response = await axios.get(
    "https://us-central1-quizme-cf318.cloudfunctions.net/api/user"
  );
  return response.data.userDetails;
};
