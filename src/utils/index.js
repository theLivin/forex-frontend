const buildHeaders = (credential) => {
  return { Authorization: `Bearer ${credential}`, Accept: "application/json" };
};

export default {
  buildHeaders,
};
