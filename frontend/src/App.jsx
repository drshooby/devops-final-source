import { useEffect, useState } from 'react';
import { fetchPhotos, addPhoto, deletePhoto, fetchMetrics, sendEmail } from './api';
import PhotoForm from './PhotoForm';
import PhotoList from './PhotoList';
import ProgressBar from './ProgressBar';
import EmailModal from './EmailModal';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [metrics, setMetrics] = useState({
    count: 0,
    nextMilestone: 1,
    progress: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    const milestone = metrics.nextMilestone
    const updatedMetrics = await fetchMetrics();
    setMetrics(updatedMetrics);

    if (updatedMetrics.count === milestone) {
      setIsModalOpen(true);
    }
  }

  async function handleDelete(id) {
    await deletePhoto(id);
    await loadPhotos();
    await loadMetrics();
  }

  async function handleEmailSubmit(name, email) {
    try {
      await sendEmail(email, name, metrics.count);
      alert("Congrats email has been sent!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send milestone email.");
    }
  }

  return (
    <div className="container">
      <h1>Photo Summary App</h1>
      <p>{metrics.count} photos uploaded! (Next milestone: {metrics.nextMilestone} photos)</p>
      <ProgressBar progress={metrics.progress} />
      <PhotoForm onAdd={handleAdd} />
      <PhotoList photos={photos} onDelete={handleDelete} />

      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSubmit}
        milestoneCount={metrics.count}
      />
    </div>
  );
}