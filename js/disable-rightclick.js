// 1?? Prevent right-click on images (silent)
document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault(); // block right-click menu on images
        // no alert shown - silent blocking
    }
});

// 2?? Add transparent overlays on images
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img.protected');
    images.forEach(img => {
        // Wrap image inside a container
        const wrapper = document.createElement('div');
        wrapper.classList.add('image-protect-wrapper');

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Add overlay
        const overlay = document.createElement('div');
        overlay.classList.add('image-overlay');
        wrapper.appendChild(overlay);
    });
});
