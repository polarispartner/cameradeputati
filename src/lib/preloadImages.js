const imageModules = import.meta.glob(
  "../assets/images/**/*.{jpg,jpeg,png,svg,webp}",
  { eager: true, query: "?url", import: "default" }
);
export const ALL_IMAGES = Object.values(imageModules);

export function preloadOne(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (img.decode) img.decode().then(resolve, resolve);
      else resolve();
    };
    img.onerror = () => resolve();
    img.src = url;
  });
}

export function preloadAll(onProgress) {
  let done = 0;
  return Promise.all(
    ALL_IMAGES.map((url) =>
      preloadOne(url).then(() => {
        done += 1;
        onProgress?.(done, ALL_IMAGES.length);
      })
    )
  );
}
