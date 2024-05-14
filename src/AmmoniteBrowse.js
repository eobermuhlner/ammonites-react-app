import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllAmmonites } from './api';
import ImageViewerComponent from './ImageViewerComponent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container">
      <h1 className="my-4">Data List</h1>
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <label htmlFor="taxonomyFamily">Family:</label>
          <input
            type="text"
            name="taxonomyFamily"
            id="taxonomyFamily"
            className="form-control"
            value={filters.taxonomyFamily}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-4 mb-2">
          <label htmlFor="taxonomySpecies">Species:</label>
          <input
            type="text"
            name="taxonomySpecies"
            id="taxonomySpecies"
            className="form-control"
            value={filters.taxonomySpecies}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-4 mb-2">
          <label htmlFor="strata">Strata:</label>
          <input
            type="text"
            name="strata"
            id="strata"
            className="form-control"
            value={filters.strata}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
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
                    <button className="btn btn-primary btn-sm">View</button>
                  </Link>
                </td>
                <td>{item.id}</td>
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
    </div>
  );
}

export default AmmoniteBrowse;
