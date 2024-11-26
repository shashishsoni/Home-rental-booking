import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"

function App() {

  return (
      <div>
        <BrowserRouter>
        <Routes>
          <Route path="/" element= {<HomePage/>}/>
          <Route path="/SignUp" element= {<SignUpPage/>}/>
          <Route path="/Login" element= {<LoginPage/>}/>
        </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
