import React, { useState, useEffect } from 'react';

const ImageComponent = ({ imageId, width, height }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [file, setFile] = useState(null);

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadImage = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    fetch('http://localhost:8080/api/images/${imageId}', {
      method: 'PUT',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Upload successful:', data);
      // Optionally update imageSrc if you want to display the newly uploaded image
    })
    .catch(err => console.error('Error uploading image:', err));
  };

  const imageStyles = {
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto'
  };

  return (
    <div>
      <img src={imageSrc} style={imageStyles} alt="Loaded" />
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadImage}>Upload Image</button>
    </div>
  );
};

export default ImageEditorComponent;
