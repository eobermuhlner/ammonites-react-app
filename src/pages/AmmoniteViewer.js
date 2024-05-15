import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageViewerComponent from '../components/ImageViewerComponent';
import { fetchAmmoniteById, updateAmmoniteById } from '../services/api';

function AmmoniteViewer() {
  const [ammonite, setAmmonite] = useState(null);
  const [editAmmonite, setEditAmmonite] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchAmmoniteById(id)
      .then(data => {
        setAmmonite(data);
        setEditAmmonite(data);
      });
  }, [id]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleImageIdUpdate = (newImageId) => {
    setEditAmmonite(prev => ({ ...prev, imageId: newImageId }));
  };

  const handleSave = () => {
    updateAmmoniteById(ammonite.id, editAmmonite)
      .then(updatedAmmonite => {
        setAmmonite(updatedAmmonite);
        setIsEditMode(false);
      });
  }

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
