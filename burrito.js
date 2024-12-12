const puntos = [
    [-12.060138, -77.084420], [-12.060472, -77.084306], [-12.060896, -77.084214],
    [-12.060901, -77.083799], [-12.060786, -77.082980], [-12.060668, -77.082203],
    [-12.060570, -77.081613], [-12.060413, -77.080988], [-12.060224, -77.080320],
    [-12.060077, -77.079896], [-12.059978, -77.079724], [-12.059873, -77.079628],
    [-12.059681, -77.079622], [-12.059508, -77.079665], [-12.059242, -77.079727],
    [-12.058588, -77.079899], [-12.057971, -77.080053], [-12.057363, -77.080216],
    [-12.057210, -77.080260], [-12.056875, -77.080354], [-12.056637, -77.080408],
    [-12.056432, -77.080578], [-12.056229, -77.080801], [-12.056075, -77.081013],
    [-12.056128, -77.081123], [-12.055960, -77.081387], [-12.055819, -77.081604],
    [-12.055629, -77.081753], [-12.055435, -77.082071], [-12.055325, -77.082294],
    [-12.055285, -77.082481], [-12.055391, -77.082639], [-12.055488, -77.082802],
    [-12.055503, -77.083047], [-12.055464, -77.083235], [-12.055199, -77.083404],
    [-12.054970, -77.083499], [-12.054803, -77.083585], [-12.054649, -77.083757],
    [-12.054543, -77.083945], [-12.054369, -77.084238], [-12.054147, -77.084583],
    [-12.053929, -77.084876], [-12.053770, -77.085169], [-12.053735, -77.085552],
    [-12.053692, -77.085804], [-12.053679, -77.085963], [-12.053539, -77.086187],
    [-12.053471, -77.086382], [-12.053484, -77.086433], [-12.053653, -77.086439],
    [-12.054111, -77.086472], [-12.054496, -77.086516], [-12.054662, -77.086551],
    [-12.054786, -77.086658], [-12.054810, -77.086448], [-12.054853, -77.086084],
    [-12.054881, -77.085765], [-12.054909, -77.085488], [-12.054959, -77.085346],
    [-12.055034, -77.085362], [-12.055095, -77.085285], [-12.055079, -77.085217],
    [-12.055109, -77.085157], [-12.055203, -77.085011], [-12.055315, -77.084801],
    [-12.055355, -77.084743], [-12.055619, -77.084769], [-12.055717, -77.084781],
    [-12.055970, -77.084896], [-12.056204, -77.085015], [-12.056307, -77.085081],
    [-12.056467, -77.085170], [-12.056725, -77.085306], [-12.057085, -77.085462],
    [-12.057480, -77.085622], [-12.057824, -77.085742], [-12.057985, -77.085723],
    [-12.058104, -77.085640], [-12.058263, -77.085405], [-12.058391, -77.085200],
    [-12.058528, -77.084986], [-12.058654, -77.084893], [-12.058797, -77.084781],
    [-12.058896, -77.084577], [-12.058983, -77.084602], [-12.059161, -77.084612],
    [-12.059467, -77.084539], [-12.059844, -77.084456], [-12.060138, -77.084420]
];

const paraderos = [
    [-12.060138, -77.084420, 'Paradero Metalúrgica'],
    [-12.060786, -77.082980, 'Paradero Comedor Universitario'],
    [-12.059508, -77.079665, 'Paradero Puerta 2'],
    [-12.057210, -77.080260, 'Paradero Puerta 3'],
    [-12.055435, -77.082071, 'Paradero Clínica Universitaria'],
    [-12.054147, -77.084583, 'Paradero Puerta 7'],
    [-12.053692, -77.085804, 'Paradero Sistemas'],
    [-12.054853, -77.086084, 'Paradero Odontología'],
    [-12.056307, -77.085081, 'Paradero Pedro Zullen']
];

