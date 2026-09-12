import { Routes, Route } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import LandingPage from './pages/LandingPage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryToolsPage from './pages/CategoryToolsPage'
import AllToolsPage from './pages/AllToolsPage'
import ToolPage from './pages/ToolPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:categorySlug" element={<CategoryToolsPage />} />
        <Route path="/tools" element={<AllToolsPage />} />
        <Route path="/tools/:toolSlug" element={<ToolPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
