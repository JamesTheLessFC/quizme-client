import axios from "axios";

const authToken = localStorage.getItem("AuthToken");
axios.defaults.headers.common = { Authorization: `${authToken}` };

export const fetchQuizzesWithFilter = async (filter, sortBy, set) => {
  const response =
    filter === "saved"
      ? await axios.get(
          "https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/saved"
        )
      : await axios.get(
          `https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/${filter}`,
          {
            params: { sortBy, set },
          }
        );
  return {
    ...response.data,
    filter,
  };
};

export const likeOneQuiz = async (quizId) => {
  const response = await axios.put(
    `https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/${quizId}/like`
  );
  return response.data;
};

export const unlikeOneQuiz = async (quizId) => {
  const response = await axios.put(
    `https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/${quizId}/unlike`
  );
  return response.data;
};

export const saveOneQuiz = async (quizId) => {
  const response = await axios.put(
    `https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/${quizId}/save`
  );
  return response.data;
};

export const unsaveOneQuiz = async (quizId) => {
  const response = await axios.put(
    `https://us-central1-quizme-cf318.cloudfunctions.net/api/quizzes/${quizId}/unsave`
  );
  return response.data;
};
