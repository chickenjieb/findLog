/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function onPushwooshInitialized(pushNotification) {

    //if you need push token at a later time you can always get it from Pushwoosh plugin
    pushNotification.getPushToken(
        function(token) {
            console.info('push token: ' + token);
        }
    );

    //and HWID if you want to communicate with Pushwoosh API
    pushNotification.getPushwooshHWID(
        function(token) {
            console.info('Pushwoosh HWID: ' + token);
        }
    );

    //settings tags
    pushNotification.setTags({
            username: "test"
            // intTagName: 10
        },
        function(status) {
            console.info('setTags success: ' + JSON.stringify(status));
        },
        function(status) {
            console.warn('setTags failed');
        }
    );

    pushNotification.getTags(
        function(status) {
            console.info('getTags success: ' + JSON.stringify(status));
        },
        function(status) {
            console.warn('getTags failed');
        }
    );

    //start geo tracking.
    //pushNotification.startLocationTracking();
}

function initPushwoosh() {
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

    //set push notifications handler
    document.addEventListener('push-notification',
        function(event) {
            var message = event.notification.message;
            var userData = event.notification.userdata;

            document.getElementById("pushMessage").innerHTML = message + "<p>";
            document.getElementById("pushData").innerHTML = JSON.stringify(event.notification) + "<p>";

            //dump custom data to the console if it exists
            if (typeof(userData) != "undefined") {
                console.warn('user data: ' + JSON.stringify(userData));
            }
        }
    );

    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({
        projectid: "647864599214",
        appid: "24929-CDE68",
        serviceName: ""
    });

    //register for push notifications
    pushNotification.registerDevice(
        function(status) {
            document.getElementById("pushToken").innerHTML = status.pushToken + "<p>";
            onPushwooshInitialized(pushNotification);
        },
        function(status) {
            alert("failed to register: " + status);
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );

}
  // reset tag value from tag name "username"
  function resetUsername() {
      var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
      var username = document.getElementById('inputUsername').value;
      window.alert(username);
      pushNotification.setTags({
              username: username
          },
          function(status) {
              console.info('setTags success: ' + JSON.stringify(status));
          },
          function(status) {
              console.warn('setTags failed');
          }
      );
      pushNotification.getTags(
          function(status) {
              console.info('getTags success: ' + JSON.stringify(status));
          },
          function(status) {
              console.warn('getTags failed');
          }
      );
  }

  // reset UserId value
  function resetUserID(){
    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
    var userID = document.getElementById('inputUserID').value;
    window.alert(userID);
    pushNotification.setUserId(userID);
  }

  // push message to specified receiver using UserID
  function pushMessage(){
    var message = document.getElementById('inputMessage').value;
    var receiver = document.getElementById('inputReceiver').value;
    $.ajax({
    type: "POST",
    url: "https://cp.pushwoosh.com/json/1.3/createMessage",
    data: JSON.stringify({
        "request": {
            "application": "24929-CDE68",
            "auth": "w4CR0pvi9NVjI2fhSX2rbOQe8rVOjIWDPth0IVi5WelprUPOl2eOPHw8qP5WMCfM5VI1oh6aDSF0oFO6Ts3V",
            "notifications": [{
                "send_date": "now",
                "ignore_user_timezone": true,
                "content": message,
                "users":[receiver]
            }]
        }
    }),
    dataType: "json"
    }).done(function(data) {
        console.log(data);
    });
  }

  document.addEventListener('eventName', didLaunchAppFromLink, false);
  function didLaunchAppFromLink(event) {
    var urlData = event.detail;
    console.log('Did launch application from the link: ' + urlData.url);
    // do some work
  }

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      console.log('Device is ready for work');
      // universalLinks.subscribe('eventName', app.didLaunchAppFromLink);
      // universalLinks.subscribe(null, function (eventData) {
      //     // do some work
      //     // in eventData you'll see url и and parsed url with schema, host, path and arguments
      //     console.log('Did mya application from the link: ' + JSON.stringify(eventData));
      //     alert('Did launch application from the link: ' + JSON.stringify(eventData));
      // });
        universalLinks.subscribe('example1', function (eventData) {
          // do some work
          // in eventData you'll see url и and parsed url with schema, host, path and arguments
              console.log('Did launch application from the link: ' + JSON.stringify(eventData));
              alert('test1: ' + JSON.stringify(eventData));
          });
          universalLinks.subscribe('example2', function (eventData) {
              // do some work
              // in eventData you'll see url и and parsed url with schema, host, path and arguments
              console.log('Did launch application from the link: ' + JSON.stringify(eventData));
              alert('test2: ' + JSON.stringify(eventData));
          });
        initPushwoosh();
        app.receivedEvent('deviceready');
    },
    didLaunchAppFromLink: function(eventData) {
      alert('Did launch application from the link: ' + eventData.url);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};
app.initialize();
