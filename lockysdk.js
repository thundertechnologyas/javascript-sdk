class LockySDK {
    token = "";
    autenticated = false;
    sdkhelper = "";
    locksList = [];
    
    constructor() {
        this.sdkhelper = new LockySDKHelper();
        var savedToken = localStorage.getItem("lockysdktoken");
        this._setAuthenticated(savedToken);
    }
    
    /**
     * This is where it all begins
     * Call this function to tell locky to send a verification code on email.
     * @param {type} email
     * @returns {undefined}
     */
    async startVerify(email) {
        this.email = email;
        this.sdkhelper.startVerify(email);
    }
    
    /**
     * When you have received the verification code, use it to finalize the authentication.
     * @param {type} code
     * @returns {Boolean}
     */
    async verify(code) {
        var token = await this.sdkhelper.verify(this.email, code);
        localStorage.setItem("lockysdktoken", token);
        return this._setAuthenticated(token);
    }
    
    /**
     * If you do not want to stay logged on anymore.
     * @returns {Boolean}
     */
    logout() {
        localStorage.removeItem("lockysdktoken");
        this.token = "";
        this._setAuthenticated();
        return true;
    }
    
    /**
     * Check if you are logged on.
     * @returns {Boolean}
     */
    isAuthenticated() {
        return this.authenticated;
    }
    
    /**
     * Receive a list of all locks you have access to. 
     * @returns {Array|Locks}
     */
    async getAllLocks() {
        if(!this.isAuthenticated()) { alert('You need to authenticate first'); return; }
        this.locksList = await this.sdkhelper.getAllLocks(this.token);
        return this.locksList;
    }
    
    /**
     * Send a pulse open signal to the lock.
     * @param {type} deviceId Id fetched from getAllLocks
     * @returns {null}
     */
    async pulseOpen(deviceId) {
        if(!this.isAuthenticated()) { alert('You need to authenticate first'); return; }
        var device = this.getDevice(deviceId);
        this.sdkhelper.pulseOpen(device.token, device.id, device.tenantId);
    }
    
    /**
     * Send a forced open signal to the lock.
     * @param {type} deviceId Id fetched from getAllLocks
     * @returns {undefined}
     */
    async forcedOpen(deviceId) {
        if(!this.isAuthenticated()) { alert('You need to authenticate first'); return; }
        var device = this.getDevice(deviceId);
        this.sdkhelper.forcedOpen(device.token, device.id, device.tenantId);
    }
    
    /**
     * Send a forced closed signal to the lock.
     * @param {type} deviceId Id fetched from getAllLocks
     * @returns {undefined}
     */
    async forcedClosed(deviceId) {
        if(!this.isAuthenticated()) { alert('You need to authenticate first'); return; }
        var device = this.getDevice(deviceId);
        this.sdkhelper.forcedClosed(device.token, device.id, device.tenantId);
    }
    
    /**
     * Send a normal state signal to the lock.
     * @param {type} deviceId Id fetched from getAllLocks
     * @returns {undefined}
     */
    async normalState(deviceId) {
        if(!this.isAuthenticated()) { alert('You need to authenticate first'); return; }
        var device = this.getDevice(deviceId);
        this.sdkhelper.normalState(device.token, device.id, device.tenantId);
    }
    
    getDevice(deviceId) {
        for(var k in this.locksList) {
            var device = this.locksList[k];
            console.log(device);
            if(device.id === deviceId) {
                return device;
            }
        }
        return null;
    }
    
    async onLockyEvent(event) {
        //This function needs to be implemented to handle the following from bluetooth:
        /*
            • Lock with deviceId found from startScanning function
            • Lock with deviceId lost from the startScanning function
            • Package to be sent are being downloaded
            • Connecting to lock
            • Not able to connect to lock
            • Message being delivered to lock
            • Message failed transferred to lock
            • Message sent to lock
         */
    }
    
    _setAuthenticated(token) {
        if(token) {
            this.authenticated = true;
            this.token = token;
            return true;
        } else {
            this.autenticated = false;
            return false;
        }
    }
    
    
}