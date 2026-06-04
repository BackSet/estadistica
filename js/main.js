function showExercise(id) {
    const container = document.getElementById('exercise-container');
    const ex = exercises[id];
    
    if (!ex) return;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick')?.includes(id)) btn.classList.add('active');
    });

    let html = `
        <section id="${id}" class="${ex.type === 'grouped' ? 'grouped-section' : ''}">
            <div class="header-row">
                <h2><span class="exercise-number">${ex.number}</span> ${ex.title}</h2>
                <button class="print-btn" onclick="printSingle('${id}')">📄 PDF</button>
            </div>
    `;

    if (ex.context) {
        html += `
            <div class="context-box">
                <h3>${ex.context.title}</h3>
                <p>${ex.context.text}</p>
            </div>
        `;
    }

    html += `
        <div class="data-display">
            <div class="data-label">${ex.label || 'Datos'}:</div>
            <div class="data-values">${ex.data}</div>
        </div>
    `;

    if (ex.type === 'frequency') {
        html += renderFrequencyTable(ex);
    } else if (ex.type === 'central_tendency') {
        html += renderCentralTendency(ex);
    } else if (ex.type === 'grouped') {
        html += renderGroupedData(ex);
    }

    if (ex.chart) {
        html += `<div class="chart-container">`;
        ex.chart.forEach(bar => {
            html += `
                <div class="bar" style="height:${bar.height}">
                    <span class="bar-value">${bar.value}</span>
                    <span class="bar-label">${bar.label}</span>
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `</section>`;
    container.innerHTML = html;
}

function renderFrequencyTable(ex) {
    let html = `<div class="calculation-steps">`;
    ex.steps.forEach(s => {
        html += `<div class="step"><div class="step-number">${s.n}</div><div class="step-content">${s.text}</div></div>`;
    });
    html += `</div>`;

    html += `<table><thead><tr>`;
    ex.table.headers.forEach(h => html += `<th>${h}</th>`);
    html += `</tr></thead><tbody>`;
    ex.table.rows.forEach(r => {
        html += `<tr>${r.vals.map(v => `<td>${v}</td>`).join('')}</tr>`;
    });
    html += `</tbody></table>`;

    html += `<div class="result-box"><div class="result-title">${ex.result.title}</div><div class="result-value">${ex.result.value}</div></div>`;
    return html;
}

function renderCentralTendency(ex) {
    let html = '';
    
    // Media
    const mean = ex.calculations.mean;
    html += `
        <div class="result-box">
            <div class="result-title">📊 MEDIA ARITMÉTICA</div>
            <div class="formula">${mean.formula}</div>
            <div class="calculation-steps">
                ${mean.steps.map(s => `<div class="step"><div class="step-number">${s.n}</div><div class="step-content">${s.text}</div></div>`).join('')}
            </div>
            <div class="result-value">${mean.value}</div>
        </div>
    `;

    // Moda
    const mode = ex.calculations.mode;
    html += `
        <div class="result-box">
            <div class="result-title">🎯 ${mode.title}</div>
            <div class="calculation-steps">
                ${mode.steps.map(s => `<div class="step"><div class="step-number">${s.n}</div><div class="step-content">${s.text}</div></div>`).join('')}
            </div>
            <div class="result-value">${mode.value}</div>
        </div>
    `;

    // Mediana
    const median = ex.calculations.median;
    html += `
        <div class="result-box">
            <div class="result-title">📍 ${median.title}</div>
            <div class="calculation-steps">
                ${median.steps.map(s => `<div class="step"><div class="step-number">${s.n}</div><div class="step-content">${s.text}</div></div>`).join('')}
            </div>
            <div class="result-value">${median.value}</div>
        </div>
    `;

    html += `
        <div class="summary-grid">
            <div class="summary-card"><div class="summary-label">Media</div><div class="summary-value">${ex.summary.media}</div></div>
            <div class="summary-card"><div class="summary-label">Moda</div><div class="summary-value">${ex.summary.moda}</div></div>
            <div class="summary-card"><div class="summary-label">Mediana</div><div class="summary-value">${ex.summary.mediana}</div></div>
        </div>
    `;
    return html;
}

function renderGroupedData(ex) {
    let html = '';
    ex.process.forEach((p, index) => {
        html += `
            <div class="process-step">
                <h4>${p.title}</h4>
                ${p.formula ? `<div class="formula">${p.formula}</div>` : ''}
                ${p.explanation ? `<div class="explain-box"><strong>¿Por qué?</strong> ${p.explanation}</div>` : ''}
                ${p.intervalLogic ? `<div class="interval-explain"><span class="range-val">150</span> + 50 = <span class="range-val">199</span> → 150-199</div>` : ''}
                ${p.steps ? `
                    <div class="calculation-steps">
                        ${p.steps.map(s => `<div class="step"><div class="step-number">${s.n}</div><div class="step-content">${s.text}</div></div>`).join('')}
                    </div>
                ` : ''}
                ${p.table ? `
                    <table>
                        <thead><tr>${p.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                        <tbody>
                            ${p.table.rows.map(r => `<tr>${r.vals.map((v,i) => `<td class="${r.marker && i === 1 ? 'marker-cell' : ''}">${v}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>
                ` : ''}
                ${p.calculationTable ? `
                    <table>
                        <thead><tr>${p.calculationTable.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                        <tbody>
                            ${p.calculationTable.rows.map(r => `<tr>${r.vals.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}
                            <tr style="background:rgba(254,202,87,0.2);"><td><strong>TOTAL</strong></td><td></td><td class="calc-highlight"><strong>${p.calculationTable.totalXifi}</strong></td></tr>
                        </tbody>
                    </table>
                ` : ''}
                ${p.result ? `
                    <div class="result-box">
                        <div class="result-title">CÁLCULO FINAL</div>
                        <div class="formula">${p.result.calculation}</div>
                        <div class="result-value">${p.result.value}</div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    return html;
}

function printSingle(id) {
    const activeId = document.querySelector('.nav-btn.active')?.getAttribute('onclick')?.match(/'([^']+)'/)[1];
    
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if(target) target.style.display = 'block';
    
    window.print();
    
    setTimeout(() => {
        document.querySelectorAll('section').forEach(s => s.style.display = '');
        showExercise(activeId || 'ex1');
    }, 100);
}

window.onload = () => showExercise('ex1');
