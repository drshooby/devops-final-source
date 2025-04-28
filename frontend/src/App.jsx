import { useEffect, useState } from 'react';
import { fetchPhotos, addPhoto, deletePhoto, fetchMetrics, sendEmail } from './api';
import PhotoForm from './PhotoForm';
import PhotoList from './PhotoList';
import ProgressBar from './ProgressBar';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [metrics, setMetrics] = useState({
    count: 0,
    nextMilestone: 1,
    progress: 0,
  });

  useEffect(() => {
    loadPhotos();
    loadMetrics();
  }, []);

  async function loadPhotos() {
    const data = await fetchPhotos();
    setPhotos(data);
  }

  async function loadMetrics() {
    const data = await fetchMetrics();
    setMetrics(data);
  }

  async function handleAdd(photo) {
    await addPhoto(photo);
    await loadPhotos();
    await loadMetrics();

    const updatedMetrics = await fetchMetrics();

    if (updatedMetrics.count === updatedMetrics.nextMilestone) {
      const email = prompt("Enter your email to celebrate the milestone!");
      const name = prompt("Enter your name!");

      if (email && name) {
        try {
          await sendEmail(email, name, updatedMetrics.count);
          alert("Congrats email has been sent!");
        } catch (error) {
          console.error("Failed to send email:", error);
          alert("Failed to send milestone email.");
        }
      }
    }
  }

  async function handleDelete(id) {
    await deletePhoto(id);
    await loadPhotos();
    await loadMetrics();
  }

  return (
    <div className="container">
      <h1>Photo Summary App</h1>
      <p>{metrics.count} photos uploaded! (Next milestone: {metrics.nextMilestone} photos)</p>
      <ProgressBar progress={metrics.progress} />
      <PhotoForm onAdd={handleAdd} />
      <PhotoList photos={photos} onDelete={handleDelete} />
    </div>
  );
}