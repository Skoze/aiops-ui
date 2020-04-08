import React from 'react';
import { Redirect } from 'react-router';

export default function(): JSX.Element {
  return (
    <Redirect to="/dashboard" />
  );
}
