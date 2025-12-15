const whitelist = [
  "http://localhost:5173",   // Vite
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow postman, curl (origin = undefined)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,     // Allow cookie / auth header
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