function interpolarPuntos(p1, p2, n) {
    const puntos = [];
    const latPaso = (p2[0] - p1[0]) / (n + 1);
    const lngPaso = (p2[1] - p1[1]) / (n + 1);

    for (let i = 1; i <= n; i++) {
        puntos.push([p1[0] + latPaso * i, p1[1] + lngPaso * i]);
    }

    return puntos;
}

function calcularDistancia(p1, p2) {
    const R = 6371;
    const lat1 = p1[0] * Math.PI / 180;
    const lat2 = p2[0] * Math.PI / 180;
    const dLat = (p2[0] - p1[0]) * Math.PI / 180;
    const dLng = (p2[1] - p1[1]) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
}

let recorridoInterpolado = [];
for (let i = 0; i < puntos.length - 1; i++) {
    let puntosIntermedios = interpolarPuntos(puntos[i], puntos[i + 1], 5); 
    recorridoInterpolado.push(puntos[i], ...puntosIntermedios);
}
recorridoInterpolado.push(puntos[puntos.length - 1]);

let map;
let marker;
let index = 0;
let lastTime = Date.now();

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -12.057159, lng: -77.082641},
        zoom: 16
    });

    const polyline = new google.maps.Polyline({
        path: recorridoInterpolado.map(p => ({ lat: p[0], lng: p[1] })),
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    polyline.setMap(map);

    paraderos.forEach(function(punto) {
        new google.maps.Marker({
            position: { lat: punto[0], lng: punto[1] },
            map: map,
            icon: {
                url: 'busstop_marker.png',
                scaledSize: new google.maps.Size(15.56,26.78), 
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(10, 10)
            }
        });
    });
    
    marker = new google.maps.Marker({
        position: { lat: puntos[0][0], lng: puntos[0][1] },
        map: map,
    });


    let velocidadHistorica = []; 
    function moverMarcador() {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - lastTime) / 1000; 
        marker.setPosition({
            lat: recorridoInterpolado[index][0],
            lng: recorridoInterpolado[index][1]
        });
        const paraderoActual = paraderos.find(punto => 
            Math.abs(punto[0] - recorridoInterpolado[index][0]) < 0.00005 &&
            Math.abs(punto[1] - recorridoInterpolado[index][1]) < 0.00005
        );
        if (paraderoActual) {
            document.getElementById('paraderoNombre').textContent = paraderoActual[2];
            document.getElementById('velocidad').textContent = '0 km/h';
            setTimeout(() => {
                const nextParaderoIndex = (paraderos.indexOf(paraderoActual) + 1) % paraderos.length;
                document.getElementById('paraderoNombre').textContent = paraderos[nextParaderoIndex][2];
                index = (index + 1) % recorridoInterpolado.length;
            }, 2000);
        } else {
            const nextIndex = (index + 1) % recorridoInterpolado.length;
            const dist = calcularDistancia(recorridoInterpolado[index], recorridoInterpolado[nextIndex]);
            
            let paraderoCercano = paraderos[0];
            let distToParadero = calcularDistancia(recorridoInterpolado[index], paraderoCercano);
            paraderos.forEach(punto => {
                const distancia = calcularDistancia(recorridoInterpolado[index], punto);
                if (distancia < distToParadero) {
                    paraderoCercano = punto;
                    distToParadero = distancia;
                }
            });

            let speed = dist / elapsedTime; 
            if (distToParadero < 0.0001) { 
                speed = 0; 
            } else {
                const reductionFactor = distToParadero / 0.1; 
                speed *= reductionFactor; 
            }

            velocidadHistorica.push(speed * 3600); 

            if (velocidadHistorica.length > 5) {
                velocidadHistorica.shift(); 
            }

            const velocidadPromedio = velocidadHistorica.reduce((a, b) => a + b, 0) / velocidadHistorica.length;
            document.getElementById('velocidad').textContent = velocidadPromedio.toFixed(2) + ' km/h';
            index = nextIndex;
        }
        lastTime = currentTime;
    }
    setInterval(moverMarcador, 1000); 
}