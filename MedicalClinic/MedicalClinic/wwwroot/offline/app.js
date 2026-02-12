// Nombre de la base de datos y versión
const DB_NAME = 'MedicalDB';
const DB_VERSION = 1;
let db;

// Abrir o crear la base de datos
const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = event => {
    db = event.target.result;

    // Crear un store si no existe
    if (!db.objectStoreNames.contains('patients')) {
        const store = db.createObjectStore('patients', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        console.log('[IndexedDB] Object store "patients" creado');
    }
};

request.onsuccess = event => {
    db = event.target.result;
    // Leer todos los datos
    getAllPatients();
};

request.onerror = event => {
    console.error('[IndexedDB] Error al abrir DB:', event.target.error);
};

// Función para agregar un paciente
function addPatient(patient) {
    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    const request = store.add(patient);

    request.onsuccess = () => {
        console.log('[IndexedDB] Paciente agregado:', patient);
    };

    request.onerror = () => {
        console.error('[IndexedDB] Error al agregar paciente:', request.error);
    };
}

// Función para leer todos los pacientes
function getAllPatients() {
    const transaction = db.transaction(['patients'], 'readonly');
    const store = transaction.objectStore('patients');
    const request = store.getAll();

    request.onsuccess = () => {
        console.log('[IndexedDB] Pacientes en DB:', request.result);
    };

    request.onerror = () => {
        console.error('[IndexedDB] Error al leer pacientes:', request.error);
    };
}
