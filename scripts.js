
sdk = new LockySDK();

function startVerify() {
    var email = document.getElementById("startemail").value;
    sdk.startVerify(email);
}


const verify = async () => {
    var code = document.getElementById("verifycode").value;
    var loggedon = await sdk.verify(code);
    document.getElementById("tokentouse").value = loggedon;
}

const getAllLocks = async () => {
    
    var alllocksdiv = document.getElementById("alllocks");
    alllocksdiv.innerHTML = "";
    var devices = await sdk.getAllLocks();
        
    for(var k in devices) {
        var device = devices[k];
        var deviceId = device.id;
        var deviceName = device.name;
        var token = device.token;
        var tenantId = device.tenantId;

        var lockdiv = document.createElement('div');
        lockdiv.classList.add("lockrow");
        lockdiv.innerHTML = deviceName + "<button class='actionbutton' onclick='downloadPulseOpen(\""+deviceId+"\")' >Pulse open</button>\n\
            <button class='actionbutton' value='' onclick='downloadForcedOpen(\""+deviceId+"\")' >Forced open</button>\n\
            <button  class='actionbutton' type='button' onclick='downloadForcedClosed(\""+deviceId+"\")' >Forced closed</button>\n\
            <button class='actionbutton' type='button' onclick='downloadNormalState(\""+deviceId+"\")' >Normal state</button>";
        alllocksdiv.appendChild(lockdiv);
    }
}

const getMobileKeys = async () => {
    var token = document.getElementById("tokentouse").value;
    var result = await sdk._getMobileKeys(token);
    console.log(result);
}

const logout = async() => { 
    sdk.logout(); 
    var loggedout = sdk.logout();
    if(loggedout) {
        document.getElementById("tokentouse").value = false;
        window.location.href=window.location.href;
    }
}

const downloadPulseOpen = async (deviceid) => { sdk.pulseOpen(deviceid); }
const downloadForcedOpen = async (deviceid) => { sdk.forcedOpen(deviceid); }
const downloadForcedClosed = async (deviceid) => { sdk.forcedClosed(deviceid); }
const downloadNormalState = async (deviceid) => { sdk.normalState(deviceid);  }
