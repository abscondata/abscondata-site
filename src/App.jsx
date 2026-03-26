import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Abscondata from './Abscondata'
import IntakeForm from './IntakeForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Abscondata />} />
        <Route path="/intake" element={<IntakeForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
