import React from 'react';
import "../assets/styles/Button.css";

interface ButtonText {
    text: string,
    onClick: Function,
}

export const Button: React.FC<ButtonText> = ({ text, onClick }) => {
    return(
        <button className='button'>{text}</button>
    )
}