// Variabel untuk menyimpan matriks
let matrixA = [];
let matrixB = [];
let matrixResult = [];

// Elemen DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi event listeners
    document.getElementById('create-matrices').addEventListener('click', createMatrices);
    document.getElementById('randomize-A').addEventListener('click', () => randomizeMatrix('A'));
    document.getElementById('randomize-B').addEventListener('click', () => randomizeMatrix('B'));
    document.getElementById('clear-A').addEventListener('click', () => clearMatrix('A'));
    document.getElementById('clear-B').addEventListener('click', () => clearMatrix('B'));
    
    // Tambahkan event listener untuk semua operasi
    document.getElementById('add').addEventListener('click', addMatrices);
    document.getElementById('subtract').addEventListener('click', subtractMatrices);
    document.getElementById('multiply').addEventListener('click', multiplyMatrices);
    document.getElementById('transpose-A').addEventListener('click', () => transposeMatrix('A'));
    document.getElementById('transpose-B').addEventListener('click', () => transposeMatrix('B'));
    document.getElementById('determinant-A').addEventListener('click', () => calculateDeterminant('A'));
    document.getElementById('determinant-B').addEventListener('click', () => calculateDeterminant('B'));
    document.getElementById('inverse-A').addEventListener('click', () => calculateInverse('A'));
    document.getElementById('inverse-B').addEventListener('click', () => calculateInverse('B'));
    document.getElementById('scalar-multiply-A').addEventListener('click', () => scalarMultiply('A'));
    document.getElementById('scalar-multiply-B').addEventListener('click', () => scalarMultiply('B'));
    
    // Buat matriks awal dengan ukuran default
    createMatrices();
});

// Fungsi untuk membuat matriks
function createMatrices() {
    const rowsA = parseInt(document.getElementById('matrixA-rows').value);
    const colsA = parseInt(document.getElementById('matrixA-cols').value);
    const rowsB = parseInt(document.getElementById('matrixB-rows').value);
    const colsB = parseInt(document.getElementById('matrixB-cols').value);
    
    // Validasi input
    if (rowsA < 1 || colsA < 1 || rowsB < 1 || colsB < 1 || 
        rowsA > 10 || colsA > 10 || rowsB > 10 || colsB > 10) {
        alert('Dimensi matriks harus antara 1 dan 10');
        return;
    }
    
    // Generate matriks A
    createMatrixTable('A', rowsA, colsA);
    
    // Generate matriks B
    createMatrixTable('B', rowsB, colsB);
    
    // Sembunyikan hasil sebelumnya
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('steps-container').style.display = 'none';
    
    // Update validasi tombol
    updateOperationButtonsState();
}

// Fungsi untuk membuat tabel matriks
function createMatrixTable(matrixId, rows, cols) {
    const matrixContainer = document.getElementById(`matrix${matrixId}`);
    matrixContainer.innerHTML = '';
    
    const table = document.createElement('table');
    table.className = 'matrix-table';
    
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `matrix${matrixId}-${i}-${j}`;
            input.value = '0';
            input.addEventListener('input', updateOperationButtonsState);
            
            td.appendChild(input);
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
    
    matrixContainer.appendChild(table);
}

// Fungsi untuk mendapatkan nilai matriks dari input
function getMatrixValues(matrixId, rows, cols) {
    const matrix = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`matrix${matrixId}-${i}-${j}`).value);
            row.push(isNaN(value) ? 0 : value);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Fungsi untuk mengisi matriks dengan nilai acak
function randomizeMatrix(matrixId) {
    const rows = parseInt(document.getElementById(`matrix${matrixId}-rows`).value);
    const cols = parseInt(document.getElementById(`matrix${matrixId}-cols`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Nilai random antara -10 dan 10
            const randomValue = Math.floor(Math.random() * 21) - 10;
            document.getElementById(`matrix${matrixId}-${i}-${j}`).value = randomValue;
        }
    }
    
    updateOperationButtonsState();
}

// Fungsi untuk mengosongkan matriks (isi dengan 0)
function clearMatrix(matrixId) {
    const rows = parseInt(document.getElementById(`matrix${matrixId}-rows`).value);
    const cols = parseInt(document.getElementById(`matrix${matrixId}-cols`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(`matrix${matrixId}-${i}-${j}`).value = '0';
        }
    }
    
    updateOperationButtonsState();
}

