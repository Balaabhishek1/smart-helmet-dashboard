document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Clocks and Timestamps
    // ----------------------------------------------------
    function updateTimestamp() {
        const now = new Date();
        document.getElementById('liveTimestamp').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTimestamp, 1000);
    updateTimestamp();

    // ----------------------------------------------------
    // Speedometer simulation
    // ----------------------------------------------------
    const speedValueEl = document.getElementById('speedValue');
    const speedRingFill = document.getElementById('speedRingFill');
    let currentSpeed = 65;
    const maxSpeed = 160;

    function updateSpeedometer() {
        // Random fluctuation
        const fluctuation = Math.floor(Math.random() * 5) - 2; 
        currentSpeed = Math.max(0, currentSpeed + fluctuation);
        if (currentSpeed > 75) currentSpeed -= 2;
        if (currentSpeed < 55) currentSpeed += 3;

        // Animate Map Marker alongside speed to simulate movement
        const marker = document.getElementById('liveMarker');
        const topOffset =  48 + (Math.sin(Date.now() / 1000) * 2);
        const leftOffset = 50 + (Math.cos(Date.now() / 800) * 2);
        marker.style.top = `${topOffset}%`;
        marker.style.left = `${leftOffset}%`;

        speedValueEl.textContent = currentSpeed;
        const speedRatio = currentSpeed / maxSpeed;
        const offset = 210 - (140 * speedRatio); 
        speedRingFill.style.strokeDashoffset = offset;
    }
    setInterval(updateSpeedometer, 800);
    setTimeout(() => { speedRingFill.style.strokeDashoffset = '140'; }, 100);

    // ----------------------------------------------------
    // Geo-fencing Simulation
    // ----------------------------------------------------
    const geoFenceToggle = document.getElementById('geoFenceToggle');
    const geoCircle = document.querySelector('.geo-fence-circle');
    let geoFenceInterval;

    function simulateGeoFence() {
        if (!geoFenceToggle.checked) return;
        
        // Randomly simulate a breach every ~15 seconds on average
        if (Math.random() > 0.90) {
            geoCircle.classList.add('breached');
            showToast('Geo-fence breached! Rider left designated zone.', 'warning', 'fa-solid fa-map-pin');
            
            // Auto resolve after 5 secs
            setTimeout(() => {
                geoCircle.classList.remove('breached');
                showToast('Returned to designated zone.', 'success', 'fa-solid fa-check');
            }, 5000);
        }
    }

    geoFenceToggle.addEventListener('change', (e) => {
        if(e.target.checked) {
            geoCircle.style.display = 'block';
            geoFenceInterval = setInterval(simulateGeoFence, 2000);
            showToast('Geo-fencing enabled. Radius: 50km', 'info', 'fa-solid fa-shield');
        } else {
            geoCircle.style.display = 'none';
            geoCircle.classList.remove('breached');
            clearInterval(geoFenceInterval);
        }
    });

    if (geoFenceToggle.checked) {
        geoFenceInterval = setInterval(simulateGeoFence, 2000);
    }

    // ----------------------------------------------------
    // System Status Simulation (Helmet Worn / Connection)
    // ----------------------------------------------------
    const connectionStatus = document.getElementById('connectionStatus');
    const wornStatus = document.getElementById('wornStatus');
    
    // Simulate drop outs occasionally
    setInterval(() => {
        if (Math.random() > 0.98) {
            // Drop connection
            connectionStatus.className = 'metric-pill device-status disconnected';
            connectionStatus.innerHTML = '<i class="fa-solid fa-link-slash"></i><span>Disconnected</span>';
            showToast('Link Lost: Attempting reset...', 'warning', 'fa-solid fa-triangle-exclamation');
            
            setTimeout(() => {
                connectionStatus.className = 'metric-pill device-status connected';
                connectionStatus.innerHTML = '<i class="fa-solid fa-link"></i><span>Connected</span>';
                showToast('Link Restored.', 'success', 'fa-solid fa-check');
            }, 3000);
        }

        // Simulate helmet taken off
        if (Math.random() > 0.95 && connectionStatus.classList.contains('connected')) {
            wornStatus.className = 'metric-pill worn-status false';
            wornStatus.innerHTML = '<i class="fa-solid fa-head-side-mask"></i><span>Removed</span>';
            
            setTimeout(() => {
                wornStatus.className = 'metric-pill worn-status true';
                wornStatus.innerHTML = '<i class="fa-solid fa-head-side-mask"></i><span>Helmet Worn</span>';
            }, 4000);
        }
    }, 5000);


    // ----------------------------------------------------
    // Crash Detection / Emergency alerts
    // ----------------------------------------------------
    const crashModal = document.getElementById('crashAlertModal');
    const testCrashBtn = document.getElementById('testCrashBtn');
    const dismissBtn = document.getElementById('dismissAlertBtn');
    const dispatchBtn = document.getElementById('dispatchBtn');
    const countdownEl = document.getElementById('countdown');
    
    let crashTimer;
    let countdownValue = 10;

    function triggerCrashAlert() {
        const now = new Date();
        document.getElementById('crashTime').textContent = now.toLocaleTimeString('en-US');
        crashModal.classList.remove('hidden');
        
        countdownValue = 10;
        countdownEl.textContent = countdownValue;
        
        clearInterval(crashTimer);
        crashTimer = setInterval(() => {
            countdownValue--;
            countdownEl.textContent = countdownValue;
            
            if (countdownValue <= 0) {
                clearInterval(crashTimer);
                executeDispatch();
            }
        }, 1000);
    }

    function executeDispatch() {
        clearInterval(crashTimer);
        dispatchBtn.innerHTML = '<i class="fa-solid fa-check"></i> DISPATCHED';
        dispatchBtn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            closeCrashAlert();
            showToast('Emergency contacts and services have been notified.', 'info', 'fa-solid fa-truck-medical');
        }, 2000);
    }

    function closeCrashAlert() {
        clearInterval(crashTimer);
        crashModal.classList.add('hidden');
        // Reset button
        setTimeout(() => {
            dispatchBtn.innerHTML = 'Dispatch Emergency Services';
            dispatchBtn.style.backgroundColor = 'var(--danger)';
        }, 500);
    }

    testCrashBtn.addEventListener('click', triggerCrashAlert);
    dismissBtn.addEventListener('click', () => {
        closeCrashAlert();
        showToast('Crash alert dismissed (Marked as false alarm).', 'success', 'fa-solid fa-check');
    });
    dispatchBtn.addEventListener('click', executeDispatch);


    // ----------------------------------------------------
    // Toast Notification System
    // ----------------------------------------------------
    const toastContainer = document.getElementById('toastContainer');
    function showToast(message, type = 'info', iconClass = 'fa-solid fa-info-circle') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconColorStr = '';
        if (type === 'warning') iconColorStr = 'color: var(--warning)';
        else if (type === 'success') iconColorStr = 'color: var(--success)';
        else iconColorStr = 'color: var(--primary)';

        toast.innerHTML = `
            <i class="${iconClass}" style="${iconColorStr}"></i>
            <span class="toast-msg">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow for animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ----------------------------------------------------
    // Generic UI Interactions
    // ----------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const miniBtns = document.querySelectorAll('.mini-btn');
    miniBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.closest('.card-actions');
            parent.querySelectorAll('.mini-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle route history vs live map
            if (btn.textContent === 'Route History') {
                const mapGrid = document.querySelector('.map-grid');
                mapGrid.style.filter = 'sepia(0.8) hue-rotate(200deg) brightness(0.5)';
                document.getElementById('liveMarker').style.opacity = '0.3';
                showToast('Viewing Route History', 'info', 'fa-solid fa-clock-rotate-left');
            } else if (btn.textContent === 'Live Map') {
                const mapGrid = document.querySelector('.map-grid');
                mapGrid.style.filter = 'none';
                document.getElementById('liveMarker').style.opacity = '1';
            }
        });
    });
});
