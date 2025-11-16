// ===========================
// Global Variables
// ===========================
let uploadedImage = null;
let originalImageData = null;

// ===========================
// DOM Elements
// ===========================
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.querySelector('.upload-section');
const processingSection = document.getElementById('processingSection');
const resultSection = document.getElementById('resultSection');
const originalImage = document.getElementById('originalImage');
const processedCanvas = document.getElementById('processedCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const progressFill = document.getElementById('progressFill');

// ===========================
// Upload Zone Click Handler
// ===========================
uploadZone.addEventListener('click', () => {
    fileInput.click();
});

// ===========================
// File Input Change Handler
// ===========================
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

// ===========================
// Drag and Drop Handlers
// ===========================
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

// ===========================
// File Upload Handler
// ===========================
function handleFileUpload(file) {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (PNG or JPG)');
        return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImage = new Image();
        uploadedImage.onload = () => {
            startProcessing();
        };
        uploadedImage.src = e.target.result;
        originalImageData = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ===========================
// Start Processing
// ===========================
function startProcessing() {
    // Hide upload section
    uploadSection.style.display = 'none';
    
    // Show processing section
    processingSection.style.display = 'block';
    processingSection.classList.add('fade-in');
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 50);
    
    // Simulate processing delay (2-3 seconds)
    setTimeout(() => {
        processImage();
    }, 2500);
}

// ===========================
// Process Image (Mock Background Removal)
// ===========================
function processImage() {
    // Set original image
    originalImage.src = originalImageData;
    
    // Create canvas and process image
    const ctx = processedCanvas.getContext('2d');
    
    // Set canvas dimensions to match image
    processedCanvas.width = uploadedImage.width;
    processedCanvas.height = uploadedImage.height;
    
    // Draw original image
    ctx.drawImage(uploadedImage, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    const data = imageData.data;
    
    // Mock background removal: Make lighter pixels transparent
    // This simulates background removal by targeting lighter colors
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        
        // Calculate brightness
        const brightness = (red + green + blue) / 3;
        
        // If pixel is relatively bright (likely background), make it transparent
        // This is a simple simulation - real background removal uses AI
        if (brightness > 180) {
            // Calculate how transparent based on brightness
            const alpha = Math.max(0, 255 - (brightness - 180) * 3);
            data[i + 3] = alpha;
        }
        
        // Also check for white-ish colors
        if (red > 200 && green > 200 && blue > 200) {
            const whiteness = (red + green + blue) / 3;
            data[i + 3] = Math.max(0, 255 - (whiteness - 200) * 4);
        }
    }
    
    // Put processed image data back
    ctx.putImageData(imageData, 0, 0);
    
    // Show result section
    showResults();
}

// ===========================
// Show Results
// ===========================
function showResults() {
    // Hide processing section
    processingSection.style.display = 'none';
    
    // Show result section
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');
    
    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===========================
// Download Button Handler
// ===========================
downloadBtn.addEventListener('click', () => {
    // Create download link
    processedCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'background-removed-' + Date.now() + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 'image/png');
});

// ===========================
// New Image Button Handler
// ===========================
newImageBtn.addEventListener('click', () => {
    // Reset everything
    uploadedImage = null;
    originalImageData = null;
    fileInput.value = '';
    progressFill.style.width = '0%';
    
    // Hide result section
    resultSection.style.display = 'none';
    
    // Show upload section
    uploadSection.style.display = 'block';
    uploadSection.classList.add('fade-in');
    
    // Scroll to upload section
    uploadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===========================
// Smooth Scroll for Navigation
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// Prevent Default Drag Behavior
// ===========================
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});

// ===========================
// Console Welcome Message
// ===========================
console.log('%c🎨 BGREMOVER Pro', 'color: #FFC700; font-size: 24px; font-weight: bold;');
console.log('%cRemove backgrounds instantly & 100% free!', 'color: #cccccc; font-size: 14px;');
