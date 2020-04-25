import React from 'react';
import DurationPicker from '../DurationPicker';
import styles from './index.css';

const Footer = props => {
  return (
    <footer className={styles['footer']}>
      <DurationPicker {...props} />
    </footer>
  );
};

export default Footer;
