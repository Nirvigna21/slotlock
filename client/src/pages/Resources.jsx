import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources').then((res) => {
      setResources(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h2>Loading resources...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{
        marginBottom: 40,
        padding: '42px',
        borderRadius: 22,
        background: 'linear-gradient(135deg, #0f172a, #312e81)',
        color: 'white',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)'
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#a5b4fc',
          marginBottom: 12
        }}>
          Smart Resource Booking
        </div>

        <h1 style={{
          margin: '0 0 14px',
          fontSize: 'clamp(32px, 5vw, 52px)',
          lineHeight: 1.05,
          letterSpacing: '-2px',
          color: 'white'
        }}>
          Book your time.
          <br />
          Without the double-booking.
        </h1>

        <p style={{
          margin: 0,
          maxWidth: 600,
          color: '#cbd5e1',
          fontSize: 16,
          lineHeight: 1.7
        }}>
          Find available resources, choose a time slot, and book instantly
          with SlotLock's concurrency-safe booking system.
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22
      }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>Available Resources</h2>
          <p style={{ margin: 0, color: '#64748b' }}>
            Choose a resource and find your perfect time.
          </p>
        </div>

        <div style={{
          padding: '8px 14px',
          borderRadius: 999,
          background: '#eef2ff',
          color: '#4338ca',
          fontSize: 13,
          fontWeight: 700
        }}>
          {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
        </div>
      </div>

      {resources.length === 0 && (
        <div className="card">
          <h3>No resources available</h3>
          <p>Resources will appear here once an owner creates them.</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 20
      }}>
        {resources.map((r) => (
          <div
            className="card"
            key={r._id}
            style={{ marginBottom: 0 }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 22
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#eef2ff',
                fontSize: 25
              }}>
                {r.category?.toLowerCase().includes('sport') ? '⚽' : '📍'}
              </div>

              <span style={{
                padding: '6px 10px',
                borderRadius: 999,
                background: '#dcfce7',
                color: '#15803d',
                fontSize: 12,
                fontWeight: 700
              }}>
                Available
              </span>
            </div>

            <h3>{r.name}</h3>

            <p style={{
              fontSize: 14,
              color: '#64748b',
              marginBottom: 18
            }}>
              {r.category} • {r.location}
            </p>

            <div style={{
              display: 'flex',
              gap: 10,
              marginBottom: 22
            }}>
              <div style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                background: '#f8fafc'
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#94a3b8',
                  marginBottom: 4
                }}>
                  SLOT LENGTH
                </div>

                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#334155'
                }}>
                  {r.slotDurationMins} mins
                </div>
              </div>

              <div style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                background: '#f8fafc'
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#94a3b8',
                  marginBottom: 4
                }}>
                  LOCATION
                </div>

                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#334155'
                }}>
                  {r.location || 'Online'}
                </div>
              </div>
            </div>

            <Link
              className="btn"
              to={`/resources/${r._id}`}
              style={{ width: '100%' }}
            >
              View Available Slots →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;