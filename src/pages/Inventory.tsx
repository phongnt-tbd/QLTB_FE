
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/assets', { replace: true });
  }, []);
  return null;
};

export default Inventory;
