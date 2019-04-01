const config = {
  SERVER_URL:
    process.env.NODE_ENV === "production"
      ? "https://meow.dailybruin.com/api/v1"
      : "http://localhost:5000/api/v1"
};

export default config;
