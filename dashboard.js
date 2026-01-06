// Configuration
const GOOGLE_SHEET_ID = '1lSHJRdMuzj1oY1efmJITbbAUj71RFmHlSNnOXaV06IY';
const API_KEY = 'AIzaSyBoIn0gaZs6Jg8fvrKKGCBXHSMW1Hvmfz0';
const SHEET_NAME = 'Sheet1';

// Global variables
let userData = null;
let sheetData = [];
let visualization3D = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    userData = JSON.parse(storedUser);
    updateUserDisplay();
    
    // Load data
    loadGoogleSheetData();
    
    // Setup event listeners
    setupEventListeners();
});

function updateUserDisplay() {
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userAvatar').src = userData.picture;
    }
}

function signOut() {
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

function setupEventListeners() {
    // Search and filter
    document.getElementById('searchInput').addEventListener('input', filterData);
    document.getElementById('countryFilter').addEventListener('change', filterData);
    document.getElementById('interestFilter').addEventListener('change', filterData);
    
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            if (visualization3D) {
                visualization3D.changeView(view);
            }
        });
    });
}

async function loadGoogleSheetData() {
    const loading = document.getElementById('loading');
    const status = document.getElementById('dataStatus');
    
    try {
        status.textContent = 'Fetching data from Google Sheets...';
        
        // Try to fetch from Google Sheets API
        const range = 'A:F';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_NAME}!${range}?key=${API_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.values || data.values.length < 2) {
            throw new Error('No data found in sheet');
        }
        
        // Parse data
        sheetData = parseSheetData(data.values);
        console.log('Loaded data from Google Sheets:', sheetData);
        status.textContent = `Loaded ${sheetData.length} records from Google Sheets`;
        
    } catch (error) {
        console.error('Error loading Google Sheet:', error);
        status.textContent = 'Using sample data (Google Sheets access restricted)';
        
        // Use sample data
        sheetData = parseCSVData();
    }
    
    // Initialize visualization with data
    setTimeout(() => {
        loading.style.display = 'none';
        updateDataList();
        initializeVisualization();
    }, 1000);
}

function parseSheetData(rows) {
    const headers = rows[0];
    return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            const cleanHeader = header.trim();
            obj[cleanHeader] = row[index] || '';
            
            if (cleanHeader === 'Net Worth') {
                const netWorthStr = row[index] || '$0';
                const cleanNumber = netWorthStr.replace(/[$,]/g, '');
                obj.netWorthValue = parseFloat(cleanNumber) || 0;
            }
        });
        return obj;
    });
}

