// Type definitions for the image manifest JSON file

interface ImageManifest {
  products: {
    [flavor: string]: {
      [strength: string]: string;
    };
  };
  banners: string[];
  timestamp: string;
}

declare module '*/imageManifest.json' {
  const manifest: ImageManifest;
  export default manifest;
}