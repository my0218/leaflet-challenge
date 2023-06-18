// Create the map
let myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Fetch the earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.features.forEach(function (earthquake) {
      var latitude = earthquake.geometry.coordinates[1];
      var longitude = earthquake.geometry.coordinates[0];

      var magnitude = earthquake.properties.mag;
      var depth = earthquake.geometry.coordinates[2];

      var markerSize = Math.pow(2, magnitude) * 2;
      var markerColor = getColor(depth);

      var marker = L.circleMarker([latitude, longitude], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(myMap);

      // Create popup content
      var popupContent = "<b>Magnitude:</b> " + magnitude + "<br>" +
        "<b>Depth:</b> " + depth + " km";

      marker.bindPopup(popupContent);
    });
  });


// Calculate marker color based on depth
function getColor(depth) {
  var colors = ['#00ff00', '#ffff00', '#ffa500', '#ff7f00', '#ff4500', '#ff0000']; // Green, Yellow, Orange, Red, Dark Red
  var depthRanges = [10, 30, 50, 70, 90]; // Depth ranges for color gradient

  for (var i = 0; i < depthRanges.length; i++) {
    if (depth <= depthRanges[i]) {
      return colors[i];
    }
  }

  return colors[colors.length - 1]; 
}
// Create legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  

  return div;
};

legend.addTo(myMap);




