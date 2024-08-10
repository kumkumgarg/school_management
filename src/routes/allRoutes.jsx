import React from 'react'
import { Navigate } from 'react-router-dom'

// Authentication related pages
import Login from '../pages/Authentication/Login'
import Logout from '../pages/Authentication/Logout'
import Register from '../pages/Authentication/Register'

// Inner Authentication
import Login1 from '../pages/AuthenticationInner/Login'
import Register1 from '../pages/AuthenticationInner/Register'
import Recoverpw from '../pages/AuthenticationInner/Recoverpw'
import LockScreen from '../pages/AuthenticationInner/auth-lock-screen'

// Dashboard
import Dashboard from '../pages/Dashboard/index'

//Others
import Pages404 from '../pages/Extra Pages/pages-404'
import Pages500 from '../pages/Extra Pages/pages-500'
import Staff from '../pages/Staff/Staff'
import StaffForm from '../pages/Staff/StaffForm'
import Integrations from '../pages/Integrations/Integrations'
import UserProfile from '../pages/UserSetting/UserProfile'
import ForgetPassword from '../pages/Authentication/ForgetPassword'
import ResetPassword from '../pages/Authentication/ResetPassword'
import UserSecurity from '../pages/UserSetting/UserSecurity'
import UserNotification from '../pages/UserSetting/UserNotification'
import RolesList from '../pages/RolePermissions/RolesList'
import SchoolSetting from '../pages/School/SchoolProfile'
import ClassList from '../pages/Classes/ClassList'

const userRoutes = [
    { path: '/dashboard', component: <Dashboard /> },
    { path: '/staff', component: <Staff /> },
    { path: '/integrations', component: <Integrations /> },
    { path: '/profile', component: <UserProfile /> },
    { path: '/setting/security', component: <UserSecurity /> },
    { path: '/setting/notification', component: <UserNotification /> },
    { path: '/setting/role-permission', component: <RolesList /> },
    { path: '/classes', component: <ClassList /> },
    { path: '/school-profile', component: <SchoolSetting /> },

    // this route should be at the end of all other routes
    {
        path: '/',
        exact: true,
        component: <Navigate to="/dashboard" />,
    },
]

const authRoutes = [
    { path: '/logout', component: <Logout /> },
    { path: '/login', component: <Login /> },
    { path: '/forgot-password', component: <ForgetPassword /> },
    { path: '/reset-password', component: <ResetPassword /> },
    { path: '/register', component: <Register /> },

    { path: '/pages-404', component: <Pages404 /> },
    { path: '/pages-500', component: <Pages500 /> },

    // Authentication Inner
    { path: '/pages-login', component: <Login1 /> },
    { path: '/pages-register', component: <Register1 /> },
    { path: '/page-recoverpw', component: <Recoverpw /> },
    { path: '/auth-lock-screen', component: <LockScreen /> },
]

export { userRoutes, authRoutes }
