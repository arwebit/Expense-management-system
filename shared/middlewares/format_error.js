const customErrorFormatter = ({ location, msg, param }) => {
  return {
    message: msg,
  };
};
module.exports = customErrorFormatter;
