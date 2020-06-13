import {combineReducers} from 'redux';
import {userReducer} from './user';
import {dashboardReducer} from './dashboard';

const rootReducer = combineReducers({
    user: userReducer,
    dashboard: dashboardReducer
});

export default rootReducer;