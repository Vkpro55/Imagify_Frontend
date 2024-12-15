import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const InpaintingPage = () => {
    const location = useLocation();
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(5);
    const [image, setImage] = useState(location.state?.image || null);
    const [history, setHistory] = useState([]); // Undo/redo stack
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        contextRef.current = context;

        if (image) {
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                saveHistory();
            };
            img.src = image;
        }
    }, [image]);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.lineWidth = brushSize;
            contextRef.current.strokeStyle = "#FFFFFF";
        }
    }, [brushSize]);


    // Start drawing
    const startDrawing = (e) => {
        setDrawing(true);
        contextRef.current.beginPath();
        contextRef.current.moveTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
    };

    // Draw on canvas
    const draw = (e) => {
        if (!drawing) return;
        contextRef.current.lineTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );
        contextRef.current.stroke();
    };

    // Stop drawing
    const stopDrawing = () => {
        if (!drawing) return;
        setDrawing(false);
        saveHistory();
    };

    // Save the current canvas state for undo/redo
    const saveHistory = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(dataURL);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };


    // Undo functionality
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            restoreCanvas(history[historyIndex - 1]);
        }
    };

    // Redo functionality
    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            restoreCanvas(history[historyIndex + 1]);
        }
    };

    // Restore a specific canvas state
    const restoreCanvas = (dataURL) => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        const img = new Image();
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = dataURL;
    };

    // Clear the mask (reload base image)
    const clearMask = () => {
        if (!image) return;
        const canvas = canvasRef.current;
        const context = contextRef.current;

        const img = new Image();
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = image;
        saveHistory();
    };

    // // Export the mask as an image
    // const exportMask = () => {
    //     const canvas = canvasRef.current;
    //     const dataURL = canvas.toDataURL("image/png");
    //     const link = document.createElement("a");
    //     link.href = dataURL;
    //     link.download = "mask.png";
    //     link.click();
    // };

    // Export the mask and upload it to the backend
    const exportMask = async () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL("image/png");

        try {
            // Convert base64 to a Blob (file-like object)
            const byteCharacters = atob(dataURL.split(',')[1]);  // Decode base64 to bytes
            const byteArray = new Uint8Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }

            // Create a Blob object
            const blob = new Blob([byteArray], { type: 'image/png' });

            // Send the mask image as a file to the backend
            const formData = new FormData();
            formData.append("mask", blob, "mask.png");

            const response = await fetch("http://localhost:8000/upload-mask", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Mask uploaded successfully!");
            } else {
                alert(`Failed to upload mask: ${data.message}`);
            }
        } catch (error) {
            console.error("Error uploading mask:", error);
            alert("Error uploading mask");
        }
    };




    return (
        <div className="container">
            <div className="img-container">
                <img src={image} alt="Uploaded Image" />
            </div>

            <div className="canvas-container">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                />
            </div>

            <div className="controls">
                <label>Brush Size:</label>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                />
            </div>

            <div className="controls">
                <button onClick={undo} style={{ marginRight: "10px" }}>
                    Undo
                </button>
                <button onClick={redo} style={{ marginRight: "10px" }}>
                    Redo
                </button>
                <button onClick={clearMask} style={{ marginRight: "10px" }}>
                    Clear Mask
                </button>
                <button onClick={exportMask} style={{ marginRight: "10px" }}>
                    Export Mask
                </button>
            </div>
        </div>
    );
};

export default InpaintingPage;