function parseCSVData() {
    // Sample data from your CSV (first 50 entries)
    return [
        {
            "Name": "Lee Siew Suan",
            "Photo": "https://static.kasatria.com/pivot-img/photo/019.jpg",
            "Age": "25",
            "Country": "CN",
            "Interest": "Writing",
            "Net Worth": "$251,260.80",
            "netWorthValue": 251260.80
        },
        {
            "Name": "New Yee Chian",
            "Photo": "https://static.kasatria.com/pivot-img/photo/020.jpg",
            "Age": "23",
            "Country": "CN",
            "Interest": "Cooking",
            "Net Worth": "$60,393.60",
            "netWorthValue": 60393.60
        },
        {
            "Name": "Wong Thiam Fook",
            "Photo": "https://static.kasatria.com/pivot-img/photo/021.jpg",
            "Age": "30",
            "Country": "CN",
            "Interest": "Traveling",
            "Net Worth": "$212,140.80",
            "netWorthValue": 212140.80
        },
        {
            "Name": "Norsuzilawati Mohd Noor",
            "Photo": "https://static.kasatria.com/pivot-img/photo/022.jpg",
            "Age": "30",
            "Country": "MY",
            "Interest": "Painting",
            "Net Worth": "$208,228.80",
            "netWorthValue": 208228.80
        },
        {
            "Name": "Norzainah Omar",
            "Photo": "https://static.kasatria.com/pivot-img/photo/023.jpg",
            "Age": "30",
            "Country": "MY",
            "Interest": "Hiking",
            "Net Worth": "$106,555.20",
            "netWorthValue": 106555.20
        },
        {
            "Name": "Meghandran Nathy",
            "Photo": "https://static.kasatria.com/pivot-img/photo/024.jpg",
            "Age": "31",
            "Country": "IN",
            "Interest": "Cooking",
            "Net Worth": "$139,080.00",
            "netWorthValue": 139080.00
        },
        {
            "Name": "Joyshree Goswami",
            "Photo": "https://static.kasatria.com/pivot-img/photo/025.jpg",
            "Age": "35",
            "Country": "IN",
            "Interest": "Painting",
            "Net Worth": "$192,278.40",
            "netWorthValue": 192278.40
        },
        {
            "Name": "Geetha Maniam",
            "Photo": "https://static.kasatria.com/pivot-img/photo/026.jpg",
            "Age": "27",
            "Country": "IN",
            "Interest": "Cooking",
            "Net Worth": "$90,864.00",
            "netWorthValue": 90864.00
        },
        {
            "Name": "Abdul Rahim Osman",
            "Photo": "https://static.kasatria.com/pivot-img/photo/027.jpg",
            "Age": "30",
            "Country": "MY",
            "Interest": "Cooking",
            "Net Worth": "$141,859.20",
            "netWorthValue": 141859.20
        },
        {
            "Name": "Prem Anand Raj",
            "Photo": "https://static.kasatria.com/pivot-img/photo/028.jpg",
            "Age": "44",
            "Country": "IN",
            "Interest": "Gardening",
            "Net Worth": "$196,113.60",
            "netWorthValue": 196113.60
        }
        // Add more data as needed...
    ];
}

function updateDataList() {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';
    
    sheetData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'data-item';
        div.onclick = () => selectDataItem(index);
        
        const netWorth = item.netWorthValue || 0;
        let colorClass = 'red';
        if (netWorth >= 200000) colorClass = 'green';
        else if (netWorth >= 100000) colorClass = 'orange';
        
        div.innerHTML = `
            <img src="${item.Photo}" alt="${item.Name}" onerror="this.src='https://via.placeholder.com/50'">
            <div><strong>${item.Name}</strong></div>
            <div>${item.Age} years • ${item.Country}</div>
            <div>${item.Interest}</div>
            <div class="net-worth ${colorClass}">${item['Net Worth'] || '$0'}</div>
        `;
        
        dataList.appendChild(div);
    });
}

function selectDataItem(index) {
    const items = document.querySelectorAll('.data-item');
    items.forEach(item => item.classList.remove('selected'));
    items[index].classList.add('selected');
    
    if (visualization3D) {
        visualization3D.selectCard(index);
    }
}

function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const country = document.getElementById('countryFilter').value;
    const interest = document.getElementById('interestFilter').value;
    
    const items = document.querySelectorAll('.data-item');
    
    items.forEach((item, index) => {
        const data = sheetData[index];
        if (!data) return;
        
        const matchesSearch = data.Name.toLowerCase().includes(searchTerm);
        const matchesCountry = !country || data.Country === country;
        const matchesInterest = !interest || data.Interest === interest;
        
        item.style.display = (matchesSearch && matchesCountry && matchesInterest) 
            ? 'block' 
            : 'none';
    });
}

function initializeVisualization() {
    if (!sheetData || sheetData.length === 0) {
        console.error('No data to visualize');
        return;
    }
    
    visualization3D = new DataVisualization3D('visualization', sheetData);
}

// DataVisualization3D Class
class DataVisualization3D {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.objects = [];
        this.currentView = 'table';
        
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.cssScene = null;
        this.cssCamera = null;
        this.cssRenderer = null;
        
