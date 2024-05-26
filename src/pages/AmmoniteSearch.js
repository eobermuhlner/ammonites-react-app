import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatchingAmmonites } from '../services/api';
import ImageViewerComponent from '../components/ImageViewerComponent';
import ImageMeasure from '../components/ImageMeasure';
import './AmmoniteSearch.css';
import { useTranslation } from 'react-i18next';

function DistanceAsMatchPercentage({ x }) {
    const percentage = (1.0 - x) * 100;
    return <div>{percentage.toFixed(3)}%</div>;
}

function AmmoniteSearch() {
    const [filters, setFilters] = useState({
        diameterSide: '',
        diameterCross: '',
        proportionN: '',
        proportionH: '',
        proportionB: '',
        proportionQ: '',
        countPrimaryRibs: '',
        countSecondaryRibs: '',
        ribDivisionRatio: '',
        turns: '',
        limit: 10
    });
    const [results, setResults] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (filters.diameterSide && filters.diameterCross) {
            const newProportionB = (parseFloat(filters.diameterCross) / parseFloat(filters.diameterSide)).toFixed(1);
            if (filters.proportionB !== newProportionB) {
                setFilters(prevState => ({
                    ...prevState,
                    proportionB: newProportionB
                }));
            }
        }
    }, [filters.diameterSide, filters.diameterCross]);

    useEffect(() => {
        if (filters.proportionH && filters.proportionB) {
            const newProportionQ = (parseFloat(filters.proportionH) / parseFloat(filters.proportionB)).toFixed(1);
            if (filters.proportionQ !== newProportionQ) {
                setFilters(prevState => ({
                    ...prevState,
                    proportionQ: newProportionQ
                }));
            }
        }
    }, [filters.proportionH, filters.proportionB]);

    useEffect(() => {
        if (filters.countPrimaryRibs && filters.countSecondaryRibs) {
            const newRibDivisionRatio = (parseFloat(filters.countSecondaryRibs) / parseFloat(filters.countPrimaryRibs)).toFixed(1);
            if (filters.ribDivisionRatio !== newRibDivisionRatio) {
                setFilters(prevState => ({
                    ...prevState,
                    ribDivisionRatio: newRibDivisionRatio
                }));
            }
        }
    }, [filters.countPrimaryRibs, filters.countSecondaryRibs]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: name === 'limit' ? parseInt(value, 10) : value
        }));
    };

    const handleSearch = async () => {
        setResults([]);
        fetchMatchingAmmonites(filters)
            .then(setResults);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateN = (newN) => {
        if (filters.proportionN !== newN) {
            setFilters(prevState => ({
                ...prevState,
                proportionN: newN
            }));
        }
    };

    const handleUpdateH = (newH) => {
        if (filters.proportionH !== newH) {
            setFilters(prevState => ({
                ...prevState,
                proportionH: newH
            }));
        }
    };

    const AmmoniteMeasurementCard = ({ result }) => (
        <div className="card d-md-none mb-4">
            <div className="card-header">
                <div><strong>{t('ammoniteSearch.species')}:</strong> {result.ammonite.taxonomySpecies}</div>
                <DistanceAsMatchPercentage x={result.distance} />
            </div>
            <div className="card-body">
                <div><ImageViewerComponent imageId={result.ammonite.imageId} width={100} height={100} /></div>
                <div><strong>{t('ammoniteSearch.strata')}:</strong> {result.ammonite.strata}</div>
                <div><strong>{t('ammoniteSearch.diameterSide')}:</strong> {result.measurement.diameterSide}</div>
                <div><strong>{t('ammoniteSearch.diameterCross')}:</strong> {result.measurement.diameterCross}</div>
                <div><strong>{t('ammoniteSearch.proportionN')}:</strong> {result.measurement.proportionN}</div>
                <div><strong>{t('ammoniteSearch.proportionH')}:</strong> {result.measurement.proportionH}</div>
                <div><strong>{t('ammoniteSearch.proportionB')}:</strong> {result.measurement.proportionB}</div>
                <div><strong>{t('ammoniteSearch.proportionQ')}:</strong> {result.measurement.proportionQ}</div>
                <div><strong>{t('ammoniteSearch.countPrimaryRibs')}:</strong> {result.measurement.countPrimaryRibs}</div>
                <div><strong>{t('ammoniteSearch.countSecondaryRibs')}:</strong> {result.measurement.countSecondaryRibs}</div>
                <div><strong>{t('ammoniteSearch.ribDivisionRatio')}:</strong> {result.measurement.ribDivisionRatio}</div>
                <div><ImageViewerComponent imageId={result.measurement.imageId} width={100} height={100} /></div>
                <Link to={`/ammonite/${result.ammonite.id}`}>
                    <button className="btn btn-sm btn-info mt-2">{t('ammoniteSearch.view')}</button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="container">
            <h1 className="text-center my-4">{t('ammoniteSearch.title')}</h1>
            <div className="row justify-content-center">
                <div className="col-12 text-center">
                    <input type="file" onChange={handleImageChange} className="form-control mb-3" />
                    {imageUrl && (
                        <div className="image-measure-container">
                            <ImageMeasure
                                imageUrl={imageUrl}
                                width="80%"
                                height="80%"
                                countPrimaryRibs={filters.countPrimaryRibs}
                                turns={filters.turns}
                                onUpdateN={handleUpdateN}
                                onUpdateH={handleUpdateH}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="row justify-content-center mt-4">
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="diameterSide">{t('ammoniteSearch.diameterSide')}:</label>
                        <input
                            type="text"
                            name="diameterSide"
                            placeholder={t('ammoniteSearch.diameterSide')}
                            value={filters.diameterSide}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="diameterCross">{t('ammoniteSearch.diameterCross')}:</label>
                        <input
                            type="text"
                            name="diameterCross"
                            placeholder={t('ammoniteSearch.diameterCross')}
                            value={filters.diameterCross}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionN">{t('ammoniteSearch.proportionN')}:</label>
                        <input
                            type="text"
                            name="proportionN"
                            placeholder={t('ammoniteSearch.proportionN')}
                            value={filters.proportionN}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionH">{t('ammoniteSearch.proportionH')}:</label>
                        <input
                            type="text"
                            name="proportionH"
                            placeholder={t('ammoniteSearch.proportionH')}
                            value={filters.proportionH}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionB">{t('ammoniteSearch.proportionB')}:</label>
                        <input
                            type="text"
                            name="proportionB"
                            placeholder={t('ammoniteSearch.proportionB')}
                            value={filters.proportionB}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionQ">{t('ammoniteSearch.proportionQ')}:</label>
                        <input
                            type="text"
                            name="proportionQ"
                            placeholder={t('ammoniteSearch.proportionQ')}
                            value={filters.proportionQ}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="countPrimaryRibs">{t('ammoniteSearch.countPrimaryRibs')}:</label>
                        <input
                            type="text"
                            name="countPrimaryRibs"
                            placeholder={t('ammoniteSearch.countPrimaryRibs')}
                            value={filters.countPrimaryRibs}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="countSecondaryRibs">{t('ammoniteSearch.countSecondaryRibs')}:</label>
                        <input
                            type="text"
                            name="countSecondaryRibs"
                            placeholder={t('ammoniteSearch.countSecondaryRibs')}
                            value={filters.countSecondaryRibs}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ribDivisionRatio">{t('ammoniteSearch.ribDivisionRatio')}:</label>
                        <input
                            type="text"
                            name="ribDivisionRatio"
                            placeholder={t('ammoniteSearch.ribDivisionRatio')}
                            value={filters.ribDivisionRatio}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="turns">{t('ammoniteSearch.turns')}:</label>
                        <input
                            type="text"
                            name="turns"
                            placeholder={t('ammoniteSearch.turns')}
                            value={filters.turns}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="limit">{t('ammoniteSearch.limit')}:</label>
                        <input
                            type="number"
                            name="limit"
                            placeholder={t('ammoniteSearch.limit')}
                            value={filters.limit}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <button onClick={handleSearch} className="btn btn-primary">{t('ammoniteSearch.search')}</button>
                </div>
            </div>
            <div className="table-responsive mt-4 d-none d-md-block">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                    <tr>
                        <th>{t('ammoniteSearch.match')}</th>
                        <th></th>
                        <th>{t('ammoniteSearch.species')}</th>
                        <th>{t('ammoniteSearch.strata')}</th>
                        <th>{t('ammoniteSearch.image')}</th>
                        <th>{t('ammoniteSearch.diameterSide')}</th>
                        <th>{t('ammoniteSearch.diameterCross')}</th>
                        <th>{t('ammoniteSearch.proportionN')}</th>
                        <th>{t('ammoniteSearch.proportionH')}</th>
                        <th>{t('ammoniteSearch.proportionB')}</th>
                        <th>{t('ammoniteSearch.proportionQ')}</th>
                        <th>{t('ammoniteSearch.countPrimaryRibs')}</th>
                        <th>{t('ammoniteSearch.countSecondaryRibs')}</th>
                        <th>{t('ammoniteSearch.ribDivisionRatio')}</th>
                        <th>{t('ammoniteSearch.measurementImage')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map(result => (
                        <tr key={result.ammonite.id}>
                            <td><DistanceAsMatchPercentage x={result.distance} /></td>
                            <td>
                                <Link to={`/ammonite/${result.ammonite.id}`}>
                                    <button className="btn btn-sm btn-info">{t('ammoniteSearch.view')}</button>
                                </Link>
                            </td>
                            <td>{result.ammonite.taxonomySpecies}</td>
                            <td>{result.ammonite.strata}</td>
                            <td><ImageViewerComponent imageId={result.ammonite.imageId} width={100} height={100} /></td>
                            <td>{result.measurement.diameterSide}</td>
                            <td>{result.measurement.diameterCross}</td>
                            <td>{result.measurement.proportionN}</td>
                            <td>{result.measurement.proportionH}</td>
                            <td>{result.measurement.proportionB}</td>
                            <td>{result.measurement.proportionQ}</td>
                            <td>{result.measurement.countPrimaryRibs}</td>
                            <td>{result.measurement.countSecondaryRibs}</td>
                            <td>{result.measurement.ribDivisionRatio}</td>
                            <td><ImageViewerComponent imageId={result.measurement.imageId} width={100} height={100} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="d-md-none">
                {results.map(result => (
                    <AmmoniteMeasurementCard key={result.ammonite.id} result={result} />
                ))}
            </div>
        </div>
    );
}

export default AmmoniteSearch;
