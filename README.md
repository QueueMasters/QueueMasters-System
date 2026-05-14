# 🚗 QueueMasters: Auto-Care Management System

[![Frontend](https://img.shields.io/badge/Frontend-React.js-blue.svg)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen.svg)]()

Managing a high-volume car wash shouldn't be chaotic. **QueueMasters** is a real-time operational dashboard and customer queue tracking system built to streamline auto-care workflows. From the moment a vehicle rolls into the bay to the final release, this system keeps staff coordinated, tracks financial analytics, and ensures customers know exactly when their car is ready.

## ✨ Core Features

* **Real-Time Queue Tracking:** A customer-facing digital board that live-polls vehicle statuses across three stages: *Waiting*, *Washing*, and *Ready*.
* **Role-Based Access Control (RBAC):** Secure entry differentiating between **Admins** (Managers) and **Washers** (Yard Staff). Managers get full access to financial archives and HR controls.
* **Live Financial Analytics:** An intuitive dashboard calculating projected revenue from the active queue, total daily sales, and service composition (Standard, Valet, Engine Clean).
* **Operational Dashboard:** Staff can update vehicle stages, edit intake errors on the fly, and "Release" vehicles to automatically archive the sale into the database.
* **Founder Protection:** Built-in HR logic that prevents the primary system administrator from being accidentally locked out or deleted by other staff.

## 🛠️ Tech Stack

* **Frontend Environment:** React.js, React Router DOM
* **State Management & Data Fetching:** React Hooks (`useState`, `useEffect`), Axios
* **Styling:** Custom CSS with dynamic status pill rendering and progress bars.
* **Assumed Backend:**SpringBoot RESTful API (e.g., Spring Boot or Express) running on `localhost:8080`.
* **Database Target:** H2 Console (for the historical sales archive).
* **IDE:** IntelliJ and VS CODE 
## 🚀 Quick Start

To get the QueueMasters frontend running locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/QueueMasters/QueueMasters-System.git](https://github.com/QueueMasters/QueueMasters-System.git)
cd QueueMasters-System
