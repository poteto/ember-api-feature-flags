const { stringify } = JSON;

export default function sendResponse(data, statusCode = 200, headers = { 'Content-Type': 'application/json' }) {
  return [statusCode, headers, stringify(data)];
}
