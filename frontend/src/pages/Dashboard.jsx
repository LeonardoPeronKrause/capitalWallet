import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [transacoes, setTransacoes] = useState([]);

  useEffect(() => {
    const buscarTransacoes = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/transacoes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransacoes(res.data);
    };

    buscarTransacoes();
  }, []);
  
  const total = transacoes.reduce((acc, t) => acc + parseFloat(t.valor), 0);
  const totalEntrada = transacoes
    .filter(t => t.tipo === 'entrada')
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);
  const totalSaida = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((acc, t) => acc + parseFloat(t.valor), 0);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Balance</h3>
          <p className="total">R$ {total.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Income</h3>
          <p className="entrada">R$ {totalEntrada.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Expenses</h3>
          <p className="saida">R$ {totalSaida.toFixed(2)}</p>
        </div>
      </div>

      <div className="transacoes">
        <h2>Recent Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Payee</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.slice(-5).reverse().map((t, i) => (
              <tr key={i}>
                <td>{t.descricao}</td>
                <td className={t.tipo === 'entrada' ? 'entrada' : 'saida'}>
                  {t.tipo === 'entrada' ? '+' : '-'} R$ {Math.abs(t.valor).toFixed(2)}
                </td>
                <td>{new Date(t.data).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
