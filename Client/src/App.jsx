import {Routes, Route, BrowserRouter} from 'react-router-dom'
import './App.css'
import Index from './pages/Index'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Index />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
