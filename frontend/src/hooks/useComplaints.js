import { useState, useEffect } from 'react';
import { getComplaints } from '../api';

export default function useComplaints() {
  const [complaints, setComplaints] = useState([]);

  const fetchData = async () => {
    const data = await getComplaints();
    setComplaints(data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  return { complaints, setComplaints };
}