const checkPassword = async (password = "") => {
  const response = await fetch("/api/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  return response?.ok;
};

const getReports = async (page = 1, password = "") => {
  const response = await fetch(
    `/api/reports?page=${page}&password=${password}`
  );

  const data = await response.json();

  return data;
};

const createReport = async (body = {}) => {
  const response = await fetch("/api/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return data;
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export { checkPassword, getReports, createReport, fetcher };
