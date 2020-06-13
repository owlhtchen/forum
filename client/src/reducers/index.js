import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {userReducer} from '../reducers/user';
import {dashboardReducer} from '../reducers/dashboard';

const rootReducer = combineReducers({
    form: formReducer,
    user: userReducer,
    dashboard: dashboardReducer
});

export default rootReducer;