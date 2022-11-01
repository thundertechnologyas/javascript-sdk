# javascript-sdk

This SDK is not a 100% is a demo SDK written in Javascript. It does not contain any communication over the bluetooth stack.

This SDK has been built to demostrate how to build other SDK's on top of this demostration code. If you need a sdk for android or ios, have a look at our sdk's named: ios-sdk, and android-sdk.

They will be using the same techniques used in this javascript sdk.

If you are looking a way to build your own SDK for the Locky universe. Then this is libarary contains all the nessesary information you need.

### You log on to the sdk using a two token based authentication process, first ask for a verification code sent by email

```
<script>
   # Ask the locky backend for an authentication code.
   var sdk = new LockySDK();
   sdk.startVerify(email);
</script>
```
### Then use the authentication code to obtain the token
```
<script>
   var sdk = new LockySDK();
   var token = await sdk.verify(email, codeFromEmail);
</script>
```

### Recieve the list of locks
Now you have access and get ask for all locks this user has access to.
The devices object contain all the nessesary data to run operations on the lock, example pulse open.
```
<script>
   var sdk = new LockySDK();
   var devices = await sdk.getAllLocks(token);
</script>
```

### Run pulse open
```
<script>
   var sdk = new LockySDK();
   sdk.pulseOpen(device.token, device.id, device.tenantId);
</script>
```
