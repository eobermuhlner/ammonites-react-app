import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageViewerComponent from './ImageViewerComponent';
import ImageMeasure from './ImageMeasure';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
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
        ribDivisionRatio: ''
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
            [name]: value
        }));
    };

    const handleSearch = async () => {
        setResults([]);
        try {
            const response = await axios.get(`http://localhost:8080/api/ammonites/matching`, {
                params: filters
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResults([]);
        }
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

    return (
        <div>
            <h1>Ammonite Search</h1>
            <div className="row">
                <div className="col-md-6">
                    <input type="file" onChange={handleImageChange} />
                    {imageUrl && <ImageMeasure imageUrl={imageUrl} width={800} height={800} countPrimaryRibs={filters.countPrimaryRibs} onUpdateN={handleUpdateN} onUpdateH={handleUpdateH}/>}
                </div>
                <div className="col-md-6">
                    <div>
                        <div>
                            <label htmlFor="diameterSide">Diameter Side:</label>
                            <input type="text" name="diameterSide" placeholder="Diameter Side" value={filters.diameterSide} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="diameterCross">Diameter Cross:</label>
                            <input type="text" name="diameterCross" placeholder="Diameter Cross" value={filters.diameterCross} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="proportionN">Proportion N:</label>
                            <input type="text" name="proportionN" placeholder="Proportion N" value={filters.proportionN} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="proportionH">Proportion H:</label>
                            <input type="text" name="proportionH" placeholder="Proportion H" value={filters.proportionH} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="proportionB">Proportion B:</label>
                            <input type="text" name="proportionB" placeholder="Proportion B" value={filters.proportionB} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="proportionQ">Proportion Q:</label>
                            <input type="text" name="proportionQ" placeholder="Proportion Q" value={filters.proportionQ} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="countPrimaryRibs">Count Primary Ribs:</label>
                            <input type="text" name="countPrimaryRibs" placeholder="Count Primary Ribs" value={filters.countPrimaryRibs} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="countSecondaryRibs">Count Secondary Ribs:</label>
                            <input type="text" name="countSecondaryRibs" placeholder="Count Secondary Ribs" value={filters.countSecondaryRibs} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="ribDivisionRatio">Rib Division Ratio:</label>
                            <input type="text" name="ribDivisionRatio" placeholder="Rib Division Ratio" value={filters.ribDivisionRatio} onChange={handleInputChange} />
                        </div>
                        <div>
                            <button onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Match</th>
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
                                    <button>View</button>
                                </Link>
                            </td>
                            <td>{result.ammonite.id}</td>
                            <td>{result.ammonite.taxonomySubclass}</td>
                            <td>{result.ammonite.taxonomyFamily}</td>
                            <td>{result.ammonite.taxonomySubfamily}</td>
                            <td>{result.ammonite.taxonomyGenus}</td>
                            <td>{result.ammonite.taxonomySubgenus}</td>
                            <td>{result.ammonite.taxonomySpecies}</td>
                            <td>{result.ammonite.strata}</td>
                            <td>{result.ammonite.description}</td>
                            <td>{result.ammonite.comment}</td>
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
    );
}

export default AmmoniteSearch;
