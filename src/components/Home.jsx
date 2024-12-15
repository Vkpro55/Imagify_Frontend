import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import bg from "../assets/photo.png"; // Default background image

const Home = () => {
    const [image, setImage] = useState(null); // State to store uploaded image
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [loading, setLoading] = useState(false); // To handle loading state while uploading

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true); // Set loading state to true

            const reader = new FileReader();
            reader.onloadend = async () => {
                setImage(reader.result); // Set the image source to display it
                // Create a FormData object to send the image file
                const formData = new FormData();
                formData.append('image', file); // Append the image to FormData

                // Send the image to the backend
                const response = await fetch('http://127.0.0.1:8000/upload-image', {
                    method: 'POST',
                    body: formData, // The image file is included in the FormData
                });

                // Check if the upload was successful
                if (response.ok) {
                    const data = await response.json();
                    console.log('Image uploaded successfully:', data);
                    navigate("/inpainting", { state: { image: reader.result } }); // Navigate to InpaintingPage with the image
                } else {
                    console.error('Image upload failed');
                }

                setLoading(false); // Set loading state to false after upload
            };
            reader.readAsDataURL(file); // Read the uploaded image
        }
    };

    return (
        <div className="container">
            {/* Left side: Typewriter effect and upload button */}
            <div className="text-container">
                <Typewriter
                    options={{
                        strings: ["Image Inpainting App"],
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 50,
                        cursor: "_",
                    }}
                />
                <input
                    type="file"
                    className="upload-btn"
                    accept="image/jpeg, image/png"
                    onChange={handleImageUpload}
                />
                {loading && <p>Uploading...</p>} {/* Display loading text */}
            </div>

            {/* Right side: Image display */}
            <div className="img-container">
                {/* Display default image if no upload, else display uploaded image */}
                <img src={image || bg} alt="Background or Uploaded" />
            </div>
        </div>
    );
};

export default Home;
