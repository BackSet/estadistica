const exercises = {
    ex1: {
        id: 'ex1',
        title: 'Tabla de Frecuencias - Horas de Voluntariado',
        number: '1',
        data: '2, 4, 6, 4, 8, 2, 6, 4, 10, 6, 2, 8, 4, 6, 2',
        n: 15,
        label: 'Horas de voluntariado semanal',
        type: 'frequency',
        table: {
            headers: ['Horas (xi)', 'fi', 'fi/n', '%', 'Fac'],
            rows: [
                { vals: ['2', '4', '0.267', '26.7%', '4'] },
                { vals: ['4', '4', '0.267', '26.7%', '8'] },
                { vals: ['6', '4', '0.267', '26.7%', '12'] },
                { vals: ['8', '2', '0.133', '13.3%', '14'] },
                { vals: ['10', '1', '0.067', '6.7%', '15'] },
            ]
        },
        steps: [
            { n: 1, text: 'Contar cada valor: 2→4 veces, 4→4 veces, 6→4 veces, 8→2 veces, 10→1 vez' },
            { n: 2, text: 'Frecuencia relativa: fi/n = fi/15' },
            { n: 3, text: 'Frecuencia acumulada: ir sumando las frecuencias absolutas' },
        ],
        result: {
            title: '✓ Verificación: Σfi = 15 = n',
            value: 'Σfi = 15'
        },
        chart: [
            { label: '2', value: 4, height: '70%' },
            { label: '4', value: 4, height: '70%' },
            { label: '6', value: 4, height: '70%' },
            { label: '8', value: 2, height: '35%' },
            { label: '10', value: 1, height: '18%' },
        ]
    },
    ex2: {
        id: 'ex2',
        title: 'Tabla de Frecuencias - Integrantes por Familia',
        number: '2',
        data: '5, 3, 4, 3, 6, 4, 5, 3, 4, 2, 7, 3, 4, 5, 6, 4, 3, 5, 4, 3',
        n: 20,
        label: 'Integrantes por hogar',
        type: 'frequency',
        table: {
            headers: ['Integrantes', 'fi', 'fi/n', '%', 'Fac'],
            rows: [
                { vals: ['2', '1', '0.05', '5%', '1'] },
                { vals: ['3', '5', '0.25', '25%', '6'] },
                { vals: ['4', '5', '0.25', '25%', '11'] },
                { vals: ['5', '4', '0.20', '20%', '15'] },
                { vals: ['6', '3', '0.15', '15%', '18'] },
                { vals: ['7', '2', '0.10', '10%', '20'] },
            ]
        },
        steps: [
            { n: 1, text: 'Ordenar y contar: 2(1), 3(5), 4(5), 5(4), 6(3), 7(2)' },
            { n: 2, text: 'Calcular fi/n para obtener frecuencia relativa' },
            { n: 3, text: 'Suma acumulativa para Fac' },
        ],
        result: {
            title: '✓ Verificación: Σfi = 20 = n',
            value: 'Σfi = 20'
        },
        chart: [
            { label: '2', value: 1, height: '18%' },
            { label: '3', value: 5, height: '88%' },
            { label: '4', value: 5, height: '88%' },
            { label: '5', value: 4, height: '70%' },
            { label: '6', value: 3, height: '53%' },
            { label: '7', value: 2, height: '35%' },
        ]
    },
    exa: {
        id: 'exa',
        title: 'Media, Mediana y Moda - Edades',
        number: 'A',
        data: '20, 21, 22, 23, 21, 24, 22, 25, 23, 22, 21, 24, 26, 22, 23',
        n: 15,
        label: 'Edades de estudiantes',
        type: 'central_tendency',
        calculations: {
            mean: {
                formula: 'x̄ = Σxi / n',
                steps: [
                    { n: 1, text: 'Suma total: 339' },
                    { n: 2, text: 'División: 339 ÷ 15 = 22.6' },
                ],
                value: '22.6 años'
            },
            mode: {
                title: 'Moda (Valor más frecuente)',
                steps: [
                    { n: 1, text: 'Contar frecuencias: 22 aparece 4 veces' },
                ],
                value: '22 años'
            },
            median: {
                title: 'Mediana (Valor central)',
                steps: [
                    { n: 1, text: 'Ordenar datos y buscar posición (15+1)/2 = 8ª' },
                    { n: 2, text: 'Valor en posición 8: 22' },
                ],
                value: '22 años'
            }
        },
        summary: {
            media: '22.6',
            moda: '22',
            mediana: '22'
        }
    },
    exb: {
        id: 'exb',
        title: 'Media, Mediana y Moda - Investigación Social',
        number: 'B',
        data: '1, 2, 3, 2, 4, 5, 3, 2, 1, 0, 3, 4, 2, 5, 1, 2',
        n: 16,
        label: 'Datos de investigación social',
        type: 'central_tendency',
        calculations: {
            mean: {
                formula: 'x̄ = Σxi / n',
                steps: [
                    { n: 1, text: 'Suma total: 40' },
                    { n: 2, text: 'División: 40 ÷ 16 = 2.5' },
                ],
                value: '2.5'
            },
            mode: {
                title: 'Moda',
                steps: [
                    { n: 1, text: 'El valor 2 aparece 5 veces' },
                ],
                value: '2'
            },
            median: {
                title: 'Mediana',
                steps: [
                    { n: 1, text: 'Ordenar y promediar posiciones 8ª y 9ª' },
                    { n: 2, text: 'Valor: (2 + 2) / 2 = 2' },
                ],
                value: '2'
            }
        },
        summary: {
            media: '2.5',
            moda: '2',
            mediana: '2'
        }
    },
    exc: {
        id: 'exc',
        title: 'Media, Mediana y Moda - Evaluación Diagnóstica',
        number: 'C',
        data: '7, 8, 9, 6, 7, 8, 10, 9, 7, 8, 6, 8, 10, 8',
        n: 14,
        label: 'Puntajes de evaluación',
        type: 'central_tendency',
        calculations: {
            mean: {
                formula: 'x̄ = Σxi / n',
                steps: [
                    { n: 1, text: 'Suma total: 110' },
                    { n: 2, text: 'División: 110 ÷ 14 = 7.86' },
                ],
                value: '7.86'
            },
            mode: {
                title: 'Moda',
                steps: [
                    { n: 1, text: 'El valor 8 aparece 5 veces' },
                ],
                value: '8'
            },
            median: {
                title: 'Mediana',
                steps: [
                    { n: 1, text: 'Posición 7.5: promedio de 8 y 8' },
                    { n: 2, text: 'Valor: 8' },
                ],
                value: '8'
            }
        },
        summary: {
            media: '7.86',
            moda: '8',
            mediana: '8'
        }
    },
    grouped: {
        id: 'grouped',
        title: 'Datos Agrupados - Ingreso Familiar (USD)',
        number: '★',
        featured: true,
        context: {
            title: 'Contexto: Trabajo Social Ecuador',
            text: 'Ingreso mensual familiar en USD de 80 familias atendidas en Quito.'
        },
        data: 'Valores entre 150 y 550 USD',
        n: 80,
        type: 'grouped',
        process: [
            {
                title: 'PASO 1: RANGO',
                formula: 'Rango = Máx - Mín = 550 - 150 = 400',
                explanation: 'Mide la dispersión total de los datos.',
                steps: [
                    { n: 1, text: 'Valor máximo = 550' },
                    { n: 2, text: 'Valor mínimo = 150' },
                    { n: 3, text: 'Rango = 400' },
                ]
            },
            {
                title: 'PASO 2: Intervalos (K)',
                formula: 'K = 1 + 3.322 log(n) = 1 + 3.322(1.9) = 7.32 ≈ 8',
                explanation: 'Determina el número óptimo de grupos usando Regla de Sturges.',
                steps: [
                    { n: 1, text: 'n = 80' },
                    { n: 2, text: 'log(80) = 1.9' },
                    { n: 3, text: 'K = 7.32, redondeamos a 8' },
                ]
            },
            {
                title: 'PASO 3: Amplitud (C)',
                formula: 'C = Rango / K = 400 / 8 = 50',
                explanation: 'Tamaño de cada intervalo.',
                steps: [
                    { n: 1, text: 'Dividir rango entre K: 400 ÷ 8 = 50' },
                ]
            },
            {
                title: 'PASO 4: Construcción de Intervalos',
                explanation: 'Se comienza desde el mínimo y se suma la amplitud.',
                intervalLogic: '150 + 50 = 200, entonces el límite superior es 199.',
                table: {
                    headers: ['Intervalo', 'xi', 'fi', 'fi/n', 'Fi'],
                    rows: [
                        { vals: ['150-199', '175', '4', '0.05', '4'], marker: false },
                        { vals: ['200-249', '225', '6', '0.075', '10'], marker: false },
                        { vals: ['250-299', '275', '14', '0.175', '24'], marker: true },
                        { vals: ['300-349', '325', '12', '0.15', '36'], marker: false },
                        { vals: ['350-399', '375', '18', '0.225', '54'], marker: true },
                        { vals: ['400-449', '425', '14', '0.175', '68'], marker: false },
                        { vals: ['450-499', '475', '8', '0.10', '76'], marker: false },
                        { vals: ['500-549', '525', '4', '0.05', '80'], marker: false },
                    ]
                }
            },
            {
                title: 'PASO 5: MEDIA',
                formula: 'x̄ = Σ(xi × fi) / n',
                explanation: 'xi representa el punto medio de cada intervalo.',
                calculationTable: {
                    headers: ['xi', 'fi', 'xi×fi'],
                    rows: [
                        { vals: ['175', '4', '700'] },
                        { vals: ['225', '6', '1,350'] },
                        { vals: ['275', '14', '3,850'] },
                        { vals: ['325', '12', '3,900'] },
                        { vals: ['375', '18', '6,750'] },
                        { vals: ['425', '14', '5,950'] },
                        { vals: ['475', '8', '3,800'] },
                        { vals: ['525', '4', '2,100'] },
                    ],
                    totalXifi: '28,400'
                },
                result: {
                    calculation: '28,400 / 80 = 355',
                    value: '$355 USD/mes'
                }
            }
        ],
        chart: [
            { label: '175', value: 4, height: '35%' },
            { label: '225', value: 6, height: '52%' },
            { label: '275', value: 14, height: '87%' },
            { label: '325', value: 12, height: '78%' },
            { label: '375', value: 18, height: '115%' },
            { label: '425', value: 14, height: '87%' },
            { label: '475', value: 8, height: '61%' },
            { label: '525', value: 4, height: '35%' },
        ]
    }
};
