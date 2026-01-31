# RFID Attendance System (React + PHP + MySQL)

A web-based RFID attendance system built with **React (frontend)** and **PHP (backend API)** connected to **MySQL**.  
It supports RFID scan attendance (auto time-in/time-out), student management, schedules, and Excel export.

---

## Tech Stack
- **Frontend:** React, TailwindCSS, Axios, XLSX (Excel export)
- **Backend:** PHP (`rfidapi.php`)
- **Database:** MySQL
- **Optional:** Semaphore SMS notifications

---

## Features
### ✅ Attendance
- RFID scan → **auto Time In / Time Out**
- Cooldown protection to prevent repeated taps
- Attendance list view with time in/out

### ✅ Students
- Add Student (with RFID)
- Edit Student (with searchable student list table)
- Update parent contact info

### ✅ Schedules
- Add schedule per student (`student_id`, `subject`, `time`)
- View schedules list via API

### ✅ Export
- Export attendance to **Excel (.xlsx)** via XLSX

---

## Project Structure

### Frontend

src/
components/
Dashboard.jsx
Partials/
Api.js
Header.jsx
RFIDScanner.jsx
QuickActions.jsx
AttendanceRecords.jsx
AddStudentModal.jsx
EditStudentModal.jsx
AddScheduleModal.jsx


### Backend

public_html/
rfidapi.php
.htaccess


---

## Local Setup (Frontend)

### 1) Install
```bash
npm install

2) Configure Axios baseURL

Edit your Axios instance:

src/components/Partials/Api.js

import axios from "axios";

export const api = axios.create({
  baseURL: "https://attendance.ehub.ph", // change if local
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

3) Run

npm start

Backend Setup (PHP API)
1) Upload rfidapi.php

Upload to:

public_html/rfidapi.php (root), OR

public_html/attendance/rfidapi.php (subfolder)

2) Configure database credentials

Inside rfidapi.php, set:

$db_host, $db_name, $db_user, $db_pass

3) Database tables

Your API expects these tables and columns:

students

id (PK)

name

address

class

section

rfid

parent_name

parent_contact

created_at

attendance

id (PK)

student_id (FK → students.id)

time_in

time_out (nullable)

status

schedules

id (PK)

student_id (FK)

subject

time

created_at

API Endpoints

Base format:

/rfidapi.php?path=...

Students
Method	Endpoint	Description
GET	/rfidapi.php?path=students	List students
GET	/rfidapi.php?path=students&rfid=XXXX	Get one student by RFID (if enabled in PHP)
POST	/rfidapi.php?path=students	Add student
PUT	/rfidapi.php?path=students&id=123	Update student (requires id in query)
DELETE	/rfidapi.php?path=students&id=123	Delete student

POST required fields:

name

rfid

class

Attendance
Method	Endpoint	Description
GET	/rfidapi.php?path=attendance	List attendance
GET	`/rfidapi.php?path=attendance&filter=today	week
POST	/rfidapi.php?path=attendance	Smart time in/out using RFID in student_id
PUT	/rfidapi.php?path=attendance	Update time_out (by attendance record id)
DELETE	/rfidapi.php?path=attendance&id=123	Delete attendance record

POST body example:

{ "student_id": "RFID_TAG_VALUE" }

PUT body example (JSON):

{ "id": 10, "time_out": "2026-01-31 12:30:00" }


Note: If your PHP uses parse_str() for PUT, the frontend must send x-www-form-urlencoded.
If your PHP is updated to json_decode() for PUT, JSON works.

Schedules
Method	Endpoint	Description
GET	/rfidapi.php?path=schedules	List schedules
POST	/rfidapi.php?path=schedules	Add schedule
DELETE	/rfidapi.php?path=schedules&id=123	Delete schedule

POST required fields:

student_id (students.id)

subject

time

Frontend ↔ Backend Field Mapping

Your React forms may use PascalCase, but PHP expects snake_case for DB columns.

React Form Key	PHP Key
Address	address
Section	section
ParentName	parent_name
ParentContact	parent_contact
class	class
rfid	rfid

✅ Example payload to PHP:

const payload = {
  name: form.name,
  rfid: form.rfid,
  class: form.class,
  address: form.Address,
  section: form.Section,
  parent_name: form.ParentName,
  parent_contact: form.ParentContact,
};

Deployment on cPanel (Fix /admin 404)

If your React app uses routes like /admin, cPanel will show 404 unless Apache rewrites requests to index.html.

✅ Add .htaccess (SPA Rewrite)

Place .htaccess in the folder where your React index.html is deployed.

If deployed at domain root (https://attendance.ehub.ph/):
public_html/.htaccess

RewriteEngine On

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule ^ index.html [L]


If deployed in a subfolder (https://attendance.ehub.ph/app/):
public_html/app/.htaccess

RewriteEngine On
RewriteBase /app/

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule ^ index.html [L]

Build & Upload
npm run build


Upload the build output folder contents to your cPanel directory.

Troubleshooting
✅ 400 Bad Request (Students POST)

Your PHP requires: name, rfid, class.
Make sure you send class and map keys properly.

✅ 400 Bad Request (Students PUT)

Your PHP requires id in query:

PUT /rfidapi.php?path=students&id=123

✅ /admin 404 on cPanel

Add .htaccess SPA rewrite (above).
Avoid forcing page reloads with window.location.href="/admin" if using React Router.

Security Notes

Do NOT commit real DB credentials or Semaphore API keys.

Store secrets in server config / environment variables.

Rotate credentials if they were exposed anywhere.