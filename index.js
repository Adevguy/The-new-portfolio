import "./config.js";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { verifyContactForm } from "./emailSchema.js";
import { sendContactEmail, sendConfirmationEmail } from "./sendEmail.js";
import helmet from "helmet";
import mongoose from "mongoose";
import flash from "connect-flash";
import MongoStore from "connect-mongo";
import session from "express-session";
import Blogs from "./models/Blogs.js";
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const isSecured = process.env.secured;
const store = MongoStore.create({
  mongoUrl: dbURI,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
});
app.set("trust proxy", true);
const sessionConfig = {
  store,
  name: "sessionname",
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 10 * 60 * 1000, //10 minutes
    maxAge: 10 * 60 * 1000,
    secured: isSecured,
  },
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));
app.use(flash());

app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const fontSrcUrls = [
  "https://fonts.gstatic.com/", // Google Fonts
  "https://cdnjs.cloudflare.com/", // Font Awesome
  "https://use.fontawesome.com/", // Font Awesome alternative CDN
  "https://cdn.jsdelivr.net", // Bootstrap Icons or other font assets
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
      scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        // "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://r4.wallpaperflare.com/wallpaper/266/292/19/abstract-white-pattern-cube-square-hd-wallpaper-0aa8680b451c93520f9a6048eac8fa72.jpg",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.get("/", (req, res) => {
  res.render("pages/main");
});
app.get("/aboutus", (req, res) => {
  res.render("pages/aboutus");
});
app.get("/blog", async (req, res, next) => {
  try {
    const blogs = await Blogs.find({});
    res.render("pages/blog", { blogs });
  } catch (e) {
    next(e);
  }
});
// app.get("/post", async (req, res) => {
//   const newBlog = new Blogs({
//     header: "DevDou’s new portfolio now in action releasing on march 20, 2025",
//     content:
//       "We are excited to publish this full-stack portfolio website made with html css javascript nodejs and mongodb",
//   });
//   await newBlog.save()
//   res.redirect("/blog")
// });
app.get("/error", (req, res) => {
  res.send(req.query.msg);
});
app.post("/contact-us", async (req, res, next) => {
  try {
    const { email, username, message } = req.body;
    const { error } = verifyContactForm.validate({ email, message, username });
    if (error) {
      next(error);
    } else {
      await sendContactEmail(username, email, message, next);
      await sendConfirmationEmail(email, next);
      req.flash("success", "Email sent successfully");
      res.redirect("/");
    }
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  const { message = "Somehting went wrong, Try again!", status = 500 } = err;
  console.log(err);
  req.flash("error", err.message);
  res.status(status).redirect(`/`);
});

app.all("*", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Working on port 3000");
});
