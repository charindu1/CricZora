import { Routes, Route, BrowserRouter } from "react-router-dom"
import './App.css'
import Home from "./pages/Home"
import Form from "./pages/Form"
import Result from "./pages/Result"
import Navbar from "./components/Navbar"
import Predict from "./pages/Predict"
import AppLayout from "./layout/AppLayout"
import Footer from "./components/Footer"
import { AnimatePresence } from "framer-motion"
import About from "./pages/About"
import Model from "./pages/Model"
import Preloader from "./components/Preloader"
import { useState } from "react"

export default function App() {

  // loading state to control preloader visibility
  const [loading, setLoading] = useState(true);

  // track if it's the first mount to control preloader on initial load only
  const [isFirstMount, setIsFirstMount] = useState(true);
  // handler when preloader completes
  const handlePreloaderComplete = () => {
    setLoading(false);
    
    // After the initial animation finishes in 2 seconds later
    // this disable the delay for future navigations.
    setTimeout(() => {
      setIsFirstMount(false);
    }, 2000); 
  };

  return (
    <AppLayout>
      <AnimatePresence mode='wait'>
          {loading && (
              <Preloader key="preloader" onComplete={handlePreloaderComplete} />
          )}
      </AnimatePresence>
  
      {!loading && (
        <>
          <Navbar />
          <Routes>
              {/* Landing page */}
              <Route path="/" element={<Home enableDelay={isFirstMount} />} />

              {/* Predict Page */}
              <Route path="/predict" element={<Predict enableDelay={isFirstMount} />}/>

              {/* Form Page */}
              <Route path="/predict/:formatId" element={<Form />} />

              {/* Result Page */}
              <Route path="/predict/:formatId/result" element={<Result />} />

              {/* About Page */}
              <Route path="/about" element={<About enableDelay={isFirstMount} />}/>

              {/* Model Page */}
              <Route path="/model" element={<Model enableDelay={isFirstMount} />} />
          </Routes>
          <Footer />
        </>
      )}
    </AppLayout>
  )
}
