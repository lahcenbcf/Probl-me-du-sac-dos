function addObject() {
    const objectsList = document.getElementById('objects-list');
    const newObject = document.createElement('div');
    newObject.className = 'object-item';
    newObject.innerHTML = `
        <input type="number" placeholder="Poids" class="weight" min="1" required>
        <input type="number" placeholder="Valeur" class="value" min="1" required>
    `;
    objectsList.appendChild(newObject);
}

function validateInputs() {
    const capacity = document.getElementById('capacity').value;
    const weights = document.getElementsByClassName('weight');
    const values = document.getElementsByClassName('value');
    const error = document.getElementById('error');
    
    if (!capacity || capacity <= 0) {
        error.textContent = "Veuillez entrer une capacité valide";
        error.style.display = "block";
        return false;
    }

    for (let i = 0; i < weights.length; i++) {
        if (!weights[i].value || !values[i].value || 
            weights[i].value <= 0 || values[i].value <= 0) {
            error.textContent = "Veuillez remplir tous les champs avec des valeurs positives";
            error.style.display = "block";
            return false;
        }
    }

    error.style.display = "none";
    return true;
}

function knapsackSolver(capacity, weights, values) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    const selected = new Set();

    // Remplir la table dp
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(
                    values[i-1] + dp[i-1][w-weights[i-1]],
                    dp[i-1][w]
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }

    // Retrouver les objets sélectionnés
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i-1][w]) {
            selected.add(i-1);
            w -= weights[i-1];
        }
    }

    return {
        maxValue: dp[n][capacity],
        selected: selected
    };
}

function solve() {
    if (!validateInputs()) return;

    const capacity = parseInt(document.getElementById('capacity').value);
    const weightInputs = document.getElementsByClassName('weight');
    const valueInputs = document.getElementsByClassName('value');
    
    const weights = Array.from(weightInputs).map(input => parseInt(input.value));
    const values = Array.from(valueInputs).map(input => parseInt(input.value));

    const solution = knapsackSolver(capacity, weights, values);
    const result = document.getElementById('result');

    let resultHTML = `
        <h3>Solution optimale:</h3>
        <p>Valeur maximale: ${solution.maxValue}</p>
        <p>Objets sélectionnés:</p>
        <ul>
    `;

    solution.selected.forEach(index => {
        resultHTML += `
            <li>Objet ${index + 1}: Poids = ${weights[index]}, Valeur = ${values[index]}</li>
        `;
    });

    resultHTML += '</ul>';
    result.innerHTML = resultHTML;
    result.style.display = 'block';
}