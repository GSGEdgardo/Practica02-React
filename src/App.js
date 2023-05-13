import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ShowForms from './components/ShowForms';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowForms></ShowForms>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
