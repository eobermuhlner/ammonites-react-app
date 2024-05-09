import React, { useState, useEffect } from 'react';

const ImageViewerComponent = ({ imageId, width, height }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (imageId) {
      fetch(`http://localhost:8080/api/images/${imageId}`)
        .then(response => response.blob())
        .then(blob => {
          const imgSrc = URL.createObjectURL(blob);
          setImageSrc(imgSrc);
        })
        .catch(err => console.error('Error fetching image:', err));
    }
  }, [imageId]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const imageStyles = {
    width: width ? `${width}px` : 'auto',  // Default to auto if no width is provided
    height: height ? `${height}px` : 'auto', // Default to auto if no height is provided
    cursor: 'pointer'
  };

  return (
    <div>
      <img src={imageSrc} alt="No image" style={imageStyles} onClick={handleImageClick} />
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={handleCloseModal}>
          <img src={imageSrc} alt="Full size" style={{
            maxWidth: '90%',
            maxHeight: '90%',
            margin: 'auto',
            display: 'block',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }} onClick={(e) => e.stopPropagation()} /> {/* Stop propagation to prevent modal from closing when clicking the image */}
        </div>
      )}
    </div>
  );
};

export default ImageViewerComponent;
