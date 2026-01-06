// Add these variables at the top of your <script type="module">
const spreadsheetId = '1lSHJRdMuzj1oY1efmJITbbAUj71RFmHlSNnOXaV06IY';
const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

async function loadData() {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    // Regex to handle commas inside quoted net worth values
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const lines = csvText.split(/\r?\n/);
    const data = lines.slice(1)
        .filter(line => line.trim() !== "")
        .map(line => line.split(regex).map(val => val.replace(/"/g, '')));
    
    init(data); // Pass the live data to your init function
}

// Call loadData instead of init() at the start
loadData();

function parseAndPopulateTable(csvText) {
    // This regex splits by comma but ignores commas inside quotes
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const lines = csvText.split(/\r?\n/);
    const data = lines.slice(1)
        .filter(line => line.trim() !== "") // Skip empty lines
        .map(line => line.split(regex).map(val => val.replace(/"/g, ''))); // Remove quotes
    
    // Now call the function that starts your Three.js initialization
    initThreeJS(data); 
}

function init(data) {
    // ... (camera and scene setup stays the same)

    for ( let i = 0; i < data.length; i ++ ) {
        const item = data[i]; // [Name, Photo, Age, Country, Interest, Net Worth]
        const element = document.createElement( 'div' );
        element.className = 'element';
        
        // Step 6: Background color based on Net Worth [cite: 16]
        const worth = parseFloat(item[5].replace(/[$,]/g, ''));
        if (worth < 100000) element.style.backgroundColor = 'rgba(239, 48, 34, 0.75)'; // Red
        else if (worth > 200000) element.style.backgroundColor = 'rgba(58, 164, 72, 0.75)'; // Green
        else element.style.backgroundColor = 'rgba(255, 165, 0, 0.75)'; // Orange

        // Step 4: Add Photo [cite: 12]
        const img = document.createElement('img');
        img.src = item[1];
        img.style.width = '80px';
        element.appendChild(img);

        const name = document.createElement( 'div' );
        name.className = 'name'; // Make sure to add .name to your <style>
        name.textContent = item[0];
        element.appendChild( name );

        const interest = document.createElement( 'div' );
        interest.className = 'details';
        interest.textContent = item[4];
        element.appendChild( interest );

        // ... (rest of CSS3DObject creation)
    }
}

// Inside the 'table' target loop
const object = new THREE.Object3D();
object.position.x = ( ( i % 20 ) * 140 ) - 1330; // 20 columns 
object.position.y = - ( Math.floor( i / 20 ) * 180 ) + 900; // 10 rows 
targets.table.push( object );

// Inside the 'helix' target loop
const theta = i * 0.175 + (i % 2 === 1 ? Math.PI : 0); // Adds 180 degrees to every second tile 
const y = - ( i * 8 ) + 450;
const object = new THREE.Object3D();
object.setFromCylindricalCoords( 900, theta, y );

// Inside the 'grid' target loop
const object = new THREE.Object3D();
object.position.x = ( ( i % 5 ) * 400 ) - 800; // 5 columns 
object.position.y = ( - ( Math.floor( i / 5 ) % 4 ) * 400 ) + 800; // 4 rows 
object.position.z = ( Math.floor( i / 20 ) ) * - 800; // 10 layers deep 
targets.grid.push( object );