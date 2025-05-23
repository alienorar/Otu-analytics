import React, { useState } from 'react';
import axios from 'axios';

const ApiComponent = () => {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const requestData = {
                utm_url: "https://qabul.asianuniversity.uz/?utm_source=919330011",
                page: 1,
                limit: 5
            };

            const response = await axios.post(
                'https://bitrix-mini.asianuniversity.uz/api/contacts',
                requestData
            );

            setResponseData(response.data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>API So'rov Komponenti</h2>

            <button onClick={fetchData} disabled={loading}>
                {loading ? 'Yuklanmoqda...' : 'Ma\'lumotlarni Olish'}
            </button>

            {error && <div style={{ color: 'red' }}>Xato: {error}</div>}

            {responseData && (
                <div>
                    <h3>Javob:</h3>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default ApiComponent;