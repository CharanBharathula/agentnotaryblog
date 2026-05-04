const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function mediaUrl(filename) {
  if (BACKEND_URL) {
    return `${BACKEND_URL}/api/media/${filename}`;
  }
  return `${process.env.PUBLIC_URL}/media/${filename}`;
}
