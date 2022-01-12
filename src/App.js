import logo from './logo.svg';
import './App.css';
import SignUp from './signup';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react'

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  if(signedIn){
    return(
      <div style={{height: "100%",
  overflow: "auto"}}>
    <div className='menu'>
    <Button style={{color:'white'}} startIcon={<LogoutIcon/>} onClick={() => setSignedIn(false)}>Sign Out</Button>
    <Button  style={{color:'white'}} startIcon={<AccountCircleIcon/>}>{userName}</Button>
    </div>
    <div className='welcome'>Welcome to techwondoe</div>
  </div>
    )
   

  }
  else{
    return(
      <div style={{display:'flex',height: "100%",
      overflow: "auto"}}><SignUp logged={setSignedIn} userName={setUserName}/></div>
     )
    

  }
}

export default App;

