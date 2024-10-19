import React from 'react';
import './style/loader.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import Test from './Components/Test';
import Expenses from './Components/SuperAdmin/Expenses';
import Rent from './Components/SuperAdmin/Rent'
import ProtectedRoute from './ProtectedRoute';
import ProtectedAuthRoute from './ProtectedAuthRoute';
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import RentalDetails from './Components/RentalDetails';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ProtectedAuthRoute for unauthenticated users accessing login */}
      <Route element={<ProtectedAuthRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>

      {/* ProtectedRoute for authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<App />}>
          <Route path="/rent" element={<Rent />} />
          <Route path="/rent/:slug" element={<RentalDetails />} />
          <Route path="/borrow" element={<Test />} />
          <Route path="/well-part" element={<Test />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/loan" element={<Test />} />
          <Route path="/reports" element={<Test />} />
          <Route path="/manage-user" element={<Test />} />
        </Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
