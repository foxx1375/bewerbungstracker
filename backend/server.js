const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // fs für Dateilöschung im Dateisystem

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite-Datenbank-Setup
const db = new sqlite3.Database('./bewerbungstracker.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');

    // Tabelle initialisieren, falls sie nicht existiert
    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        status TEXT NOT NULL,
        contact_person TEXT,
        email TEXT,
        phone TEXT,
        date_applied DATE,
        notes TEXT,
        cover_letter_path TEXT,
        job_posting_path TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table `applications` is ready.');
      }
    });
  }
});

// Multer Storage-Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Dateien im Ordner "uploads" speichern
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Zeitstempel + Originalname
  }
});

// Upload-Middleware konfigurieren
const upload = multer({ storage: storage });

// POST-Endpunkt für das Hinzufügen einer Bewerbung (mit oder ohne Dateien)
app.post('/applications', upload.fields([
  { name: 'coverLetter', maxCount: 1 }, // Anschreiben hochladen
  { name: 'jobPosting', maxCount: 1 }   // Stellenausschreibung hochladen
]), (req, res) => {
  const { company, position, status, contact_person, email, phone, date_applied, notes } = req.body;
  
  // Dateipfade der hochgeladenen Dateien
  const coverLetterPath = req.files['coverLetter'] ? req.files['coverLetter'][0].path : null;
  const jobPostingPath = req.files['jobPosting'] ? req.files['jobPosting'][0].path : null;

  // SQL-Abfrage ausführen, um die Bewerbung zu speichern
  const query = `
    INSERT INTO applications (company, position, status, contact_person, email, phone, date_applied, notes, cover_letter_path, job_posting_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    company, position, status, contact_person, email, phone, date_applied, notes, coverLetterPath, jobPostingPath
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Database Error:', err.message); // Fehler aus der Datenbank loggen
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Bewerbung erfolgreich hinzugefügt', id: this.lastID });
  });
});

// Endpunkt: Datei herunterladen
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename; // Dateiname aus der URL
  const filePath = path.join(__dirname, 'uploads', filename);

  // Überprüfen, ob die Datei existiert
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err.message);
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// GET: Alle Bewerbungen abrufen (ohne Paginierung)
app.get('/applications', (req, res) => {
  const { status, sort } = req.query;
  let query = 'SELECT * FROM applications';
  const params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  if (sort) {
    query += ` ORDER BY ${sort}`;
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        data: rows,
      });
    }
  });
});


// DELETE: Bewerbung löschen
app.delete('/applications/:id', (req, res) => {
  const { id } = req.params;  // Die ID wird aus der URL entnommen
  const query = `DELETE FROM applications WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Wenn keine Zeilen geändert wurden, bedeutet das, dass keine Bewerbung mit dieser ID existiert
    if (this.changes === 0) {
      return res.status(404).json({ error: 'No application found with the given ID or it has already been deleted.' });
    }

    // Löschen der zugehörigen Dateien, falls sie existieren
    const getFileQuery = 'SELECT * FROM applications WHERE id = ?';
    
    db.get(getFileQuery, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row) {
        // Löschen der Dateien
        if (row.cover_letter_path) {
          fs.unlinkSync(row.cover_letter_path); // Löschen des Anschreibens
        }
        if (row.job_posting_path) {
          fs.unlinkSync(row.job_posting_path); // Löschen des Screenshots der Stellenausschreibung
        }
      }

      // Rückmeldung nach erfolgreichem Löschen der Bewerbung und der zugehörigen Dateien
      res.status(200).json({ message: 'Application and related files successfully deleted' });
    });
  });
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});