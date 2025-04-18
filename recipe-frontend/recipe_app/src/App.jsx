import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLayoutEffect, useState, useMemo } from 'react';
import { useAuth } from "../api/useAuth";
import ProtectedRoute from './components/ProtectedRoute';
import LoginSignup from './pages/LoginSignup';
import Home from './pages/Home';
import ByCat from './pages/ByCat';
import ByIngredient from './pages/ByIngredient';
import ByCuisine from './pages/ByCuisine';
import RecipePage from './pages/RecipePage';
import SavedRecipes from './pages/SavedRecipes';
import NavBar from './components/NavBar';
import ShoppingList from './pages/ShoppingList';
import { ToastContainer } from "react-toastify";
import Profile from './pages/Profile';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme as customTheme } from './theme/theme';
import SearchResults from './components/SearchResults';

function App() {

  // vite_url used if set else it uses api
  // UNCOMMENT BELOW WHEN READY TO RUN AS FULL-STACK CONTAINER
  const base_url = import.meta.env.VITE_BASE_URL || "/api/v1"
  //const base_url = "http://127.0.0.1:8000/api/v1"  //COMMENT OUT WHEN DONE RUNNING SEPERATELY
  console.log('In_APP')
  console.log(`base_url = [${base_url}]`)

  // adding useAuth and useLayoutEffect
  const { isAuthenticated } = useAuth();

  useLayoutEffect(() => {
  }, [isAuthenticated]);

  const [mode, setMode] = useState('light');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        ...customTheme,
        palette: {
          ...customTheme.palette,
          mode,
          primary: {
            main: mode === 'light' ? customTheme.palette.primary.main : '#2E7D32',
          },
          secondary: {
            main: mode === 'light' ? customTheme.palette.secondary.main : '#1B5E20',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333' : '#d3d3d3',
            secondary: mode === 'light' ? '#333333' : '#aaaaaa',
        },
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {isAuthenticated && <NavBar toggleColorMode={colorMode.toggleColorMode} mode={mode} />}
        <Routes>
          <Route path="/auth" element={!isAuthenticated ? <LoginSignup base_url={base_url}/> : <Navigate to="/" replace/>} />
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route element={<ProtectedRoute/>}>
            <Route path="/bycat" element={<ByCat />} />
            <Route path="/byingredient" element={<ByIngredient />} />
            <Route path="/bycuisine" element={<ByCuisine />} />
            <Route path="/recipe/:idMeal" element={<RecipePage base_url={base_url}/>} />
            <Route path="/saved" element={<SavedRecipes base_url={base_url}/>} />
            <Route path="/shoplist" element={<ShoppingList base_url={base_url}/>} />
            <Route path="/profile" element={<Profile base_url={base_url}/>} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Routes>

        <ToastContainer 
          position="top-right"
          autoClose={1000} // Adjust autoClose time
          hideProgressBar={true}
          theme={mode} // This will automatically adjust toast theme
          toastStyle={{ 
            backgroundColor: mode === 'light' ? "#FFDE6D" : "#424242",
            color: mode === 'light' ? "#05324D" : "#ffffff"
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

