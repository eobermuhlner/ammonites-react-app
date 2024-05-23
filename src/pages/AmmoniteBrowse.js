import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTaxonomyOptions, fetchBrowseAmmonites } from '../services/api';
import ImageViewerComponent from '../components/ImageViewerComponent';
import './AmmoniteBrowse.css';

function AmmoniteBrowse() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    taxonomySubclass: '',
    taxonomyFamily: '',
    taxonomySubfamily: '',
    taxonomyGenus: '',
    taxonomySubgenus: '',
    taxonomySpecies: '',
    strata: '',
    description: '',
    comment: ''
  });
  const [options, setOptions] = useState({
    subclasses: [],
    families: [],
    subfamilies: [],
    genera: [],
    subgenera: []
  });

  useEffect(() => {
    fetchTaxonomyOptions('subclass').then(subclasses => setOptions(prev => ({ ...prev, subclasses })));
  }, []);

  useEffect(() => {
    if (filters.taxonomySubclass) {
      fetchTaxonomyOptions('family', filters.taxonomySubclass).then(families => setOptions(prev => ({ ...prev, families })));
    }
  }, [filters.taxonomySubclass]);

  useEffect(() => {
    if (filters.taxonomyFamily) {
      fetchTaxonomyOptions('subfamily', filters.taxonomyFamily).then(subfamilies => setOptions(prev => ({ ...prev, subfamilies })));
    }
  }, [filters.taxonomyFamily]);

  useEffect(() => {
    if (filters.taxonomySubfamily) {
      fetchTaxonomyOptions('genus', filters.taxonomySubfamily).then(genera => setOptions(prev => ({ ...prev, genera })));
    }
  }, [filters.taxonomySubfamily]);

  useEffect(() => {
    if (filters.taxonomyGenus) {
      fetchTaxonomyOptions('subgenus', filters.taxonomyGenus).then(subgenera => setOptions(prev => ({ ...prev, subgenera })));
    }
  }, [filters.taxonomyGenus]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let updatedFilters = {
      ...filters,
      [name]: value
    };

    // Empty lower taxonomy dropdowns
    switch (name) {
      case 'taxonomySubclass':
        updatedFilters = {
          ...updatedFilters,
          taxonomyFamily: '',
          taxonomySubfamily: '',
          taxonomyGenus: '',
          taxonomySubgenus: '',
          taxonomySpecies: '',
          strata: ''
        };
        break;
      case 'taxonomyFamily':
        updatedFilters = {
          ...updatedFilters,
          taxonomySubfamily: '',
          taxonomyGenus: '',
          taxonomySubgenus: '',
          taxonomySpecies: '',
          strata: ''
        };
        break;
      case 'taxonomySubfamily':
        updatedFilters = {
          ...updatedFilters,
          taxonomyGenus: '',
          taxonomySubgenus: '',
          taxonomySpecies: '',
          strata: ''
        };
        break;
      case 'taxonomyGenus':
        updatedFilters = {
          ...updatedFilters,
          taxonomySubgenus: '',
          taxonomySpecies: '',
          strata: ''
        };
        break;
      case 'taxonomySubgenus':
        updatedFilters = {
          ...updatedFilters,
          taxonomySpecies: '',
          strata: ''
        };
        break;
      default:
        break;
    }

    setFilters(updatedFilters);
  };

  const handleSearch = () => {
    setData([]);
    fetchBrowseAmmonites(filters).then(setData);
  };

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
        <div className="mb-4">
          <div className="form-group">
            <label htmlFor="taxonomySubclass">Subclass:</label>
            <select
                name="taxonomySubclass"
                id="taxonomySubclass"
                className="form-control"
                value={filters.taxonomySubclass}
                onChange={handleFilterChange}
            >
              <option value="">Select Subclass</option>
              {options.subclasses.map(subclass => (
                  <option key={subclass} value={subclass}>{subclass}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomyFamily">Family:</label>
            <select
                name="taxonomyFamily"
                id="taxonomyFamily"
                className="form-control"
                value={filters.taxonomyFamily}
                onChange={handleFilterChange}
            >
              <option value="">Select Family</option>
              {options.families.map(family => (
                  <option key={family} value={family}>{family}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomySubfamily">Subfamily:</label>
            <select
                name="taxonomySubfamily"
                id="taxonomySubfamily"
                className="form-control"
                value={filters.taxonomySubfamily}
                onChange={handleFilterChange}
            >
              <option value="">Select Subfamily</option>
              {options.subfamilies.map(subfamily => (
                  <option key={subfamily} value={subfamily}>{subfamily}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomyGenus">Genus:</label>
            <select
                name="taxonomyGenus"
                id="taxonomyGenus"
                className="form-control"
                value={filters.taxonomyGenus}
                onChange={handleFilterChange}
            >
              <option value="">Select Genus</option>
              {options.genera.map(genus => (
                  <option key={genus} value={genus}>{genus}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomySubgenus">Subgenus:</label>
            <select
                name="taxonomySubgenus"
                id="taxonomySubgenus"
                className="form-control"
                value={filters.taxonomySubgenus}
                onChange={handleFilterChange}
            >
              <option value="">Select Subgenus</option>
              {options.subgenera.map(subgenus => (
                  <option key={subgenus} value={subgenus}>{subgenus}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomySpecies">Taxonomy Species:</label>
            <input
                type="text"
                name="taxonomySpecies"
                id="taxonomySpecies"
                className="form-control"
                value={filters.taxonomySpecies}
                onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
                type="text"
                name="description"
                id="description"
                className="form-control"
                value={filters.description}
                onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Comment:</label>
            <input
                type="text"
                name="comment"
                id="comment"
                className="form-control"
                value={filters.comment}
                onChange={handleFilterChange}
            />
          </div>          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
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
            {data.map(item => (
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
          {data.map(item => (
              <AmmoniteCard key={item.id} item={item} />
          ))}
        </div>
      </div>
  );
}

export default AmmoniteBrowse;
