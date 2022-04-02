import React from 'react';
import { Container } from 'react-bootstrap';

export default function AppContent({ children }) {
  return (
    <div className="content-wrapper">
      <Container>
        {children}
      </Container>
    </div>
  )
}
