import { useEffect, useState } from 'react';
import api from '../api/axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    api.get('/bookings/me').then((res) => setBookings(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    setMessage('');

    try {
      await api.delete(`/bookings/${id}`);
      setMessage('Booking cancelled successfully.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 35 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: '#6366f1',
          marginBottom: 8
        }}>
          Your Reservations
        </div>

        <h2 style={{ marginBottom: 8 }}>My Bookings</h2>

        <p style={{ margin: 0, color: '#64748b' }}>
          View and manage your upcoming reservations.
        </p>
      </div>

      {message && (
        <div className="error">
          {message}
        </div>
      )}

      {bookings.length === 0 && (
        <div className="card" style={{
          textAlign: 'center',
          padding: 50
        }}>
          <div style={{ fontSize: 42, marginBottom: 15 }}>📅</div>

          <h3>No bookings yet</h3>

          <p>
            Your confirmed reservations will appear here.
          </p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20
      }}>
        {bookings.map((b) => {
          const slot = b.slotId;
          const resource = b.resourceId;

          return (
            <div
              className="card"
              key={b._id}
              style={{ marginBottom: 0 }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 22
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  📅
                </div>

                <span style={{
                  padding: '6px 11px',
                  borderRadius: 999,
                  background: b.status === 'confirmed'
                    ? '#dcfce7'
                    : '#fee2e2',
                  color: b.status === 'confirmed'
                    ? '#15803d'
                    : '#b91c1c',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'capitalize'
                }}>
                  {b.status}
                </span>
              </div>

              <h3>
                {resource?.name || 'Reserved Resource'}
              </h3>

              <p style={{
                marginBottom: 20
              }}>
                {resource?.category || 'Resource'} •{' '}
                {resource?.location || 'Location unavailable'}
              </p>

              <div style={{
                padding: 16,
                borderRadius: 12,
                background: '#f8fafc',
                marginBottom: 18
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#94a3b8',
                  fontWeight: 700,
                  marginBottom: 6
                }}>
                  BOOKING TIME
                </div>

                <div style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#334155'
                }}>
                  {slot
                    ? new Date(slot.startTime).toLocaleString()
                    : 'N/A'}
                </div>
              </div>

              <div style={{
                fontSize: 12,
                color: '#94a3b8',
                marginBottom: 18
              }}>
                Booking ID: {b._id}
              </div>

              {b.status === 'confirmed' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancel(b._id)}
                  style={{ width: '100%' }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;