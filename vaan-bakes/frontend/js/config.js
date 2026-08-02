// ============================================================
// Vaan Bakes — API configuration
// ============================================================
// In local dev (backend serves the frontend) leave API_BASE_URL
// empty so calls are same-origin (/api/...).
//
// For split hosting (frontend on Netlify/GitHub Pages, backend on
// Render), set this to your deployed API URL, e.g.:
//   https://vaan-bakes-api.onrender.com
// ============================================================

window.API_BASE_URL = window.API_BASE_URL || '';

// Utility to build an absolute API path from the configured base.
window.apiUrl = function (endpoint) {
    return window.API_BASE_URL + endpoint;
};

