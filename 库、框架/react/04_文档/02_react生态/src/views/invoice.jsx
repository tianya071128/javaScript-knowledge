import { useParams, useNavigate } from 'react-router-dom';

import { getInvoice, deleteInvoice } from '../assets/data';

export default function Invoice() {
  const params = useParams();
  const navigate = useNavigate();
  let invoice = getInvoice(parseInt(params.invoiceId, 10));

  return (
    <main style={{ padding: '1rem' }}>
      <h2>Total Due: {invoice.amount}</h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>
      <button
        onClick={() => {
          deleteInvoice(invoice.number);
          navigate('/invoices');
        }}>
        Delete
      </button>
    </main>
  );
}
