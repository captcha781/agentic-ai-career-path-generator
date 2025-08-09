import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    toasts: [],
}

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast: (state, action) => {
            state.toasts.push(action.payload)
            return state
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
            return state
        },
    },
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer
