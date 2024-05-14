import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageViewerComponent from '../components/ImageViewerComponent';

function AmmoniteViewer() {
  const [ammonite, setAmmonite] = useState(null);
  const [editAmmonite, setEditAmmonite] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/api/ammonites/${id}`)
      .then(response => response.json())
      .then(data => {
        setAmmonite(data);
        setEditAmmonite(data);
      })
      .catch(error => console.error('Failed to fetch ammonite:', error));
  }, [id]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleImageIdUpdate = (newImageId) => {
    setEditAmmonite(prev => ({ ...prev, imageId: newImageId }));
  };

    const handleSave = () => {
      fetch(`http://localhost:8080/api/ammonites/${id}`, {
        method: 'PUT', // Specifying the HTTP method
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editAmmonite) // Sending the updated ammonite as JSON
      })
      .then(response => {
        if (response.ok) {
          return response.json(); // Returning the updated ammonite from the server
        }
        throw new Error('Network response was not ok.');
      })
      .then(updatedAmmonite => {
        setAmmonite(updatedAmmonite); // Updating local state with the confirmed data from the server
        setIsEditMode(false);
        console.log('Update successful:', updatedAmmonite);
      })
      .catch(error => console.error('Failed to update ammonite:', error));
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditAmmonite(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {ammonite ? (
        <div>
          <h1>{isEditMode ? <input type="text" value={editAmmonite.taxonomySpecies} onChange={handleChange} name="taxonomySpecies" /> : ammonite.taxonomySpecies}</h1>
          <button onClick={handleEditToggle}>{isEditMode ? 'Cancel' : 'Edit'}</button>
          {isEditMode && <button onClick={handleSave}>Save</button>}
          <table>
            {Object.entries(ammonite).map(([key, value]) => {
              //if (key === 'id') return null;
              if (key === 'imageId') {
                return (
                  <tr key={key}>
                    <th>{key}</th>
                    <td><ImageViewerComponent imageId={isEditMode ? editAmmonite[key] : value} width={200} height={200} isEditable={isEditMode} onImageIdUpdate={handleImageIdUpdate} /></td>
                  </tr>
                );
              }
              return (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{isEditMode ? <input type="text" value={editAmmonite[key]} onChange={handleChange} name={key} /> : value}</td>
                </tr>
              );
            })}
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AmmoniteViewer;