// Fungsi untuk menampilkan hasil
function displayResult(result, operationType, steps = '') {
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('result-operation-type').textContent = `Operasi: ${operationType}`;
    
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.innerHTML = '';
    
    if (Array.isArray(result) && Array.isArray(result[0])) {
        // Hasil berupa matriks
        const table = document.createElement('table');
        table.className = 'matrix-table';
        
        for (let i = 0; i < result.length; i++) {
            const tr = document.createElement('tr');
            
            for (let j = 0; j < result[i].length; j++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = parseFloat(result[i][j].toFixed(4));
                input.readOnly = true;
                
                td.appendChild(input);
                tr.appendChild(td);
            }
            
            table.appendChild(tr);
        }
        
        const resultMatrixDiv = document.createElement('div');
        resultMatrixDiv.className = 'result-matrix';
        resultMatrixDiv.appendChild(table);
        resultDisplay.appendChild(resultMatrixDiv);
    } else {
        // Hasil berupa nilai skalar
        const resultValue = document.createElement('div');
        resultValue.className = 'result-value';
        resultValue.textContent = parseFloat(result.toFixed(4));
        resultDisplay.appendChild(resultValue);
    }
    
    // Tampilkan langkah penyelesaian jika ada
    if (steps) {
        document.getElementById('steps-container').style.display = 'block';
        document.getElementById('steps').textContent = steps;
    } else {
        document.getElementById('steps-container').style.display = 'none';
    }
}

// Fungsi untuk memperbarui status tombol operasi
function updateOperationButtonsState() {
    const rowsA = parseInt(document.getElementById('matrixA-rows').value);
    const colsA = parseInt(document.getElementById('matrixA-cols').value);
    const rowsB = parseInt(document.getElementById('matrixB-rows').value);
    const colsB = parseInt(document.getElementById('matrixB-cols').value);
    
    // Validasi operasi penjumlahan dan pengurangan
    const canAddSubtract = rowsA === rowsB && colsA === colsB;
    document.getElementById('add').disabled = !canAddSubtract;
    document.getElementById('subtract').disabled = !canAddSubtract;
    
    // Validasi operasi perkalian
    const canMultiply = colsA === rowsB;
    document.getElementById('multiply').disabled = !canMultiply;
    
    // Validasi determinan dan invers (hanya untuk matriks persegi)
    const isASquare = rowsA === colsA;
    const isBSquare = rowsB === colsB;
    document.getElementById('determinant-A').disabled = !isASquare;
    document.getElementById('determinant-B').disabled = !isBSquare;
    document.getElementById('inverse-A').disabled = !isASquare;
    document.getElementById('inverse-B').disabled = !isBSquare;
}

// Operasi penjumlahan matriks
function addMatrices() {
    const rowsA = parseInt(document.getElementById('matrixA-rows').value);
    const colsA = parseInt(document.getElementById('matrixA-cols').value);
    const matrixA = getMatrixValues('A', rowsA, colsA);
    const matrixB = getMatrixValues('B', rowsA, colsA);
    
    const result = [];
    let steps = "Langkah-langkah penjumlahan matriks:\n\n";
    steps += "Untuk menjumlahkan dua matriks, kita tambahkan elemen yang bersesuaian:\n\n";
    
    for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsA; j++) {
            const sum = matrixA[i][j] + matrixB[i][j];
            row.push(sum);
            steps += `C[${i+1}][${j+1}] = A[${i+1}][${j+1}] + B[${i+1}][${j+1}] = ${matrixA[i][j]} + ${matrixB[i][j]} = ${sum}\n`;
        }
        result.push(row);
    }
    
    displayResult(result, 'A + B', steps);
}

// Operasi pengurangan matriks
function subtractMatrices() {
    const rowsA = parseInt(document.getElementById('matrixA-rows').value);
    const colsA = parseInt(document.getElementById('matrixA-cols').value);
    const matrixA = getMatrixValues('A', rowsA, colsA);
    const matrixB = getMatrixValues('B', rowsA, colsA);
    
    const result = [];
    let steps = "Langkah-langkah pengurangan matriks:\n\n";
    steps += "Untuk mengurangkan dua matriks, kita kurangkan elemen yang bersesuaian:\n\n";
    
    for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsA; j++) {
            const diff = matrixA[i][j] - matrixB[i][j];
            row.push(diff);
            steps += `C[${i+1}][${j+1}] = A[${i+1}][${j+1}] - B[${i+1}][${j+1}] = ${matrixA[i][j]} - ${matrixB[i][j]} = ${diff}\n`;
        }
        result.push(row);
    }
    
    displayResult(result, 'A - B', steps);
}

