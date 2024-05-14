import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AmmoniteBrowse from './AmmoniteBrowse';
import AmmoniteSearch from './AmmoniteSearch';
import AmmoniteViewer from './AmmoniteViewer';
import DataImport from './DataImport';
import './App.css';

function App() {
  return (
    <Router>
      <div className="navigation">
        <Link to="/browse">Browse</Link>
        <Link to="/search">Search</Link>
        <Link to="/import">Import</Link>
      </div>
      <Routes>
        <Route path="/browse" element={<AmmoniteBrowse />} />
        <Route path="/search" element={<AmmoniteSearch />} />
        <Route path="/import" element={<DataImport />} />
        <Route path="/ammonite/:id" element={<AmmoniteViewer />} />
      </Routes>
    </Router>
  );
}

export default App;