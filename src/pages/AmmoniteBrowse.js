import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTaxonomyOptions, fetchBrowseAmmonites } from '../services/api';
import ImageViewerComponent from '../components/ImageViewerComponent';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
          <div><strong>{t('entity.ammonite.species')}:</strong> {item.taxonomySpecies}</div>
        </div>
        <div className="card-body">
          <div><strong>{t('entity.ammonite.subclass')}:</strong> {item.taxonomySubclass}</div>
          <div><strong>{t('entity.ammonite.family')}:</strong> {item.taxonomyFamily}</div>
          <div><strong>{t('entity.ammonite.subfamily')}:</strong> {item.taxonomySubfamily}</div>
          <div><strong>{t('entity.ammonite.genus')}:</strong> {item.taxonomyGenus}</div>
          <div><strong>{t('entity.ammonite.subgenus')}:</strong> {item.taxonomySubgenus}</div>
          <div><strong>{t('entity.ammonite.strata')}:</strong> {item.strata}</div>
          <div><strong>{t('entity.ammonite.description')}:</strong> {item.description}</div>
          <div><strong>{t('entity.ammonite.comment')}:</strong> {item.comment}</div>
          <div><ImageViewerComponent imageId={item.imageId} width={100} height={100} /></div>
          <Link to={`/ammonite/${item.id}`}>
            <button className="btn btn-primary btn-sm">View</button>
          </Link>
        </div>
      </div>
  );

  return (
      <div className="container">
        <h1 className="my-4">{t('ammoniteBrowse.title')}</h1>
        <div className="mb-4">
          <div className="form-group">
            <label htmlFor="taxonomySubclass">{t('entity.ammonite.subclass')}:</label>
            <select
                name="taxonomySubclass"
                id="taxonomySubclass"
                className="form-control"
                value={filters.taxonomySubclass}
                onChange={handleFilterChange}
            >
              <option value="">{t('ammoniteBrowse.selectSubclass')}</option>
              {options.subclasses.map(subclass => (
                  <option key={subclass} value={subclass}>{subclass}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomyFamily">{t('entity.ammonite.family')}:</label>
            <select
                name="taxonomyFamily"
                id="taxonomyFamily"
                className="form-control"
                value={filters.taxonomyFamily}
                onChange={handleFilterChange}
            >
              <option value="">{t('ammoniteBrowse.selectFamily')}</option>
              {options.families.map(family => (
                  <option key={family} value={family}>{family}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomySubfamily">{t('entity.ammonite.subfamily')}:</label>
            <select
                name="taxonomySubfamily"
                id="taxonomySubfamily"
                className="form-control"
                value={filters.taxonomySubfamily}
                onChange={handleFilterChange}
            >
              <option value="">{t('ammoniteBrowse.selectSubfamily')}</option>
              {options.subfamilies.map(subfamily => (
                  <option key={subfamily} value={subfamily}>{subfamily}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomyGenus">{t('entity.ammonite.genus')}:</label>
            <select
                name="taxonomyGenus"
                id="taxonomyGenus"
                className="form-control"
                value={filters.taxonomyGenus}
                onChange={handleFilterChange}
            >
              <option value="">{t('ammoniteBrowse.selectGenus')}</option>
              {options.genera.map(genus => (
                  <option key={genus} value={genus}>{genus}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomySubgenus">{t('entity.ammonite.subgenus')}:</label>
            <select
                name="taxonomySubgenus"
                id="taxonomySubgenus"
                className="form-control"
                value={filters.taxonomySubgenus}
                onChange={handleFilterChange}
            >
              <option value="">{t('ammoniteBrowse.selectSubgenus')}</option>
              {options.subgenera.map(subgenus => (
                  <option key={subgenus} value={subgenus}>{subgenus}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="taxonomySpecies">{t('entity.ammonite.species')}:</label>
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
            <label htmlFor="strata">{t('entity.ammonite.strata')}:</label>
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
            <label htmlFor="description">{t('entity.ammonite.description')}:</label>
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
            <label htmlFor="comment">{t('entity.ammonite.comment')}:</label>
            <input
                type="text"
                name="comment"
                id="comment"
                className="form-control"
                value={filters.comment}
                onChange={handleFilterChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch}>{t('ammoniteBrowse.search')}</button>
        </div>
        <div className="table-responsive d-none d-md-block">
          <table className="table table-striped table-bordered">
            <thead>
            <tr>
              <th></th>
              <th>{t('entity.ammonite.subclass')}</th>
              <th>{t('entity.ammonite.family')}</th>
              <th>{t('entity.ammonite.subfamily')}</th>
              <th>{t('entity.ammonite.genus')}</th>
              <th>{t('entity.ammonite.subgenus')}</th>
              <th>{t('entity.ammonite.species')}</th>
              <th>{t('entity.ammonite.strata')}</th>
              <th>{t('entity.ammonite.description')}</th>
              <th>{t('entity.ammonite.comment')}</th>
              <th>{t('entity.ammonite.image')}</th>
            </tr>
            </thead>
            <tbody>
            {data.map(item => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/ammonite/${item.id}`}>
                      <button className="btn btn-primary btn-sm">{t('ammoniteBrowse.view')}</button>
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
