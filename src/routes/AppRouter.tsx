import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import EncuestaForm from "../pages/Encuesta"

const AppRouter: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/oleoturismo/encuesta/:almazara" element={<EncuestaForm />} />
                    <Route path="*" element={<main className="container"><p>Ruta inválida</p></main>} />
                </Routes>
            </Router>
        </>
    )
}

export default AppRouter