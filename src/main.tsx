import React from 'react';import{createRoot}from'react-dom/client';import'./styles.css';import{App}from'./App';import{ensureAnonymousAuth,firebaseEnabled}from'./services/firebase';

async function bootstrap(){
  if(firebaseEnabled){
    try{await ensureAnonymousAuth();}
    catch(error){console.error('Anonymous Firebase authentication failed',error);}
  }
  createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
}

void bootstrap();

if('serviceWorker'in navigator){
  window.addEventListener('load',()=>{
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(error=>{
      console.warn('Service worker registration failed',error);
    });
  });
}
