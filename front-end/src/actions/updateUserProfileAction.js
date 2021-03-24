import axios from 'axios';
import BACKEND_URL from '../config/config'
import cookie from "react-cookies";


const USER_PROFILE_UPDATE_SUCCESS = "user_profile_update_success";
const USER_PROFILE_UPDATE_FAILED = "user_profile_update_failed";
const USER_PROFILE_UPDATE_DEFAULT = "user_profile_update_default"
var success = ( response ) => {
    return {
        type: USER_PROFILE_UPDATE_SUCCESS,
        payload: {
            response: response,
        }
    }
}

var error = ( err ) => {
    console.log( "err", err )
    return {
        type: USER_PROFILE_UPDATE_FAILED,
        payload: {
            response: err
        }
    }
}

var def = () => {
    return {
        type: USER_PROFILE_UPDATE_DEFAULT,
        payload: {
            response: {},
            data: {}
        }
    }
}


var updateUserProfileAction = ( data ) => ( dispatch ) => {
    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;
    console.log("Herererere");
    return axios
        .put( BACKEND_URL + "/users/editprofile", data ).then( response => {
            if ( response.status === 200 ) {

                if ( cookie.load( 'email' ) !== data.email ) {
                    cookie.remove( "email", {
                        path: '/'
                    } );
                    cookie.save( "email", response.data.email, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    } )
                }
                if ( cookie.load( 'name' ) !== data.name ) {
                    cookie.remove( "name", {
                        path: '/'
                    } );
                    cookie.save( "name", response.data.name, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    } )
                }
                if ( cookie.load( 'defaultcurrency' ) !== data.defaultcurrency ) {
                    cookie.remove( "defaultcurrency", {
                        path: '/'
                    } );
                    cookie.save( "defaultcurrency", response.data.defaultcurrency, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    } )
                }
                if ( cookie.load( 'timezone' ) !== data.timezone ) {
                    cookie.remove( "timezone", {
                        path: '/'
                    } );
                    cookie.save( "timezone", response.data.timezone, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    } )
                }


                dispatch( success( response ) )
                window.location.assign( "/profile" );
            }

        } ).catch( err => {
            dispatch( error( err ) )
        } )
}

export default updateUserProfileAction