type RelativePathURL = string & { isRelativePathURL: true };

function isRelativePathURL(url: string): url is RelativePathURL {
  const relativePathRegex = /^\.\/.*\.(jpg|jpeg|png|gif)$/;
  return relativePathRegex.test(url);
}

type RemoteDataURL = string & { isRemoteDataURL: true };

const isRemoteDataURL = (url: string): url is RemoteDataURL => {
  return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
};

type LocalFileURL = string & { isLocalFileURL: true };

function isLocalFileURL(url: string): url is LocalFileURL {
  const localFileRegex = /^file:\/\/\/[A-Za-z]:\/|^file:\/\/\/[A-Za-z]:\\|^file:\/\/\/[^/]+?\//;
  return localFileRegex.test(url);
}

type ValidColorHex = string & { isValidColorHex: true };

const isValidColorHex = (color: string): color is ValidColorHex => {
  return /^#[0-9a-f]{3,8}$/i.test(color);
};

export {
  type RelativePathURL,
  isRelativePathURL,
  type RemoteDataURL,
  isRemoteDataURL,
  type LocalFileURL,
  isLocalFileURL,
  type ValidColorHex,
  isValidColorHex,
};
