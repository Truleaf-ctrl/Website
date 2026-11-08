// Shared form submit: posts a form to send-form.php, which emails it to info@truleaf.in.
// Resolves true on success, false on any failure.
// Note: send-form.php is PHP, so it only runs on the real host (Hostinger), not under `npm run dev`.
export function sendForm(type, form) {
  const data = new FormData(form);
  data.append('form', type);
  return fetch('/send-form.php', { method: 'POST', body: data })
    .then((res) => res.json().then((j) => !!(res.ok && j && j.ok)))
    .catch(() => false);
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
