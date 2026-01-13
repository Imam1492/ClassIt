const favicons = require("favicons");
const fs = require("fs");

const source = "siteicon.png"; // your original image

const configuration = {
  path: "/assets/siteicon.png/", // where icons will be stored
  appName: "ClassIt",
  appShortName: "ClassIt",
  appDescription: "ClassIt e-commerce site",
  developerName: "Your Name",
  developerURL: null,
  icons: {
    android: true,
    appleIcon: true,
    favicons: true,
  },
};

favicons(source, configuration, (error, response) => {
  if (error) {
    console.log(error.message);
    return;
  }
  // Save images
  response.images.forEach((image) => {
    fs.writeFileSync("assets/siteicon.png/" + siteicon.png, image.contents);
  });
  // Save html links
  fs.writeFileSync("assets/favicon-links.html", response.html.join("\n"));
});
