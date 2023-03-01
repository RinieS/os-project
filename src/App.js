import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';
import { Home, NotFound, AddContractor, ContractorList } from './pages';
import ContractorContext from './contexts/ContractorContext';

function App() {
	return (
		<>
			<div className='App'>
				<ContractorContext>
					<Router>
						<Routes>
							<Route path='*' element={<NotFound />} />
							<Route path='/' element={<Home />} />
							<Route path='/contractorList' element={<ContractorList />} />
							<Route path='/addContractor' element={<AddContractor />} />
						</Routes>
					</Router>
				</ContractorContext>
				<ToastContainer />
			</div>
		</>
	);
}

export default App;
