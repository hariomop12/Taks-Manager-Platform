export default {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || "npg_NIwv4ETC7Xpo",
  refreshTokenSecret:
    process.env.JWT_REFRESH_SECRET || "npg4ETC7XponpgNIwv4ETC7Xpo",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
  refreshTokenExpiryMs: 7 * 24 * 60 * 60 * 1000,
};
