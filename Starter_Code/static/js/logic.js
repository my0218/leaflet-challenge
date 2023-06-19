// Create the map
let myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get earchquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(function (data) {
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
      "<b>Location:</b> " + latitude + ", " + longitude + "<br>" +
      "<b>Depth:</b> " + depth + " km";
    marker.bindPopup(popupContent);
  });
}).catch(function (error) {
  console.log("Error loading earthquake data:", error);
});

// Calculate marker color based on depth
function getColor(depth) {
  var colors = ['#00ff00', '#ffff00', '#ffa500', '#ff7f00', '#ff4500', '#ff0000'];
  var depthRanges = [10, 30, 50, 70, 90];

  for (var i = 0; i < depthRanges.length; i++) {
    if (depth <= depthRanges[i]) {
      return colors[i];
    }
  }

  return colors[colors.length - 1];
}

// Create the legend control
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  var depthRanges = [0, 10, 30, 50, 70, 90];
  var colors = ["#00ff00", "#ffff00", "#ffa500", "#ff7f00", "#ff4500", "#ff0000"];

  for (var i = 0; i < depthRanges.length; i++) {
    var depthLabel;
    if (i === 0) {
      depthLabel = "&lt;" + depthRanges[i + 1];
    } else if (i === depthRanges.length - 1) {
      depthLabel = depthRanges[i] + "+";
    } else {
      depthLabel = depthRanges[i] + " - " + depthRanges[i + 1];
    }
    var color = colors[i];

    div.innerHTML +=
      '<i style="background:' + color + '"></i> ' +
       depthLabel + '<br>';
  }

  return div;
};

legend.addTo(myMap);