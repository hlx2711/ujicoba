// Variabel global untuk melacak operasi saat ini
let currentOperation = 'add';

// Inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
    // Setup UI awal
    createMatrixInputs('A', 3, 3);
    createMatrixInputs('B', 3, 3);
    setupEventListeners();
    
    // Set operasi default
    updateUIForOperation('add');
});

// FUNGSI SETUP UI

// Membuat input matriks berdasarkan dimensi
function createMatrixInputs(matrixId, rows, cols) {
    const matrixContainer = document.getElementById(`matrix${matrixId}`);
    matrixContainer.innerHTML = '';
    
    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        
        for (let j = 0; j < cols; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'matrix-cell';
            
            const input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.dataset.row = i;
            input.dataset.col = j;
            input.step = '1'; // Hanya memungkinkan bilangan bulat
            
            cellDiv.appendChild(input);
            rowDiv.appendChild(cellDiv);
        }
        
        matrixContainer.appendChild(rowDiv);
    }
}

// Setup semua event listener
function setupEventListeners() {
    // Event listener untuk tombol operasi
    document.getElementById('addBtn').addEventListener('click', () => updateUIForOperation('add'));
    document.getElementById('subtractBtn').addEventListener('click', () => updateUIForOperation('subtract'));
    document.getElementById('multiplyBtn').addEventListener('click', () => updateUIForOperation('multiply'));
    document.getElementById('transposeBtn').addEventListener('click', () => updateUIForOperation('transpose'));
    document.getElementById('determinantBtn').addEventListener('click', () => updateUIForOperation('determinant'));
    document.getElementById('inverseBtn').addEventListener('click', () => updateUIForOperation('inverse'));
    
    // Event listener untuk tombol tema
    document.getElementById('lightTheme').addEventListener('click', () => setTheme('light'));
    document.getElementById('darkTheme').addEventListener('click', () => setTheme('dark'));
    
    // Event listener untuk tombol dimensi matriks
    setupDimensionButtons();
    
    // Event listener untuk tombol acak dan kosongkan
    document.getElementById('randomMatrixA').addEventListener('click', () => randomizeMatrix('A'));
    document.getElementById('randomMatrixB').addEventListener('click', () => randomizeMatrix('B'));
    document.getElementById('clearMatrixA').addEventListener('click', () => clearMatrix('A'));
    document.getElementById('clearMatrixB').addEventListener('click', () => clearMatrix('B'));
    
    // Event listener untuk tombol hitung
    document.getElementById('calculateBtn').addEventListener('click', performCalculation);
}

// Setup tombol pengubah dimensi
function setupDimensionButtons() {
    const decreaseBtns = document.querySelectorAll('.decrease-btn');
    const increaseBtns = document.querySelectorAll('.increase-btn');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const matrix = this.dataset.matrix;
            const dimension = this.dataset.dimension;
            changeDimension(matrix, dimension, -1);
        });
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const matrix = this.dataset.matrix;
            const dimension = this.dataset.dimension;
            changeDimension(matrix, dimension, 1);
        });
    });
}

// Mengubah dimensi matriks
function changeDimension(matrix, dimension, change) {
    const dimensionSpan = document.getElementById(`matrix${matrix}${dimension === 'rows' ? 'Rows' : 'Cols'}`);
    let value = parseInt(dimensionSpan.textContent);
    
    // Batasi nilai minimal 1 dan maksimal 10
    value = Math.max(1, Math.min(10, value + change));
    dimensionSpan.textContent = value;
    
    // Update matriks
    const rows = parseInt(document.getElementById(`matrix${matrix}Rows`).textContent);
    const cols = parseInt(document.getElementById(`matrix${matrix}Cols`).textContent);
    createMatrixInputs(matrix, rows, cols);
    
    // Update UI untuk operasi yang memerlukan dimensi tertentu
    validateDimensionsForOperation();
}

