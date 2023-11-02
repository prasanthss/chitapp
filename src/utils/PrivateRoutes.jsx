import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
    let auth = { token: sessionStorage.getItem('userInfo') }
    return (
        auth.token ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoutes