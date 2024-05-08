import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './AmmoniteSearch.css';

function DistanceAsMatchPercentage({ x }) {
  const percentage = (1.0 - x) * 100;

  return <div>{percentage.toFixed(2)}%</div>;
}

function AmmoniteSearch() {
    const [filters, setFilters] = useState({
        diameterSide: '',
        diameterCross: '',
        proportionN: '',
        proportionH: '',
        proportionB: '',
        proportionQ: '',
        countZ: ''
    });
    const [results, setResults] = useState([]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearch = async () => {
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

    return (
        <div>
            <h1>Ammonite Search</h1>
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
                        <label htmlFor="countZ">Count Z:</label>
                        <input type="text" name="countZ" placeholder="Count Z" value={filters.countZ} onChange={handleInputChange} />
                    </div>
                    <div>
                        <button onClick={handleSearch}>Search</button>
                    </div>
                </div>
            <table>
                <thead>
                    <tr>
                        <th>Match</th>
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
                        <th>Diameter Side</th>
                        <th>Diameter Cross</th>
                        <th>N</th>
                        <th>H</th>
                        <th>B</th>
                        <th>Q</th>
                        <th>Z</th>
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
                            <td>{result.ammonite.taxonomySubclass}</td>
                            <td>{result.ammonite.taxonomyFamily}</td>
                            <td>{result.ammonite.taxonomySubfamily}</td>
                            <td>{result.ammonite.taxonomyGenus}</td>
                            <td>{result.ammonite.taxonomySubgenus}</td>
                            <td>{result.ammonite.taxonomySpecies}</td>
                            <td>{result.ammonite.strata}</td>
                            <td>{result.ammonite.description}</td>
                            <td>{result.ammonite.comment}</td>
                            <td>{result.measurement.diameterSide}</td>
                            <td>{result.measurement.diameterCross}</td>
                            <td>{result.measurement.proportionN}</td>
                            <td>{result.measurement.proportionH}</td>
                            <td>{result.measurement.proportionB}</td>
                            <td>{result.measurement.proportionQ}</td>
                            <td>{result.measurement.countZ}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AmmoniteSearch;