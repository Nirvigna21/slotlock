import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const todayStr = () => new Date().toISOString().slice(0, 10);

const ResourceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [bookingSlotId, setBookingSlotId] = useState(null);

  const loadSlots = () => {
    api.get(`/slots/resource/${id}`, { params: { date } }).then((res) => {
      setSlots(res.data);
    });
  };

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleBook = async (slotId) => {
    if (!user) {
      setMessage('Please login to book a slot.');
      return;
    }
    setBookingSlotId(slotId);
    setMessage('');

    setSlots((prev) => prev.map((s) => (s._id === slotId ? { ...s, status: 'held' } : s)));

    const idempotencyKey = `${slotId}-${user.id}-${Date.now()}`;

    try {
      await api.post('/bookings', { slotId, idempotencyKey });
      setMessage('Booking confirmed!');
      loadSlots();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
      loadSlots();
    } finally {
      setBookingSlotId(null);
    }
  };

  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="container">
      <h2>Slots</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      {message && <div className="error">{message}</div>}

      <div className="slot-grid">
        {slots.map((s) => (
          <div key={s._id} className={`slot slot-${s.status}`}>
            <div>{fmtTime(s.startTime)} - {fmtTime(s.endTime)}</div>
            <div>{s.status}</div>
            {s.status === 'open' && (
              <button className="btn" disabled={bookingSlotId === s._id}
                onClick={() => handleBook(s._id)} style={{ marginTop: 6 }}>
                {bookingSlotId === s._id ? 'Booking...' : 'Book'}
              </button>
            )}
          </div>
        ))}
        {slots.length === 0 && <p>No slots generated for this date yet.</p>}
      </div>
    </div>
  );
};

export default ResourceDetail;
