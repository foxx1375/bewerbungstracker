import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Card, Form, Row, Col } from 'react-bootstrap';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    axios
      .get('http://localhost:3001/applications')
      .then((response) => {
        setApplications(response.data.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Fehler: {error}</div>;
  }

  const handleDelete = (id) => {
    if (window.confirm("Sind Sie sicher, dass Sie diese Bewerbung löschen möchten?")) {
      axios
        .delete(`http://localhost:3001/applications/${id}`)
        .then((response) => {
          alert('Bewerbung erfolgreich gelöscht!');
          setApplications(applications.filter((app) => app.id !== id));
        })
        .catch((error) => {
          alert('Fehler beim Löschen: ' + error.message);
        });
    }
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  return (
    <div className="my-4">
      <h2>Bewerbungsliste</h2>
      <Card className="shadow-lg">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={() => {
                      if (selected.size === applications.length) {
                        setSelected(new Set());
                      } else {
                        setSelected(new Set(applications.map(app => app.id)));
                      }
                    }}
                    checked={selected.size === applications.length}
                  />
                </th>
                <th>Firma</th>
                <th>Position</th>
                <th>Status</th>
                <th>Anschreiben</th>
                <th>Stellenausschreibung</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className={selected.has(app.id) ? 'table-success' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selected.has(app.id)}
                      onChange={() => toggleSelection(app.id)}
                    />
                  </td>
                  <td>{app.company}</td>
                  <td>{app.position}</td>
                  <td>{app.status}</td>
                  <td>
                    {app.cover_letter_path ? (
                      <a
                        href={`http://localhost:3001/uploads/${app.cover_letter_path.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Anschreiben herunterladen
                      </a>
                    ) : (
                      'Kein Anschreiben'
                    )}
                  </td>
                  <td>
                    {app.job_posting_path ? (
                      <a
                        href={`http://localhost:3001/uploads/${app.job_posting_path.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Stellenausschreibung herunterladen
                      </a>
                    ) : (
                      'Keine Stellenausschreibung'
                    )}
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(app.id)}>Löschen</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="mt-3">
            <Col>
              <Button
                variant="danger"
                disabled={selected.size === 0}
                onClick={() => {
                  if (window.confirm("Sind Sie sicher, dass Sie alle ausgewählten Bewerbungen löschen möchten?")) {
                    selected.forEach((id) => handleDelete(id));
                  }
                }}
              >
                Ausgewählte Bewerbungen löschen
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ApplicationList;