import React, { useState,useEffect} from 'react';

import '@/styles/app.css';
import jessie from '@/assets/jessie.jpg';
function app() {
    const [name, setName] = useState('geijin');
    const handleClick = () => {
        setName(name === 'geijin'?'瑶王': 'pt')
    };
    return (
          <div>
              <h1 onClick={handleClick}>{name}</h1>
              <img src={jessie} alt="jessie"/>
          </div>
    );
}

export default app;
