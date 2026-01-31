import { Navigate } from "react-router-dom";

export default function RedirectToCollections() {
    return <Navigate to="/collections" replace />;
}
