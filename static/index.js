const TYPE_CARGO = ["Cargo", "Cargo - Hazard A (Major)", "Cargo - Hazard B", "Cargo - Hazard C (Minor)",
"Cargo - Hazard D (Recognizable)", "Cargo: Hazardous Category A", "Cargo: Hazardous Category B",
"Cargo: Hazardous Category C", "Cargo: Hazardous Category D"]
const TYPE_TANKER = ["Tanker", "Tanker - Hazard A (Major)", "Tanker - Hazard B", "Tanker - Hazard C (Minor)",
"Tanker - Hazard D (Recognizable)", "Tanker: Hazardous Category A", "Tanker: Hazardous Category B",
"Tanker: Hazardous Category C", "Tanker: Hazardous Category D"]

const PORT_NAMES = ["GALVESTON", "GALV", "USGLS"]

let map;
let markers = [];
let infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        zoomControl: true,
        scaleControl: true,
        center: { lat: 29.2946, lng: -94.6746 },
        // mapId: 'd9bb97d34efb6b89',
    });
    infoWindow = new google.maps.InfoWindow();
    getVessels(map.center)
}
function getVessels(latLng) {
    const config = {
    method: 'get',
    baseUrl: window.location.origin,
    url: 'api/get-vessels',
    params: {
    lat: latLng.toJSON().lat,
    lon: latLng.toJSON().lng,
    },
    timeout: 10000,
    }
    axios(config).then(function (response) {
        for (let i = 0; i < response.data.data.vessels.length; i++) {
            let vessel = response.data.data.vessels[i];
            if (PORT_NAMES.includes(vessel.destination)) 
            addVesselMarker(vessel);
        }
    });
}
function addVesselMarker(vessel) {

    const color = getVesselColor(vessel);

    const marker = new google.maps.Marker({
        position: {
            lat: vessel.lat,
            lng: vessel.lon,
        },
        map,
        title: vessel.name,
        icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // Icon URL
            scale: 3,
            fillColor: color,  // Change the fill color to red
            fillOpacity: 1,  // Adjust the fill opacity as needed
            strokeWeight: 1,
            scaledSize: new google.maps.Size(32, 32),  // Adjust the size of the icon
            rotation: vessel.course, // Rotate the icon
        },
    });
    marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(
        "<b>Name: </b> " +
        vessel.name +
        "<br><b>MMSI: </b> " +
        vessel.mmsi +
        "<br><b>Lat: </b> " +
        vessel.lat +
        "<br><b>Lng: </b> " +
        vessel.lon +
        "<br><b>Speed: </b> " +
        vessel.speed +
        "<br><b>Course: </b> " +
        vessel.course +
        "<br><b>Destination: </b> " +
        vessel.destination +
        "<br><b>Type: </b> " +
        vessel.type
        );
        infoWindow.open({
            anchor: marker,
            map,
        });
    });
    markers.push(marker);
}

function getVesselColor(vessel) {
    if (TYPE_CARGO.includes(vessel.type)) {
        return "red";
    } else if (TYPE_TANKER.includes(vessel.type)) {
        return "orange";
    } else {
        return "green";
    }
}
window.initMap = initMap;