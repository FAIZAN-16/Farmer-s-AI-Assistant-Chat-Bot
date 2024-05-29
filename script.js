const speechSDK = window.SpeechSDK;
const speechConfig = new speechSDK.SpeechConfig('YOUR_SPEECH_SERVICE_KEY', 'YOUR_SPEECH_SERVICE_REGION');
const synthesizer = new speechSDK.SpeechSynthesizer(speechConfig);

let responses = [];

fetch('test.csv')
 .then(response => response.text())
 .then(data => {
    const csvRows = data.split('\n');
    csvRows.forEach(row => {
      const [question, answer] = row.split(',');
      responses.push({ question, answer });
    });
  });

function handleTextInput() {
  const userInput = document.getElementById('text-input').value.trim();
  const response = getResponse(userInput);
  displayResponse(response);
  updateInputOutput(`User: ${userInput}\nChatbot: ${response}`);
}

function handleVoiceInput(result) {
  const userInput = result[0].transcript.trim();
  const response = getResponse(userInput);
  displayResponse(response);
  updateInputOutput(`User: ${userInput}\nChatbot: ${response}`);
}

function startVoiceInput() {
  annyang.start();
}

function getResponse(userInput) {
  const matchingResponses = responses.filter(response => response.question.toLowerCase().includes(userInput.toLowerCase()));
  if (matchingResponses.length > 0) {
    return matchingResponses[0].answer;
  } else {
    return `I'm sorry, I don't understand "${userInput}".`;
  }
}

function displayResponse(response) {
  document.getElementById('response-text').textContent = response;
  synthesizer.speak(response, {
    audio: {
      contentType: 'audio/wav',
    },
  }).then(result => {
    const audioBlob = new Blob([result.audioData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    document.getElementById('response-audio').src = audioUrl;
  });
}

function updateInputOutput(text) {
  const inputOutput = document.getElementById('input-output');
  inputOutput.value += text + '\n';
}