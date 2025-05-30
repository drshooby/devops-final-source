export async function fetchPhotos() {
  const res = await fetch(`/api/list/photos`);
  return res.json();
}

export async function addPhoto(photo) {
  await fetch(`/api/list/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo),
  });
}

export async function deletePhoto(id) {
  await fetch(`/api/list/photos/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchMetrics() {
  const res = await fetch(`/api/metrics/progress`);
  return res.json();
}

export async function sendEmail(email, name, count) {
  const payload = {
    to_email: email,
    name: name,
    photo_count: count
  }
  await fetch(`/api/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