// Acak nilai matriks
function randomizeMatrix(matrixId) {
    const inputs = document.querySelectorAll(`#matrix${matrixId} input`);
    inputs.forEach(input => {
        // Menghasilkan angka acak antara -10 dan 10, hanya bilangan bulat
        input.value = Math.floor(Math.random() * 21 - 10);
    });
}

// Kosongkan matriks (set nilai ke 0)
function clearMatrix(matrixId) {
    const inputs = document.querySelectorAll(`#matrix${matrixId} input`);
    inputs.forEach(input => {
        input.value = '0';
    });
}

// FUNGSI PENGATURAN UI

// Update UI berdasarkan operasi yang dipilih
function updateUIForOperation(operation) {
    // Simpan operasi saat ini
    currentOperation = operation;
    
    // Reset semua tombol operasi
    document.querySelectorAll('.operation-list button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Aktifkan tombol operasi yang dipilih
    document.getElementById(`${operation}Btn`).classList.add('active');
    
    // Update judul operasi
    const titles = {
        'add': 'Penjumlahan Matriks',
        'subtract': 'Pengurangan Matriks',
        'multiply': 'Perkalian Matriks',
        'transpose': 'Transpose Matriks',
        'determinant': 'Determinan Matriks',
        'inverse': 'Invers Matriks'
    };
    document.getElementById('currentOperation').textContent = titles[operation];
    
    // Tampilkan/sembunyikan matriks B sesuai kebutuhan operasi
    const matrixBContainer = document.getElementById('matrixBContainer');
    if (['transpose', 'determinant', 'inverse'].includes(operation)) {
        matrixBContainer.style.display = 'none';
    } else {
        matrixBContainer.style.display = 'block';
    }
    
    // Validasi dimensi untuk operasi tertentu
    validateDimensionsForOperation();
}

// Validasi dimensi matriks untuk operasi saat ini
function validateDimensionsForOperation() {
    const rowsA = parseInt(document.getElementById('matrixARows').textContent);
    const colsA = parseInt(document.getElementById('matrixACols').textContent);
    const rowsB = parseInt(document.getElementById('matrixBRows').textContent);
    const colsB = parseInt(document.getElementById('matrixBCols').textContent);
    
    switch (currentOperation) {
        case 'add':
        case 'subtract':
            // Untuk penjumlahan dan pengurangan, dimensi matriks harus sama
            if (rowsA !== rowsB || colsA !== colsB) {
                showNotification('Untuk penjumlahan/pengurangan, dimensi kedua matriks harus sama!');
                // Otomatis sesuaikan dimensi matriks B sama dengan A
                document.getElementById('matrixBRows').textContent = rowsA;
                document.getElementById('matrixBCols').textContent = colsA;
                createMatrixInputs('B', rowsA, colsA);
            }
            break;
            
        case 'multiply':
            // Untuk perkalian, jumlah kolom A harus sama dengan jumlah baris B
            if (colsA !== rowsB) {
                showNotification('Untuk perkalian, jumlah kolom matriks A harus sama dengan jumlah baris matriks B!');
                // Otomatis sesuaikan jumlah baris matriks B sama dengan jumlah kolom matriks A
                document.getElementById('matrixBRows').textContent = colsA;
                createMatrixInputs('B', colsA, colsB);
            }
            break;
            
        case 'determinant':
        case 'inverse':
            // Untuk determinan dan invers, matriks harus persegi
            if (rowsA !== colsA) {
                showNotification('Untuk determinan/invers, matriks harus persegi!');
                // Otomatis sesuaikan dimensi matriks A menjadi persegi
                const min = Math.min(rowsA, colsA);
                document.getElementById('matrixARows').textContent = min;
                document.getElementById('matrixACols').textContent = min;
                createMatrixInputs('A', min, min);
            }
            break;
    }
}

// Ganti tema
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('darkTheme').classList.add('active');
        document.getElementById('lightTheme').classList.remove('active');
    } else {
        document.body.classList.remove('dark-theme');
        document.getElementById('lightTheme').classList.add('active');
        document.getElementById('darkTheme').classList.remove('active');
    }
}

