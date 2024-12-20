import { Routes, Route } from 'react-router-dom'
import Page from './pages/index'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
    </Routes>
  )
}

export default App