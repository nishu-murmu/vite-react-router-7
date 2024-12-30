export const sendResponse = ({ data, status = "success", message, ...msg }) => {
  return {
    data,
    status,
    status_code: status === "success" ? 200 : 500,
    message: status === "success" ? "ok" : message,
    error: status === "error",
    ...msg,
  };
};
