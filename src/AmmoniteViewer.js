import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';

function AmmoniteViewer() {
  const [ammonite, setAmmonite] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/api/ammonites/${id}`) // Adjust the API path as needed
      .then(response => response.json())
      .then(data => setAmmonite(data))
      .catch(error => console.error('Failed to fetch ammonite:', error));
  }, [id]);

  return (
    <div>
      {ammonite ? (
        <div>
          <h1>{ammonite.taxonomySpecies}</h1>
            <table>
            <tr>
              <th>Subclass</th>
              <td>{ammonite.taxonomySubclass}</td>
            </tr>
            <tr>
              <th>Family</th>
              <td>{ammonite.taxonomyFamily}</td>
            </tr>
            <tr>
              <th>Subfamily</th>
              <td>{ammonite.taxonomySubfamily}</td>
            </tr>
            <tr>
              <th>Genus</th>
              <td>{ammonite.taxonomyGenus}</td>
            </tr>
            <tr>
              <th>Subgenus</th>
              <td>{ammonite.taxonomySubgenus}</td>
            </tr>
            <tr>
              <th>Species</th>
              <td>{ammonite.taxonomySpecies}</td>
            </tr>
            <tr>
              <th>Strata</th>
              <td>{ammonite.strata}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{ammonite.description}</td>
            </tr>
            <tr>
              <th>Comment</th>
              <td>{ammonite.comment}</td>
            </tr>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AmmoniteViewer;
