import React, { useState,useEffect} from 'react';
import(/* webpackPreload: true */ 'lodash');

import '@/styles/app.css';
import jessie from '@/assets/jessie.jpg';
import yao from '@/assets/yao.jpeg'

function app() {
    const [name, setName] = useState('geijin');
    const handleClick = () => {
        // setName(name === 'geijin'?'瑶王': 'pt')
        import('lodash').then(({default: lol})=>{
           const word =  lol.join(['麦克雷', '瑶妹 '])
            setName(word);
        })

    };
    return (
          <div>
              <h1 onClick={handleClick}>{name}</h1>
              <img src={jessie} alt="jessie"/>
              <img src={yao} alt="adsf"/>

          </div>
    );
}

export default app;
