const config = {
  SERVER_URL:
    process.env.NODE_ENV === "production"
      ? "https://meow.dailybruin.com/api/v1"
      : "http://localhost:5000/api/v1",
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3
};

export default config;
