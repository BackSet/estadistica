import './App.css'
import { Route, Routes } from 'react-router-dom'
import { ExercisePage } from './pages/ExercisePage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ejercicio/:id" element={<ExercisePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
