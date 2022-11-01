
sdk = new LockySDK();

function startVerify() {
    var email = document.getElementById("startemail").value;
    sdk.startVerify(email);
}


const verify = async () => {
    var email = document.getElementById("startemail").value;
    var code = document.getElementById("verifycode").value;

    var token = sdk.verify(email, code);
    document.getElementById("tokentouse").value = await token;
}

const getAllLocks = async () => {
    
    var alllocksdiv = document.getElementById("alllocks");
    alllocksdiv.innerHTML = "";
            
    var token = document.getElementById("tokentouse").value;
    var devices = await sdk.getAllLocks(token);
        
    for(var k in devices) {
        var device = devices[k];
        console.log(device);
        var deviceId = device.id;
        var deviceName = device.name;
        var token = device.token;
        var tenantId = device.tenantId;

        var lockdiv = document.createElement('div');
        lockdiv.classList.add("lockrow");
        lockdiv.innerHTML = deviceName + "<button class='actionbutton' onclick='downloadPulseOpen(\""+token+"\",\""+deviceId+"\",\""+tenantId+"\")' >Pulse open</button>\n\
            <button class='actionbutton' value='' onclick='downloadForcedOpen(\""+token+"\",\""+deviceId+"\",\""+tenantId+"\")' >Forced open</button>\n\
            <button  class='actionbutton' type='button' onclick='downloadForcedClosed(\""+token+"\",\""+deviceId+"\",\""+tenantId+"\")' >Forced closed</button>\n\
            <button class='actionbutton' type='button' onclick='downloadNormalState(\""+token+"\",\""+deviceId+"\",\""+tenantId+"\")' >Normal state</button>";
        alllocksdiv.appendChild(lockdiv);

    }

}

const getMobileKeys = async () => {
    var token = document.getElementById("tokentouse").value;
    var result = await sdk._getMobileKeys(token);
    console.log(result);
}

const downloadPulseOpen = async (token, deviceid, tenantId) => { sdk.pulseOpen(token, deviceid, tenantId); } 
const downloadForcedOpen = async (token, deviceid, tenantId) => { sdk.forcedOpen(token, deviceid, tenantId); }
const downloadForcedClosed = async (token, deviceid, tenantId) => { sdk.forcedClosed(token, deviceid, tenantId); }
const downloadNormalState = async (token, deviceid, tenantId) => { sdk.normalState(token, deviceid, tenantId);  }
