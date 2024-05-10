import React, { useState, useEffect } from 'react';

const ImageViewerComponent = ({ imageId, width, height, isEditable, onImageIdUpdate }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (imageId) {
      fetch(`http://localhost:8080/api/images/${imageId}`)
        .then(response => response.blob())
        .then(blob => {
          URL.revokeObjectURL(imageSrc);
          const imgSrc = URL.createObjectURL(blob);
          setImageSrc(imgSrc);
          setEditMode(false);
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

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent modal close
    setEditMode(true);
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    if (newFile) {
        URL.revokeObjectURL(imageSrc); // Revoke the old image URL to free up resources
        const newImageSrc = URL.createObjectURL(newFile);
        setImageSrc(newImageSrc); // Immediately update the imageSrc to reflect the new file
    }
  };

  const handleSaveImage = () => {
    const formData = new FormData();
    formData.append('image', file); // Ensure the key matches the expected field name in your backend

    fetch('http://localhost:8080/api/images/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.id) {
            const newImgSrc = URL.createObjectURL(file);
            setImageSrc(newImgSrc); // Update the image display
            setEditMode(false);
            setIsModalOpen(false); // Close modal after save
            onImageIdUpdate(data.id);  // Notify parent component about the image ID update
        }
    })
    .catch(err => {
        console.error('Failed to upload image:', err);
    });
  };

  const imageStyles = {
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
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
          <div onClick={(e) => e.stopPropagation()}> {/* Stop propagation to prevent modal from closing */}
            <img src={imageSrc} alt="Full size" style={{
              maxWidth: '90%',
              maxHeight: '90%',
              margin: 'auto',
              display: 'block',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }} />
            {editMode ? (
              <>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleSaveImage}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </>
            ) : isEditable && (
              <button onClick={handleEditClick}>Edit Image</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewerComponent;
