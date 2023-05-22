document.getElementById('apiForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting

  var inputText = document.getElementById('inputText').value;

  // Send the input text to the server
  var socket = new WebSocket('ws://localhost:5000');
  socket.onopen = function () {
    socket.send(inputText);
  };

  // Receive the response from the server
  socket.onmessage = function (event) {
    var response = JSON.parse(event.data);
    displayResults(response);
    socket.close();
  };
});

function displayResults(response) {
  var resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = '';

  for (var i = 0; i < response.length; i++) {
    var item = response[i];
    var label = item.label;
    var score = item.score;

    var resultElement = document.createElement('div');
    resultElement.innerHTML = '<p><strong>Label:</strong> ' + label + '</p><p><strong>Score:</strong> ' + score + '</p>';

    resultContainer.appendChild(resultElement);
  }
}
