import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
    user: string | null,
    token: string | null
}

const initialState: UserState = {
    user: null,
    token: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLogin: (
            state,
            action: PayloadAction<{ user: string, token: string }>) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null
        }
    }
})

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer