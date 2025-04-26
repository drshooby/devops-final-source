const API_BASE_URL = window.appConfig.API_BASE_URL

export async function fetchPhotos() {
    alert(API_BASE_URL)
  const res = await fetch(`${API_BASE_URL}/api/photos`);
  return res.json();
}

export async function addPhoto(photo) {
  await fetch(`${API_BASE_URL}/api/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo),
  });
}

export async function deletePhoto(id) {
  await fetch(`${API_BASE_URL}/api/photos/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE_URL}/api/metrics`);
  return res.json();
}
