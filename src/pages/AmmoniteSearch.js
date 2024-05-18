import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatchingAmmonites } from '../services/api';
import ImageViewerComponent from '../components/ImageViewerComponent';
import ImageMeasure from '../components/ImageMeasure';
import './AmmoniteSearch.css';

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
                <div><strong>Species:</strong> {result.ammonite.taxonomySpecies}</div>
                <DistanceAsMatchPercentage x={result.distance} />
            </div>
            <div className="card-body">
                <div><ImageViewerComponent imageId={result.ammonite.imageId} width={100} height={100} /></div>
                <div><strong>Strata:</strong> {result.ammonite.strata}</div>
                <div><strong>Diameter Side:</strong> {result.measurement.diameterSide}</div>
                <div><strong>Diameter Cross:</strong> {result.measurement.diameterCross}</div>
                <div><strong>N:</strong> {result.measurement.proportionN}</div>
                <div><strong>H:</strong> {result.measurement.proportionH}</div>
                <div><strong>B:</strong> {result.measurement.proportionB}</div>
                <div><strong>Q:</strong> {result.measurement.proportionQ}</div>
                <div><strong>Primary Ribs:</strong> {result.measurement.countPrimaryRibs}</div>
                <div><strong>Secondary Ribs:</strong> {result.measurement.countSecondaryRibs}</div>
                <div><strong>Rib Division Ratio:</strong> {result.measurement.ribDivisionRatio}</div>
                <div><ImageViewerComponent imageId={result.measurement.imageId} width={100} height={100} /></div>
                <Link to={`/ammonite/${result.ammonite.id}`}>
                    <button className="btn btn-sm btn-info mt-2">View</button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="container">
            <h1 className="text-center my-4">Ammonite Search</h1>
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
                        <label htmlFor="diameterSide">Diameter Side:</label>
                        <input
                            type="text"
                            name="diameterSide"
                            placeholder="Diameter Side"
                            value={filters.diameterSide}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="diameterCross">Diameter Cross:</label>
                        <input
                            type="text"
                            name="diameterCross"
                            placeholder="Diameter Cross"
                            value={filters.diameterCross}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionN">Proportion N:</label>
                        <input
                            type="text"
                            name="proportionN"
                            placeholder="Proportion N"
                            value={filters.proportionN}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionH">Proportion H:</label>
                        <input
                            type="text"
                            name="proportionH"
                            placeholder="Proportion H"
                            value={filters.proportionH}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionB">Proportion B:</label>
                        <input
                            type="text"
                            name="proportionB"
                            placeholder="Proportion B"
                            value={filters.proportionB}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="proportionQ">Proportion Q:</label>
                        <input
                            type="text"
                            name="proportionQ"
                            placeholder="Proportion Q"
                            value={filters.proportionQ}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="countPrimaryRibs">Count Primary Ribs:</label>
                        <input
                            type="text"
                            name="countPrimaryRibs"
                            placeholder="Primary Ribs"
                            value={filters.countPrimaryRibs}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="countSecondaryRibs">Count Secondary Ribs:</label>
                        <input
                            type="text"
                            name="countSecondaryRibs"
                            placeholder="Secondary Ribs"
                            value={filters.countSecondaryRibs}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ribDivisionRatio">Rib Division Ratio:</label>
                        <input
                            type="text"
                            name="ribDivisionRatio"
                            placeholder="Rib Division Ratio"
                            value={filters.ribDivisionRatio}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="turns">Turns:</label>
                        <input
                            type="text"
                            name="turns"
                            placeholder="Turns"
                            value={filters.turns}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="limit">Result Limit:</label>
                        <input
                            type="number"
                            name="limit"
                            placeholder="Result Limit"
                            value={filters.limit}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                    </div>
                    <button onClick={handleSearch} className="btn btn-primary">Search</button>
                </div>
            </div>
            <div className="table-responsive mt-4 d-none d-md-block">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Match</th>
                            <th></th>
                            <th>Species</th>
                            <th>Strata</th>
                            <th>Image</th>
                            <th>Diameter Side</th>
                            <th>Diameter Cross</th>
                            <th>N</th>
                            <th>H</th>
                            <th>B</th>
                            <th>Q</th>
                            <th>Primary Ribs</th>
                            <th>Secondary Ribs</th>
                            <th>Rib Division Ratio</th>
                            <th>Measurement Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result.ammonite.id}>
                                <td><DistanceAsMatchPercentage x={result.distance} /></td>
                                <td>
                                    <Link to={`/ammonite/${result.ammonite.id}`}>
                                        <button className="btn btn-sm btn-info">View</button>
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
