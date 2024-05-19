import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllAmmonites } from '../services/api';
import ImageViewerComponent from '../components/ImageViewerComponent';
import './AmmoniteBrowse.css';

function AmmoniteBrowse() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    taxonomyFamily: '',
    taxonomySpecies: '',
    strata: ''
  });

  useEffect(() => {
    fetchAllAmmonites()
      .then(setData);
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

  const AmmoniteCard = ({ item }) => (
    <div className="card d-md-none mb-4">
      <div className="card-header">
        <div><strong>Species:</strong> {item.taxonomySpecies}</div>
      </div>
      <div className="card-body">
        <div><strong>Subclass:</strong> {item.taxonomySubclass}</div>
        <div><strong>Family:</strong> {item.taxonomyFamily}</div>
        <div><strong>Subfamily:</strong> {item.taxonomySubfamily}</div>
        <div><strong>Genus:</strong> {item.taxonomyGenus}</div>
        <div><strong>Subgenus:</strong> {item.taxonomySubgenus}</div>
        <div><strong>Strata:</strong> {item.strata}</div>
        <div><strong>Description:</strong> {item.description}</div>
        <div><strong>Comment:</strong> {item.comment}</div>
        <div><ImageViewerComponent imageId={item.imageId} width={100} height={100} /></div>
        <Link to={`/ammonite/${item.id}`}>
          <button className="btn btn-primary btn-sm">View</button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1 className="my-4">Browse</h1>
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
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped table-bordered">
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
                    <button className="btn btn-primary btn-sm">View</button>
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
      <div className="d-md-none">
        {filteredData.map(item => (
          <AmmoniteCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default AmmoniteBrowse;
