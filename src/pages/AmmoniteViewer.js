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
    <div className="container mt-5">
      {ammonite ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{isEditMode ? <input type="text" className="form-control" value={editAmmonite.taxonomySpecies} onChange={handleChange} name="taxonomySpecies" /> : ammonite.taxonomySpecies}</h1>
            <div>
              <button className="btn btn-primary me-2" onClick={handleEditToggle}>{isEditMode ? 'Cancel' : 'Edit'}</button>
              {isEditMode && <button className="btn btn-success" onClick={handleSave}>Save</button>}
            </div>
          </div>
          <table className="table table-bordered">
            <tbody>
              {Object.entries(ammonite).map(([key, value]) => {
                if (key === 'id') return null;
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
                    <td>{isEditMode ? <input type="text" className="form-control" value={editAmmonite[key]} onChange={handleChange} name={key} /> : value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AmmoniteViewer;