// Operasi perkalian matriks
function multiplyMatrices() {
    const rowsA = parseInt(document.getElementById('matrixA-rows').value);
    const colsA = parseInt(document.getElementById('matrixA-cols').value);
    const colsB = parseInt(document.getElementById('matrixB-cols').value);
    const matrixA = getMatrixValues('A', rowsA, colsA);
    const matrixB = getMatrixValues('B', colsA, colsB);
    
    const result = [];
    let steps = "Langkah-langkah perkalian matriks:\n\n";
    steps += "Untuk perkalian matriks A × B, setiap elemen dari hasil perkalian adalah jumlah dari hasil perkalian baris dari A dengan kolom dari B yang bersesuaian:\n\n";
    
    for (let i = 0; i < rowsA; i++) {
        const row = [];
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            let stepDetails = `C[${i+1}][${j+1}] = `;
            
            for (let k = 0; k < colsA; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
                stepDetails += `${k > 0 ? ' + ' : ''}(A[${i+1}][${k+1}] × B[${k+1}][${j+1}]) = ${k > 0 ? ' + ' : ''}(${matrixA[i][k]} × ${matrixB[k][j]})`;
            }
            
            stepDetails += ` = ${sum}\n`;
            steps += stepDetails;
            row.push(sum);
        }
        result.push(row);
    }
    
    displayResult(result, 'A × B', steps);
}

// Operasi transpose matriks
function transposeMatrix(matrixId) {
    const rows = parseInt(document.getElementById(`matrix${matrixId}-rows`).value);
    const cols = parseInt(document.getElementById(`matrix${matrixId}-cols`).value);
    const matrix = getMatrixValues(matrixId, rows, cols);
    
    const result = [];
    let steps = `Langkah-langkah transpose matriks ${matrixId}:\n\n`;
    steps += "Untuk mentranspose sebuah matriks, kita menukar baris dan kolom:\n\n";
    
    for (let j = 0; j < cols; j++) {
        const row = [];
        for (let i = 0; i < rows; i++) {
            row.push(matrix[i][j]);
            steps += `Transpose[${j+1}][${i+1}] = ${matrixId}[${i+1}][${j+1}] = ${matrix[i][j]}\n`;
        }
        result.push(row);
    }
    
    displayResult(result, `Transpose ${matrixId}`, steps);
}

// Fungsi untuk menghitung determinan
function calculateDeterminant(matrixId) {
    const size = parseInt(document.getElementById(`matrix${matrixId}-rows`).value);
    const matrix = getMatrixValues(matrixId, size, size);
    
    let steps = `Langkah-langkah perhitungan determinan matriks ${matrixId}:\n\n`;
    const { determinant, detailSteps } = determinantWithSteps(matrix, steps);
    
    displayResult(determinant, `Determinan ${matrixId}`, detailSteps);
}

// Fungsi untuk menghitung determinan dengan langkah-langkah
function determinantWithSteps(matrix, steps = '') {
    const n = matrix.length;
    
    // Kasus dasar: matriks 1x1
    if (n === 1) {
        steps += `Determinan matriks 1×1 = ${matrix[0][0]}\n`;
        return { determinant: matrix[0][0], detailSteps: steps };
    }
    
    // Kasus dasar: matriks 2x2
    if (n === 2) {
        const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        steps += `Determinan matriks 2×2 = (${matrix[0][0]} × ${matrix[1][1]}) - (${matrix[0][1]} × ${matrix[1][0]}) = ${det}\n`;
        return { determinant: det, detailSteps: steps };
    }
    
    // Ekspansi Kofaktor untuk matriks yang lebih besar
    steps += "Menggunakan ekspansi kofaktor untuk matriks yang lebih besar:\n\n";
    let det = 0;
    
    for (let j = 0; j < n; j++) {
        // Buat submatriks tanpa baris pertama dan kolom j
        const subMatrix = [];
        for (let i = 1; i < n; i++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                if (k !== j) {
                    row.push(matrix[i][k]);
                }
            }
            if (row.length > 0) {
                subMatrix.push(row);
            }
        }
        
        steps += `Submatrik dengan menghilangkan baris 1 dan kolom ${j+1}:\n`;
        subMatrix.forEach((row, rowIdx) => {
            steps += `[ ${row.join(' ')} ]\n`;
        });
        
        // Hitung determinan submatriks
        const { determinant: subDet } = determinantWithSteps(subMatrix);
        const cofactor = Math.pow(-1, j) * subDet;
        const term = matrix[0][j] * cofactor;
        
        steps += `Kofaktor: (-1)^(1+${j+1}) × det(submatriks) = ${cofactor}\n`;
        steps += `Term ke-${j+1}: ${matrix[0][j]} × ${cofactor} = ${term}\n\n`;
        
        det += term;
    }
    
    steps += `Determinan = ${det}\n`;
    return { determinant: det, detailSteps: steps };
}

