import { useEffect, useState } from 'react';
import api from '../api/axios';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', location: '', capacity: 1, slotDurationMins: 60 });
  const [genForm, setGenForm] = useState({ resourceId: '', date: '', startHour: 9, endHour: 17 });
  const [message, setMessage] = useState('');

  const loadResources = () => {
    api.get('/resources').then((res) => setResources(res.data));
  };

  useEffect(() => { loadResources(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/resources', form);
      setMessage('Resource created.');
      setForm({ name: '', category: '', location: '', capacity: 1, slotDurationMins: 60 });
      loadResources();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create resource');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/slots/generate', genForm);
      setMessage(`Generated ${res.data.created} slot(s).`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to generate slots');
    }
  };

  return (
    <div className="container">
      <h2>Manage Resources</h2>
      {message && <div className="error">{message}</div>}

      <div className="card">
        <h3>Create Resource</h3>
        <form onSubmit={handleCreate}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          <input type="number" placeholder="Slot duration (mins)" value={form.slotDurationMins} onChange={(e) => setForm({ ...form, slotDurationMins: Number(e.target.value) })} required />
          <button className="btn" type="submit">Create Resource</button>
        </form>
      </div>

      <div className="card">
        <h3>Generate Slots</h3>
        <form onSubmit={handleGenerate}>
          <select value={genForm.resourceId} onChange={(e) => setGenForm({ ...genForm, resourceId: e.target.value })} required>
            <option value="">Select resource</option>
            {resources.map((r) => (<option key={r._id} value={r._id}>{r.name}</option>))}
          </select>
          <input type="date" value={genForm.date} onChange={(e) => setGenForm({ ...genForm, date: e.target.value })} required />
          <input type="number" placeholder="Start hour (0-23)" value={genForm.startHour} onChange={(e) => setGenForm({ ...genForm, startHour: Number(e.target.value) })} />
          <input type="number" placeholder="End hour (0-23)" value={genForm.endHour} onChange={(e) => setGenForm({ ...genForm, endHour: Number(e.target.value) })} />
          <button className="btn" type="submit">Generate Slots</button>
        </form>
      </div>

      <div className="card">
        <h3>Your Resources</h3>
        {resources.map((r) => (<div key={r._id}>{r.name} — {r.category}</div>))}
      </div>
    </div>
  );
};

export default ManageResources;
