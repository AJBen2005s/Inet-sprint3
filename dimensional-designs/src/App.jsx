import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';

function App() {
    return (
        <div>
            <Nav />
            <Outlet /> {/* This renders the child routes */}
        </div>
    );
}

export default App;