// Fungsi untuk menghitung invers matriks
function calculateInverse(matrixId) {
    const size = parseInt(document.getElementById(`matrix${matrixId}-rows`).value);
    const matrix = getMatrixValues(matrixId, size, size);
    
    let steps = `Langkah-langkah perhitungan invers matriks ${matrixId}:\n\n`;
    
    // Langkah 1: Hitung determinan
    const { determinant, detailSteps } = determinantWithSteps(matrix);
    steps += "Langkah 1: Menghitung determinan matriks\n";
    steps += detailSteps;
    
    // Jika determinan = 0, matriks tidak memiliki invers
    if (Math.abs(determinant) < 1e-10) {
        steps += "\nDeterminan matriks = 0 atau mendekati 0, sehingga matriks tidak memiliki invers.";
        displayResult("Tidak memiliki invers (determinan = 0)", `Invers ${matrixId}`, steps);
        return;
    }
    
    // Langkah 2: Menghitung matriks kofaktor
    steps += "\nLangkah 2: Menghitung matriks kofaktor\n\n";
    const cofactorMatrix = [];
    
    for (let i = 0; i < size; i++) {
        const cofactorRow = [];
        for (let j = 0; j < size; j++) {
            // Buat submatriks dengan menghilangkan baris i dan kolom j
            const subMatrix = [];
            for (let r = 0; r < size; r++) {
                if (r !== i) {
                    const row = [];
                    for (let c = 0; c < size; c++) {
                        if (c !== j) {
                            row.push(matrix[r][c]);
                        }
                    }
                    subMatrix.push(row);
                }
            }
            
            // Hitung minor
            const { determinant: minor } = determinantWithSteps(subMatrix);
            
            // Hitung kofaktor
            const cofactor = Math.pow(-1, i + j) * minor;
            cofactorRow.push(cofactor);
            
            steps += `Kofaktor[${i+1}][${j+1}] = (-1)^(${i+1}+${j+1}) × det(submatriks) = ${cofactor}\n`;
        }
        cofactorMatrix.push(cofactorRow);
    }
    
    // Langkah 3: Transpose matriks kofaktor
    steps += "\nLangkah 3: Transpose matriks kofaktor\n\n";
    const adjointMatrix = [];
    
    for (let j = 0; j < size; j++) {
        const adjointRow = [];
        for (let i = 0; i < size; i++) {
            adjointRow.push(cofactorMatrix[i][j]);
            steps += `Adjoint[${j+1}][${i+1}] = Kofaktor[${i+1}][${j+1}] = ${cofactorMatrix[i][j]}\n`;
        }
        adjointMatrix.push(adjointRow);
    }
    
    // Langkah 4: Bagi dengan determinan
    steps += "\nLangkah 4: Bagi setiap elemen matriks adjoint dengan determinan\n\n";
    const inverseMatrix = [];
    
    for (let i = 0; i < size; i++) {
        const inverseRow = [];
        for (let j = 0; j < size; j++) {
            const inverseElement = adjointMatrix[i][j] / determinant;
            inverseRow.push(inverseElement);
            steps += `Invers[${i+1}][${j+1}] = Adjoint[${i+1}][${j+1}] / determinan = ${adjointMatrix[i][j]} / ${determinant} = ${inverseElement}\n`;
        }
        inverseMatrix.push(inverseRow);
    }
    
    displayResult(inverseMatrix, `Invers ${matrixId}`, steps);
}

// Fungsi untuk perkalian skalar
function scalarMultiply(matrixId) {
    const rows = parseInt(document.getElementById(`matrix${matrixId}-rows`).value);
    const cols = parseInt(document.getElementById(`matrix${matrixId}-cols`).value);
    const matrix = getMatrixValues(matrixId, rows, cols);
    const scalar = parseFloat(document.getElementById('scalar-value').value);
    
    if (isNaN(scalar)) {
        alert('Masukkan nilai skalar yang valid');
        return;
    }
    
    const result = [];
    let steps = `Langkah-langkah perkalian skalar dengan matriks ${matrixId}:\n\n`;
    steps += `Untuk mengalikan matriks dengan skalar ${scalar}, kita kalikan setiap elemen dengan nilai skalar:\n\n`;
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const product = scalar * matrix[i][j];
            row.push(product);
            steps += `Hasil[${i+1}][${j+1}] = ${scalar} × ${matrixId}[${i+1}][${j+1}] = ${scalar} × ${matrix[i][j]} = ${product}\n`;
        }
        result.push(row);
    }
    
    displayResult(result, `${scalar} × ${matrixId}`, steps);
}
