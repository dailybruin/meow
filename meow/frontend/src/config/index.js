const ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://meow.dailybruin.com"
    : typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5000";

const config = {
  SERVER_URL: `${ORIGIN}/api/v1`,
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3
};

export default config;
