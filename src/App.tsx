import React, { useState } from 'react';
import axios from 'axios';

const ApiRequestTable = () => {
  const [baseUrl, setBaseUrl] = useState('https://qabul.asianuniversity.uz');
  const [utmSource, setUtmSource] = useState('919330011');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Proxy orqali so'rov yuborish (CORS muammosini hal qilish uchun)
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = 'https://bitrix-mini.asianuniversity.uz/api/contacts';

      const response = await axios.post(proxyUrl + targetUrl, {
        utm_url: `${baseUrl}?utm_source=${utmSource}`,
        page: page,
        limit: limit
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      setResponseData(response.data);
    } catch (err) {
      setError(err.message || 'So\'rov amalga oshirilmadi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>API So'rov Tizimi</h2>

      <form onSubmit={handleSubmit} style={{
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label htmlFor="baseUrl" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Asosiy URL:</label>
            <input
              id="baseUrl"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="utmSource" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>UTM Source:</label>
            <input
              id="utmSource"
              type="text"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="UTM source kodi"
              required
            />
          </div>

          <div>
            <label htmlFor="page" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Sahifa:</label>
            <input
              id="page"
              type="number"
              min="1"
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div>
            <label htmlFor="limit" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Limit:</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
          disabled={loading}
        >
          {loading ? 'Yuklanmoqda...' : 'Ma\'lumotlarni Olish'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          borderLeft: '4px solid #f44336',
          color: '#d32f2f'
        }}>
          Xato: {error}
        </div>
      )}

      {responseData.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                {Object.keys(responseData[0]).map((key) => (
                  <th key={key} style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd'
                  }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responseData.map((item, index) => (
                <tr key={index} style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                  borderBottom: '1px solid #ddd'
                }}>
                  {Object.values(item).map((value, i) => (
                    <td key={i} style={{
                      padding: '12px 15px',
                      borderBottom: '1px solid #eee'
                    }}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => {
                setPage(prev => Math.max(1, prev - 1));
                fetchData();
              }}
              disabled={page === 1 || loading}
              style={{
                padding: '8px 16px',
                backgroundColor: page === 1 ? '#cccccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Oldingi
            </button>

            <span>Sahifa: {page}</span>

            <button
              onClick={() => {
                setPage(prev => prev + 1);
                fetchData();
              }}
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Keyingi
            </button>
          </div>
        </div>
      ) : (
        !loading && !error && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            color: '#666'
          }}>
            Ma'lumotlar mavjud emas. So'rov yuboring.
          </div>
        )
      )}
    </div>
  );
};

export default ApiRequestTable;