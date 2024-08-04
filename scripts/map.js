let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -20.3484, lng: 57.5522 },
        zoom: 10
    });

    new google.maps.Marker({
        position: { lat: -20.3484, lng: 57.5522 },
        map: map,
        title: 'Mauritius'
    });
}

window.onload = () => {
    fetchData();
    document.getElementById('searchInput').addEventListener('keyup', filterDoctors);
    initMap();
};
