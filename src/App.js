import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';
import {
	Home,
	NotFound,
	UpdateProfile,
	ContractorList,
	ContractorProfile,
	Login,
} from './pages';
import ContractorContext from './contexts/ContractorContext';
import AuthControl from './services/auth';
import ContractorProfile from './components/ContractorProfile/ContractorProfile';
import AuthControl from './contexts/auth';

function App() {
	return (
		<>
			<div className='App'>
				<AuthControl>
					<ContractorContext>
									<Router>
							<Routes>
								<Route path='*' element={<NotFound />} />
								<Route path='/' element={<Home />} />
								<Route path='/contractorList' element={<ContractorList />} />
								<Route path='/addContractor' element={<AddContractor />} />
								<Route path='/contractor/:id' element={<ContractorProfile />} />
							</Routes>
						</Router>
					</ContractorContext>
				</AuthControl>
				<ToastContainer />
			</div>
			<AuthControl>
				<ContractorContext>
					<Router>
						<Routes>
							<Route path='*' element={<NotFound />} />
							<Route path='/' element={<Home />} />
							<Route path='/auth' element={<Login />} />
							<Route path='/contractorList' element={<ContractorList />} />
							<Route path='/myProfile' element={<ContractorProfile />} />
							<Route path='/UpdateProfile' element={<UpdateProfile />} />
						</Routes>
					</Router>
				</ContractorContext>
			</AuthControl>
			<ToastContainer />
		</>
	);
}

export default App;
