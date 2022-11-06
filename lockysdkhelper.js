class MobileKey {
    token = "";
    tenantId = "";
    
    constructor(token, tenantId) {
        this.token = token;
        this.tenantId = tenantId;
    }
}

class Device {
    id = "";
    name = "";
    lastReceivedDate = "";
    token = "";
    tenantId = "";
}

class LockySDKHelper {
    
    
  constructor() {
    this.domain = "mobilekey";
    this.authEndpoint = "https://auth.thundertech.no/";
    this.endpoint = "https://server1.thundertech.no:20001/";
  }
 
    
    /**
     * Start the verification process.
     * This function will ask the locky system to send an authentication code to the customer.
     * 
     * @param {type} email The email for the one logging on.
     * @returns void
     */
    async startVerify(email) {
      var domain = this.domain;
      const response = await fetch(this.authEndpoint+'api/simpleauth/start?domain='+domain+'&email='+email);
      alert('Look for a code sent to your email.');
    }
    /**
     * When you have received a code on email, send it to the locky system to receive a token
     * @param String code The token for the locky system.
     * @returns String a token to get all locks.
     */
    async verify(email, code) {
        var domain = this.domain;
        const response = await fetch(this.authEndpoint+'api/simpleauth/verify?domain='+domain+'&email='+email+"&code="+code);
        const myJson = await response.json();
        return myJson.token;
    }
    
    /**
     * When you have received a token, you can receive all locks.
     * @param String token got from verify call
     * @returns List of all locks the user has access to.
     */
    async getLocks(mobilekey) {
        var result = [];
        const response = await fetch(this.endpoint+'lockyapi/mobilekey/devices',
         {
            method: 'GET',
            headers: {
                "tenantId" : mobilekey.tenantId,
                "token" : mobilekey.token
            }
        });
        const lockstext = await response.text(); 

        try {
            var locks = JSON.parse(lockstext);
            if(locks) {
                for(var k in locks) {
                    var lock = locks[k];
                    var device = new Device();
                    device.id = lock.id;
                    device.name = lock.name;
                    device.token = mobilekey.token;
                    device.tenantId = mobilekey.tenantId;
                    console.log(device);
                    result.push(device);
                }
            }
        }catch(e) {
        }
        return result;
    }
    
    /**
     * Get a list of all decives this user has access to.
     * @param String token token received from verify
     * @returns A list of devices.
     */
    async getAllLocks(token) {
        var mobilekeys = await this._getMobileKeys(token);
        var result = [];
        for(var k in mobilekeys) {
            var mobilekey = mobilekeys[k];
            var devices = await this.getLocks(mobilekey);
            for(var k in devices) {
                result.push(devices[k]);
            }
        }
        return result;
    }
    
    /**
     * Download the pulse open package, transfer it to the lock and return the repsonse to the backend.
     * 
     * @param String token The token you got from getMobileKeys
     * @param String deviceId The deviceId you got from the getLocks
     * @param String tenantId The tenantId you got from getMobileKeys
     * @returns {undefined}
     */
    async pulseOpen(token, deviceId, tenantId) {
        var BLEMessage = await this._downloadPackage(token, deviceId, tenantId, "pulseopen");
        var MsgFromLock = this._deliverMessage(deviceId, BLEMessage);
        this._messageDelivered(token, deviceId, tenantId, MsgFromLock);
    }
    
    /**
     * Download the forced open package, transfer it to the lock and return the repsonse to the backend.
     * 
     * @param String token The token you got from getMobileKeys
     * @param String deviceId The deviceId you got from the getLocks
     * @param String tenantId The tenantId you got from getMobileKeys
     * @returns {undefined}
     */
    async forcedOpen(token, deviceId, tenantId) {
        var BLEMessage = await this._downloadPackage(token, deviceId, tenantId, "forcedopen");
        var MsgFromLock = this._deliverMessage(deviceId, BLEMessage);
        this._messageDelivered(token, deviceId, tenantId, MsgFromLock);
    }
    