// Tampilkan notifikasi
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// FUNGSI OPERASI MATRIKS

// Baca nilai matriks dari input
function getMatrixValues(matrixId) {
    const rows = parseInt(document.getElementById(`matrix${matrixId}Rows`).textContent);
    const cols = parseInt(document.getElementById(`matrix${matrixId}Cols`).textContent);
    const matrix = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const input = document.querySelector(`#matrix${matrixId} input[data-row="${i}"][data-col="${j}"]`);
            // Pastikan nilai adalah bilangan bulat
            row.push(parseInt(input.value) || 0); 
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Jalankan perhitungan berdasarkan operasi yang dipilih
function performCalculation() {
    const matrixA = getMatrixValues('A');
    let result;
    
    try {
        switch (currentOperation) {
            case 'add':
                const matrixB_add = getMatrixValues('B');
                result = addMatrices(matrixA, matrixB_add);
                break;
                
            case 'subtract':
                const matrixB_sub = getMatrixValues('B');
                result = subtractMatrices(matrixA, matrixB_sub);
                break;
                
            case 'multiply':
                const matrixB_mul = getMatrixValues('B');
                result = multiplyMatrices(matrixA, matrixB_mul);
                break;
                
            case 'transpose':
                result = transposeMatrix(matrixA);
                break;
                
            case 'determinant':
                result = calculateDeterminant(matrixA);
                break;
                
            case 'inverse':
                result = inverseMatrix(matrixA);
                break;
        }
        
        displayResult(result);
        
    } catch (error) {
        showNotification(`Error: ${error.message}`);
        console.error(error);
    }
}

// Tampilkan hasil perhitungan
function displayResult(result) {
    const resultContainer = document.getElementById('matrixResult');
    const resultText = document.getElementById('resultText');
    
    if (typeof result === 'number') {
        // Jika hasil berupa angka (determinan)
        resultContainer.innerHTML = `<div class="result-number">${Math.round(result)}</div>`;
        resultText.textContent = `Nilai determinan: ${Math.round(result)}`;
    } else {
        // Jika hasil berupa matriks
        resultContainer.innerHTML = '';
        
        for (let i = 0; i < result.length; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'matrix-row';
            
            for (let j = 0; j < result[i].length; j++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'matrix-cell';
                
                const value = document.createElement('span');
                value.textContent = Math.round(result[i][j]); // Pembulatan ke bilangan bulat
                
                cellDiv.appendChild(value);
                rowDiv.appendChild(cellDiv);
            }
            
            resultContainer.appendChild(rowDiv);
        }
        
        if (currentOperation === 'inverse') {
            resultText.textContent = 'Matriks Invers';
        } else {
            resultText.textContent = 'Hasil Operasi';
        }
    }
}

// FUNGSI MATEMATIS

// Penjumlahan matriks
function addMatrices(matrixA, matrixB) {
    validateSameDimensions(matrixA, matrixB);
    
    const result = [];
    
    for (let i = 0; i < matrixA.length; i++) {
        const row = [];
        for (let j = 0; j < matrixA[0].length; j++) {
            row.push(matrixA[i][j] + matrixB[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

// Pengurangan matriks
function subtractMatrices(matrixA, matrixB) {
    validateSameDimensions(matrixA, matrixB);
    
    const result = [];
    
    for (let i = 0; i < matrixA.length; i++) {
        const row = [];
        for (let j = 0; j < matrixA[0].length; j++) {
            row.push(matrixA[i][j] - matrixB[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

// Perkalian matriks
function multiplyMatrices(matrixA, matrixB) {
    validateMultiplicationDimensions(matrixA, matrixB);
    
    const result = [];
    
    const rowsA = matrixA.length;
    const colsB = matrixB[0].length;
    const common = matrixB.length; // Sama dengan jumlah kolom di A
    
    for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            
            for (let k = 0; k < common; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            
            row.push(sum);
        }
        result.push(row);
    }
    
    return result;
}

// Transpose matriks
function transposeMatrix(matrix) {
    const result = [];
    
    for (let j = 0; j < matrix[0].length; j++) {
        const row = [];
        for (let i = 0; i < matrix.length; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

// Hitung determinan matriks
function calculateDeterminant(matrix) {
    validateSquareMatrix(matrix);
    
    const n = matrix.length;
    
    // Kasus khusus untuk matriks 1x1
    if (n === 1) {
        return matrix[0][0];
    }
    
    // Kasus khusus untuk matriks 2x2
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    // Untuk matriks 3x3 ke atas, gunakan ekspansi kofaktor
    let det = 0;
    
    for (let j = 0; j < n; j++) {
        const minor = getMinor(matrix, 0, j);
        const cofactor = Math.pow(-1, j) * calculateDeterminantValue(minor);
        det += matrix[0][j] * cofactor;
    }
    
    return det;
}

// Mendapatkan minor (submatriks) dari matriks
function getMinor(matrix, row, col) {
    const minor = [];
    const n = matrix.length;
    
    for (let i = 0; i < n; i++) {
        if (i === row) continue;
        
        const newRow = [];
        for (let j = 0; j < n; j++) {
            if (j === col) continue;
            newRow.push(matrix[i][j]);
        }
        
        minor.push(newRow);
    }
    
    return minor;
}

// Hitung nilai determinan (tanpa langkah)
function calculateDeterminantValue(matrix) {
    const n = matrix.length;
    
    if (n === 1) {
        return matrix[0][0];
    }
    
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let j = 0; j < n; j++) {
        const minor = getMinor(matrix, 0, j);
        const cofactor = Math.pow(-1, j) * calculateDeterminantValue(minor);
        det += matrix[0][j] * cofactor;
    }
    
    return det;
}

// Hitung invers matriks
function inverseMatrix(matrix) {
    validateSquareMatrix(matrix);
    
    const n = matrix.length;
    const det = calculateDeterminantValue(matrix);
    
    if (Math.abs(det) < 1e-10) {
        throw new Error('Matriks ini tidak memiliki invers karena determinannya nol');
    }
    
    // Untuk matriks 1x1, inversnya langsung 1/nilai
    if (n === 1) {
        return [[1 / matrix[0][0]]];
    }
    
    // Untuk matriks 2x2 dan lebih besar, gunakan metode adjoin
    
    // Hitung matriks kofaktor
    const cofactors = [];
    for (let i = 0; i < n; i++) {
        const cofactorRow = [];
        for (let j = 0; j < n; j++) {
            const minor = getMinor(matrix, i, j);
            const cofactor = Math.pow(-1, i + j) * calculateDeterminantValue(minor);
            cofactorRow.push(cofactor);
        }
        cofactors.push(cofactorRow);
    }
    
    // Transpose matriks kofaktor untuk mendapatkan adjoin
    const adjoin = [];
    for (let j = 0; j < n; j++) {
        const row = [];
        for (let i = 0; i < n; i++) {
            row.push(cofactors[i][j]);
        }
        adjoin.push(row);
    }
    
    // Bagi adjoin dengan determinan untuk mendapatkan invers
    const result = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(adjoin[i][j] / det);
        }
        result.push(row);
    }
    
    return result;
}

// FUNGSI VALIDASI

// Validasi bahwa dua matriks memiliki dimensi yang sama
function validateSameDimensions(matrixA, matrixB) {
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error('Dimensi kedua matriks harus sama untuk operasi penjumlahan/pengurangan');
    }
}

// Validasi bahwa dimensi valid untuk perkalian matriks
function validateMultiplicationDimensions(matrixA, matrixB) {
    if (matrixA[0].length !== matrixB.length) {
        throw new Error('Jumlah kolom matriks A harus sama dengan jumlah baris matriks B untuk perkalian');
    }
}

// Validasi bahwa matriks adalah matriks persegi
function validateSquareMatrix(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error('Matriks harus persegi (jumlah baris = jumlah kolom)');
    }
}
