import {configureStore} from '@reduxjs/toolkit' 
import {authreducer} from '../features/authSlice'

const store = configureStore({
    reducer:authreducer
})

export default store