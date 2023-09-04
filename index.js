// https://github.com/itgalaxy/favicons

import favicons from "favicons";
import fs from "fs/promises";
import path from "path";

const src = "./icon.svg"; // İkonun kaynak dosya yolu.
const dest = "./favicons"; // Çıkış dizini yolu.
const htmlBasename = "index.html"; // HTML dosyasının adı.
const jsonOutputPath = "head.json"; // headData nesnesinin kaydedileceği dosya yolu.

// Configuration objesini oluşturun
const configuration = {
  path: "/favicons",
  appName: "App Name",
  url: "https://x.com/",
  appShortName: "App Short Name",
  appDescription: "App Description",
  // Diğer ayarlar...
  pixel_art: false,
};

// İşleme başlayın
(async () => {
  const response = await favicons(src, configuration);
  await fs.mkdir(dest, { recursive: true });

  await Promise.all(
    response.images.map(
      async (image) =>
        await fs.writeFile(path.join(dest, image.name), image.contents)
    )
  );
  await Promise.all(
    response.files.map(
      async (file) =>
        await fs.writeFile(path.join(dest, file.name), file.contents)
    )
  );

  // HTML dosyasına ekleyin
  await fs.writeFile(path.join(dest, htmlBasename), response.html.join("\n"));

  // headData nesnesini JSON olarak kaydedin
  const headData = {
    app: {
      head: {
        titleTemplate: configuration.appName,
        meta: [
          {
            name: "msapplication-TileColor",
            content: "#00A3E0",
          },
          {
            name: "theme-color",
            content: "#ffffff",
          },
          {
            name: "description",
            content: configuration.appDescription,
          },
          {
            property: "og:url",
            content: configuration.url,
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content: configuration.appName,
          },
          {
            property: "og:description",
            content: configuration.appDescription,
          },
        ],
        link: [
          {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: `/apple-touch-icon.png`,
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: `/favicon-16x16.png`,
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: `/favicon-32x32.png`,
          },
          {
            rel: "manifest",
            href: `/site.webmanifest`,
          },
          {
            rel: "mask-icon",
            href: `/safari-pinned-tab.svg`,
            color: "#00A3E0",
          },
        ],
      },
    },
  };

  await fs.writeFile(jsonOutputPath, JSON.stringify(headData, null, 2));

  // İlgili diğer işlemleri yapabilirsiniz
})();