    /**
     * Download the forced closed package, transfer it to the lock and return the repsonse to the backend.
     * 
     * @param String token The token you got from getMobileKeys
     * @param String deviceId The deviceId you got from the getLocks
     * @param String tenantId The tenantId you got from getMobileKeys
     * @returns {undefined}
     */
    async forcedClosed(token, deviceId, tenantId) {
        var BLEMessage = await this._downloadPackage(token, deviceId, tenantId, "forcedclosed");
        var MsgFromLock = this._deliverMessage(deviceId, BLEMessage);
        this._messageDelivered(token, deviceId, tenantId, MsgFromLock);
    }
    
    /**
     * Download the normal state package, transfer it to the lock and return the repsonse to the backend.
     * 
     * @param String token The token you got from getMobileKeys
     * @param String deviceId The deviceId you got from the getLocks
     * @param String tenantId The tenantId you got from getMobileKeys
     * @returns {undefined}
     */
    async normalState(token, deviceId, tenantId) {
        var BLEMessage = await this._downloadPackage(token, deviceId, tenantId, "normalstate");
        var MsgFromLock = this._deliverMessage(deviceId, BLEMessage);
        this._messageDelivered(token, deviceId, tenantId, MsgFromLock);
    }
    
    /**
     * This function is a dummy function just demostrating that a scanner function is needed to scan for close by locks.
     */
    async startScanning() {
        alert('Start scan for BLE Devices');
    }
    
    /**
     * This function is a dummy function just demostrating that a scanner function is needed to stop scanning. 
     */
    async stopScanning() {
        alert('Stop scan for BLE Devices');
    }
    
    /**
     * A dummy function demostrating that this is where the bluetooth data needs to be transferred to the device.
     * @param String deviceId The id of the device.
     * @param String payload Data from the _downloadPackage() call
     * @returns {String}
     */
    async _deliverMessage(deviceId, payload) {
        alert('DeliverMessage function shall transfer the message "payload" to the device');
        return "responsefromdevice";
    }
    
    /**
     * Mobilekeys are a list of all tenants and you have access to. Its a list of tenantId and token.
     * @param {type} token
     * @returns {Array|LockySDK._getMobileKeys.result}
     */
    async _getMobileKeys(token) {
        const response = await fetch(this.authEndpoint+'/api/simpleauth/mobilekeys?domain='+this.domain+'&token='+token, { method: 'POST' });
        const myJson = await response.json(); 
        var result = [];
        for(var k in myJson) {
            var tocheck = myJson[k];
            var tenantId = tocheck.substring(0,24);
            var token = tocheck.substring(24);
            
            var item = new MobileKey(token, tenantId);
            result.push(item);
        }

        return result;
    }

    /**
     * Download a 16 bytes encrypted package from the backend that contains the information instruction for the lock.
     * @param String token The token
     * @param String deviceId Id of the device
     * @param String tenantId Id of the tenant
     * @param String type pulseopen,forcedopen,forcedclosed,normalstate
     * @returns {unresolved}
     */
    async _downloadPackage(token, deviceId, tenantId, type) {
        var signal = "pulseopenpackage";
        if(type === "pulseopen") { signal = "pulseopenpackage"; }
        if(type === "forcedopen") { signal = "forcedopenpackage"; }
        if(type === "forcedclosed") { signal = "forcedclosedpackage"; }
        if(type === "normalstate") { signal = "normalstatepackage"; }
        
        const response = await fetch(this.endpoint+'lockyapi/mobilekey/'+signal+'?deviceId='+deviceId,
        {
            method: 'GET',
            headers: { "tenantId" : tenantId, "token" : token }
       });

       const datapackage = await response.text(); 
       return datapackage;
    }

    /**
     * Information got Lockys backend that the message has been delivered, and what the device iteself responded with.
     * @param String token The token
     * @param String deviceId Id of the device
     * @param String tenantId Id of the tenant     * 
     * @param {type} payload The response from the device.
     * @returns {undefined}
     */
    async _messageDelivered(token, deviceId, tenantId, payload) {
        const response = await fetch(this.endpoint+'lockyapi/mobilekey/msgdelivered?deviceId='+deviceId,
        {
           'method': 'POST',
            headers: { "tenantId" : tenantId, "token" : token, 'Content-Type': 'application/json' },
            body: payload
       });
   
        const datapackage = await response.text(); 
    }
    
    

}