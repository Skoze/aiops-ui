import React from 'react';
import styles from './tag-base.css';
export default function({ label, icon, onClick }) {
  return (
    <div className={styles['wrapper']}>
      <div
        className={styles['tag']}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <span className={styles['label']}>{label}</span>
        <img className={styles['icon']} src={icon} alt=""></img>
      </div>
    </div>
  );
}