        this.init();
    }
    
    init() {
        // WebGL renderer for background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a);
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
        this.camera.position.z = 2000;
        
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);
        
        // CSS3D renderer for data cards
        this.cssScene = new THREE.Scene();
        this.cssCamera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
        this.cssCamera.position.copy(this.camera.position);
        
        this.cssRenderer = new THREE.CSS3DRenderer();
        this.cssRenderer.setSize(width, height);
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = '0';
        this.container.appendChild(this.cssRenderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Create visualization
        this.createVisualization();
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createVisualization() {
        this.objects.forEach(obj => this.cssScene.remove(obj));
        this.objects = [];
        
        if (!this.data || this.data.length === 0) return;
        
        this.data.forEach((item, index) => {
            const element = this.createDataCard(item, index);
            this.cssScene.add(element);
            this.objects.push(element);
        });
        
        this.arrangeView();
    }
    
    createDataCard(data, index) {
        // Create HTML element for the card
        const div = document.createElement('div');
        div.className = 'data-card';
        
        // Determine color based on net worth
        const netWorth = data.netWorthValue || 0;
        let backgroundColorClass = 'net-worth-bg-red'; // Red < $100K
        let worthColor = 'rgba(255, 64, 64, 0.95)';
        
        if (netWorth >= 200000) {
            backgroundColorClass = 'net-worth-bg-green'; // Green > $200K
            worthColor = 'rgba(0, 255, 127, 0.95)';
        } else if (netWorth >= 100000) {
            backgroundColorClass = 'net-worth-bg-orange'; // Orange $100K-$200K
            worthColor = 'rgba(255, 165, 0, 0.95)';
        }
        
        // Add background class
        div.classList.add(backgroundColorClass);
        
        // Create card content matching the periodic table style
        const number = document.createElement('div');
        number.className = 'card-number';
        number.textContent = index + 1;
        div.appendChild(number);
        
        const symbol = document.createElement('div');
        symbol.className = 'card-symbol';
        // Use first 2 letters of name as "symbol" like in periodic table
        const nameSymbol = data.Name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
        symbol.textContent = nameSymbol;
        div.appendChild(symbol);
        
        const details = document.createElement('div');
        details.className = 'card-details';
        details.innerHTML = `
            <span class="name">${data.Name}</span>
            <span class="info">${data.Age} yrs • ${data.Country}</span>
            <span class="info">${data.Interest}</span>
            <span class="worth" style="color: ${worthColor}; text-shadow: 0 0 5px ${worthColor};">${data['Net Worth'] || '$0'}</span>
        `;
        div.appendChild(details);
        
        // Add click handler
        div.onclick = () => this.selectCard(index);
        
        // Create CSS3D object
        const object = new THREE.CSS3DObject(div);
        object.userData = { index, data };
        
        return object;
    }
    
    arrangeView() {
        switch(this.currentView) {
            case 'table':
                this.arrangeAsTable(20, 10);
                break;
            case 'sphere':
                this.arrangeAsSphere();
                break;
            case 'helix':
                this.arrangeAsHelix(true);
                break;
            case 'grid':
                this.arrangeAsGrid(5, 4, 10);
                break;
        }
    }
    
    arrangeAsTable(columns, rows) {
        const spacingX = 140;
        const spacingY = 180;
        
        this.objects.forEach((obj, i) => {
            const col = i % columns;
            const row = Math.floor(i / columns);
            
            // Position in grid - centered
            const x = (col * spacingX) - (columns * spacingX) / 2 + spacingX/2;
            const y = -(row * spacingY) + (rows * spacingY) / 2 - spacingY/2;
            
            this.animateTo(obj, { x, y, z: 0 }, 2000);
        });
    }

    arrangeAsSphere() {
        const radius = 800;
        
        this.objects.forEach((obj, i) => {
            const phi = Math.acos(-1 + (2 * i) / this.objects.length);
            const theta = Math.sqrt(this.objects.length * Math.PI) * phi;
            
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            
            // Look at center
            const vector = new THREE.Vector3(x * 2, y, z * 2);
            obj.lookAt(vector);
            
            this.animateTo(obj, { x, y, z }, 2000);
        });
    }

    arrangeAsHelix(isDouble = true) {
        const radius = 900;
        
        this.objects.forEach((obj, i) => {
            // For double helix, alternate between two strands
            const strand = isDouble ? (i % 2) : 0;
            const offset = strand * Math.PI; // 180° offset for double helix
            
            const theta = i * 0.175 + Math.PI + offset;
            const y = -(i * 8) + 450;
            
            // Convert cylindrical to cartesian
            const x = radius * Math.cos(theta);
            const z = radius * Math.sin(theta);
            
            // Look at direction
            const vector = new THREE.Vector3(x * 2, y, z * 2);
            obj.lookAt(vector);
            
            this.animateTo(obj, { x, y, z }, 2000);
        });
    }

    arrangeAsGrid(width, height, depth) {
        const spacing = 400;
        
        this.objects.forEach((obj, i) => {
            const totalPerLayer = width * height;
            const layer = Math.floor(i / totalPerLayer);
            const indexInLayer = i % totalPerLayer;
            
            const x = ((indexInLayer % width) * spacing) - ((width - 1) * spacing) / 2;
            const y = -((Math.floor(indexInLayer / width) % height) * spacing) + ((height - 1) * spacing) / 2;
            const z = (layer - Math.floor(depth / 2)) * 1000;
            
            this.animateTo(obj, { x, y, z }, 2000);
        });
    }
    
    // Add TWEEN library to your HTML head
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>

    animateTo(object, targetPosition, duration) {
        // Use TWEEN for smooth animations like the original example
        new TWEEN.Tween(object.position)
            .to({ 
                x: targetPosition.x, 
                y: targetPosition.y, 
                z: targetPosition.z 
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        
        if (targetPosition.rotation) {
            new TWEEN.Tween(object.rotation)
                .to({ 
                    x: targetPosition.rotation.x, 
                    y: targetPosition.rotation.y, 
                    z: targetPosition.rotation.z 
                }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        }
    }

    // Update your animate method
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update TWEEN animations
        TWEEN.update();
        
        // Only rotate camera for sphere and helix views
        if (this.currentView === 'sphere' || this.currentView === 'helix') {
            const time = Date.now() * 0.0001;
            this.camera.position.x = 3000 * Math.sin(time);
            this.camera.position.z = 3000 * Math.cos(time);
            this.camera.lookAt(this.scene.position);
            
            this.cssCamera.position.copy(this.camera.position);
            this.cssCamera.rotation.copy(this.camera.rotation);
        }
        
        this.renderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.cssScene, this.cssCamera);
    }
    
    selectCard(index) {
        this.objects.forEach((obj, i) => {
            const element = obj.element;
            if (i === index) {
                element.style.boxShadow = '0 0 20px #667eea';
                element.style.transform = 'scale(1.1)';
                selectDataItem(index);
            } else {
                element.style.boxShadow = 'none';
                element.style.transform = 'scale(1)';
            }
        });
    }
    
    changeView(view) {
        this.currentView = view;
        this.arrangeView();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.currentView !== 'table') {
            const time = Date.now() * 0.0001;
            this.camera.position.x = 2000 * Math.sin(time);
            this.camera.position.z = 2000 * Math.cos(time);
            this.camera.lookAt(this.scene.position);
            
            this.cssCamera.position.copy(this.camera.position);
            this.cssCamera.rotation.copy(this.camera.rotation);
        }
        
        this.renderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.cssScene, this.cssCamera);
    }
    
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        this.cssCamera.aspect = width / height;
        this.cssCamera.updateProjectionMatrix();
        this.cssRenderer.setSize(width, height);
    }
}