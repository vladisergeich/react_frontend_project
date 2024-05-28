import {createSlice} from "@reduxjs/toolkit";
import {PollutionType} from "../../types/pollutionType";

const initialState = {
    list: [] as PollutionType[]
}

const serverPort = process.env.REACT_APP_SERVER_PORT
const serverAddress = `//localhost:${serverPort}`

const pollutionsSlice = createSlice({
    name: 'pollutions',
    initialState,
    reducers: {
        setPollutionsList: (state, action: { payload: PollutionType[], type: string }) => {
            state.list = action.payload;
        },
        addPollution: (state, action: { payload: PollutionType, type: string }) => {
            state.list = [action.payload, ...state.list]

            fetch(`${serverAddress}/pollutions`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(action.payload),
            }).catch((err) => {
                console.log(err)
            })
        },
    }
})

export const {setPollutionsList, addPollution} = pollutionsSlice.actions
export default pollutionsSlice.reducer
