# React + Vite

# Full-Stack Project: Image Upload and Masking Service

## Overview
This project is a full-stack application with a **FastAPI** backend and a **React** frontend. The backend handles the image upload, storage, and metadata management, while the frontend allows users to upload images and view the results interactively.

## Features
- **Image Upload**: Users can upload images to the backend.
- **Mask Image Upload**: Users can upload a mask image to apply to the original image.
- **Image Metadata**: The backend stores metadata about uploaded images and their associated masks in a MongoDB database.
- **Frontend**: A simple interface to upload images and display feedback.

## How to Run the Project Locally

### Prerequisites
- Python 3.8+
- MongoDB (either local instance or MongoDB Atlas for cloud database)
- **Virtual environment** for Python dependencies (recommended)

### Backend (FastAPI)

1. **Backend Repo**:
   ```bash
   https://github.com/Vkpro55/Imagify_Backend/tree/main
   ```

2. **Clone the repository**:
   ```bash
   git clone https://github.com/Vkpro55/Imagify_Backend.git
   cd Imagify_Backend
   ```
3. **Install Packages**:
   ```bash
   pip -r requirements.txt
   ```
3. **Run the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend (React)
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vkpro55/Imagify_Frontend.git
   cd Imagify_Frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the server**:
   ```bash
   npm run dev
   ```


![Screenshot (473)](https://github.com/user-attachments/assets/c87a40ef-84f1-41a3-b714-379850e9f11b)
![Screenshot (474)](https://github.com/user-attachments/assets/a7f924f7-93c7-4e92-94a8-6823102b20ee)

   
