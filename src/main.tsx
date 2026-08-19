import React from 'react';import{createRoot}from'react-dom/client';import'./styles.css';import{App}from'./App';import{ensureAnonymousAuth,firebaseEnabled}from'./services/firebase';

async function bootstrap(){
  if(firebaseEnabled){
    try{await ensureAnonymousAuth();}
    catch(error){console.error('Anonymous Firebase authentication failed',error);}
  }
  createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
}

void bootstrap();
