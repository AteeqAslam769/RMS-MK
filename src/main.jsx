import React from 'react';
import './style/loader.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css'
import Test from './Components/Test';
import Expenses from './Components/SuperAdmin/Expenses';
import ProtectedRoute from './ProtectedRoute';
import { Provider } from 'react-redux';
import store from './store/store'
import Login from './Pages/Login';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<App />}>
            <Route path="/rent" element={<Test />} />
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
