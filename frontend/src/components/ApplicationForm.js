import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const ApplicationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: '',
    contact_person: '',
    email: '',
    phone: '',
    date_applied: '',
    notes: '',
  });

  const [coverLetter, setCoverLetter] = useState(null);
  const [jobPosting, setJobPosting] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('company', formData.company);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('contact_person', formData.contact_person);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('date_applied', formData.date_applied);
    formDataToSend.append('notes', formData.notes);

    if (coverLetter) formDataToSend.append('coverLetter', coverLetter);
    if (jobPosting) formDataToSend.append('jobPosting', jobPosting);

    // Sende den POST-Request an den Backend-Endpunkt
    axios
      .post('http://localhost:3001/applications', formDataToSend)
      .then((response) => {
        alert('Bewerbung erfolgreich hinzugefügt!');
        onSuccess(); // Hier wird der onSuccess-Callback aufgerufen, um die Liste zu aktualisieren
        setFormData({
          company: '',
          position: '',
          status: '',
          contact_person: '',
          email: '',
          phone: '',
          date_applied: '',
          notes: '',
        });
        setCoverLetter(null);
        setJobPosting(null);
      })
      .catch((error) => {
        alert('Fehler beim Hochladen: ' + error.message);
      });
  };

  return (
    <div className="my-4">
      <h2>Neue Bewerbung hinzufügen</h2>
      <Card className="shadow-lg">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="company">
              <Form.Label>Firma</Form.Label>
              <Form.Control
                type="text"
                placeholder="Firma eingeben"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="position">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                placeholder="Position eingeben"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="">Bitte wählen...</option>
                <option value="offen">Offen</option>
                <option value="interview">Interview</option>
                <option value="abgelehnt">Abgelehnt</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="contact_person">
              <Form.Label>Kontaktperson</Form.Label>
              <Form.Control
                type="text"
                placeholder="Kontaktperson eingeben"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email eingeben"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Telefonnummer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Telefonnummer eingeben"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="date_applied">
              <Form.Label>Datum der Bewerbung</Form.Label>
              <Form.Control
                type="date"
                value={formData.date_applied}
                onChange={(e) => setFormData({ ...formData, date_applied: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="notes">
              <Form.Label>Notizen</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="coverLetter">
              <Form.Label>Anschreiben</Form.Label>
              <Form.Control
                type="file"
                accept="application/pdf"
                onChange={(e) => setCoverLetter(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="jobPosting">
              <Form.Label>Stellenausschreibung</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setJobPosting(e.target.files[0])}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Bewerbung speichern
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ApplicationForm;