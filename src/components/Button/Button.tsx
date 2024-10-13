import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import React from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  let buttonClassName = styles.button;

  if (className) {
    buttonClassName = `${buttonClassName} ${className}`;
  }

  return (
    <button {...rest} className={buttonClassName}>
      {children}
    </button>
  );
};

export default Button;
