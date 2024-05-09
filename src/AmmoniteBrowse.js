import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllAmmonites } from './api';
import ImageViewerComponent from './ImageViewerComponent';

function AmmoniteBrowse() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    taxonomyFamily: '',
    taxonomySpecies: '',
    strata: ''
  });

  useEffect(() => {
    fetchAllAmmonites()
      .then(setData)
      .catch(error => console.error('Failed to fetch data:', error));
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredData = data.filter(item =>
    item.taxonomyFamily.toLowerCase().includes(filters.taxonomyFamily.toLowerCase()) &&
    item.taxonomySpecies.toLowerCase().includes(filters.taxonomySpecies.toLowerCase()) &&
    item.strata.toLowerCase().includes(filters.strata.toLowerCase())
  );

  return (
    <div>
      <h1>Data List</h1>
      <div>
        <label>Family:</label>
        <input
          type="text"
          name="taxonomyFamily"
          value={filters.taxonomyFamily}
          onChange={handleFilterChange}
        />
        <label>Species:</label>
        <input
          type="text"
          name="taxonomySpecies"
          value={filters.taxonomySpecies}
          onChange={handleFilterChange}
        />
        <label>Strata:</label>
        <input
          type="text"
          name="strata"
          value={filters.strata}
          onChange={handleFilterChange}
        />
      </div>
      <table>
        {/* Table headers and body here */}
        <thead>
          <tr>
            <th></th>
            <th>Subclass</th>
            <th>Family</th>
            <th>Subfamily</th>
            <th>Genus</th>
            <th>Subgenus</th>
            <th>Species</th>
            <th>Strata</th>
            <th>Description</th>
            <th>Comment</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id}>
            <td>
                <Link to={`/ammonite/${item.id}`}>
                    <button>View</button>
                </Link>
            </td>
              <td>{item.taxonomySubclass}</td>
              <td>{item.taxonomyFamily}</td>
              <td>{item.taxonomySubfamily}</td>
              <td>{item.taxonomyGenus}</td>
              <td>{item.taxonomySubgenus}</td>
              <td>{item.taxonomySpecies}</td>
              <td>{item.strata}</td>
              <td>{item.description}</td>
              <td>{item.comment}</td>
              <td><ImageViewerComponent imageId={item.imageId} width={100} height={100} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AmmoniteBrowse;
