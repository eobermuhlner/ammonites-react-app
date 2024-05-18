import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AmmoniteBrowse from './pages/AmmoniteBrowse';
import AmmoniteSearch from './pages/AmmoniteSearch';
import AmmoniteViewer from './pages/AmmoniteViewer';
import DataImport from './pages/DataImport';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Ammonite App</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/browse">Browse</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">Search</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/import">Import</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-3">
        <Routes>
          <Route path="/browse" element={<AmmoniteBrowse />} />
          <Route path="/search" element={<AmmoniteSearch />} />
          <Route path="/import" element={<DataImport />} />
          <Route path="/ammonite/:id" element={<AmmoniteViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
