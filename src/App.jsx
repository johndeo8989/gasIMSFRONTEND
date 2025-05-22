import React, { useState, useEffect } from 'react'
import './App.css'
import 'react-toastify/ReactToastify.css'
import AppRouter from './router/Router'
import { ToastContainer } from 'react-toastify'
import { FormDisplayProvider } from './context/DisplayForm/FormContext'
import { Provider } from 'react-redux'
import store from './redux/store'

function App() {

  return (
    <Provider store={store}>
      <FormDisplayProvider>
        <ToastContainer />
        <AppRouter />
      </FormDisplayProvider>
    </Provider>
  )
}

export default App
