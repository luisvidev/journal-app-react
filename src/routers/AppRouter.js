import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect
  } from "react-router-dom";
import { firebase } from '../firebase/firebaseConfig'
import { JournalPage } from '../components/journal/JournalPage';
import { AuthRouter } from './AuthRouter';
import { useDispatch } from 'react-redux';
import { login } from '../actions/auth';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

import {  startLoadingNotes } from '../actions/notes';

export const AppRouter = () => {

    const dispatch = useDispatch();

    const [checking, setChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      firebase.auth().onAuthStateChanged( async (user)=>{
        if(user?.uid){
            dispatch(login(user.uid, user.displayName));
            setIsLoggedIn(true);
            
            dispatch(startLoadingNotes(user.uid));
        } else {
            setIsLoggedIn(false);
        }
        setChecking(false);
      });
        
    }, [dispatch, setChecking]);

    if(checking){
        return (
            <h1>Wait a moment</h1>
        );
    }

    return (
        <Router>
            <div>
                <Switch>
                    <PublicRoute 
                        path="/auth" 
                        component={AuthRouter} 
                        isAuthenticated={isLoggedIn}   
                    />
                    <PrivateRoute 
                        exact 
                        path="/" 
                        component={JournalPage} 
                        isAuthenticated={isLoggedIn}
                    />
                    <Redirect to="/auth/login" />
                </Switch>
            </div>
        </Router>
    )
}
