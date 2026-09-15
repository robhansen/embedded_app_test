// Create a new Webex app instance
var app = new window.Webex.Application();

// Wait for onReady() promise to fulfill before using framework
app.onReady().then(() => {
    log("App ready. Instance", app);
}).catch((errorcode) =>  {
    log("Error with code: ", Webex.Application.ErrorCodes[errorcode])
});

function constructPayload(user) {
    let streamSessionId = crypto.randomUUID();
    log("Stream Session ID", streamSessionId);

    payload = {
        "action": "initStream",
        "streamSessionId": streamSessionId,
        "jwtToken": user.token
    };
    return payload;
}

function generatePayload(to_clipboard, url) {
    log("getUser()", "called");
    app.context.getUser().then((user) => {
      log("getUser()", "successful");
      let payload = constructPayload(user);
        log("Constructed payload", payload);
      if (to_clipboard) {          
          navigator.clipboard.writeText(JSON.stringify(payload)).then(() => {
              log("Payload copied to clipboard", "successfully");
          }).catch((error) => {
              log("Failed to copy payload to clipboard: " + error.message);
          });
      }
      else if (url) {
          fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
          }).then((response) => {
              log("Payload sent successfully", response.status);
          }).catch((error) => {
              log("Failed to send payload: " + error.message);
          });
      }
        }
    ).catch((error) => {
      log("getUser() request failed " + error.message);
    });
}

function copyPayload() {    
    generatePayload(true, null);
}

function sendPayload(url) {
    generatePayload(false, url);
}

// Utility function to log app messages
function log(type, data) {
    var ul = document.getElementById("console");
    var li = document.createElement("li");
    var payload = document.createTextNode(`${type}: ${JSON.stringify(data)}`);
    li.appendChild(payload)
    ul.prepend(li);
}
