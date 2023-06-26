let map;
let markers = [];
let infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        zoomControl: true,
        scaleControl: true,
        center: { lat: 29.2946, lng: -94.6746 },
    });
    infoWindow = new google.maps.InfoWindow();
    // map.addListener("click", (e) => {
    //     deleteMarkers()
    //     addCenterMarker(e.latLng)
    //     getVessels(e.latLng)
    // });
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
            addVesselMarker(vessel);
        }
    });
}
function addVesselMarker(vessel) {
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
            fillColor: "red",  // Change the fill color to red
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
        vessel.destination
        );
        infoWindow.open({
            anchor: marker,
            map,
        });
    });
    markers.push(marker);
}
function addCenterMarker(latLng) {
    const marker = new google.maps.Marker({
        position: latLng,
        map,
        title: "Center",
    });
    marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(
        JSON.stringify(latLng.toJSON(), null, 2)
        );
        infoWindow.open({
            anchor: marker,
            map,
        });
    });
    markers.push(marker);
}
function deleteMarkers() {
    //We skipped this function to make this code block shorter
}
window.initMap = initMap;