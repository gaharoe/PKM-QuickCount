

# VARS
    $TABLE => node / table name
    $ROW => data id
    $DB_EVENT = [
        "value" --> on value,
        "child_added" --> on data created,
        "child_changed" --> on data updated,
        "child_moved" --> on data movement,
        "child_removed" --> on data deleted
    ];



# INITIAL

    # firebase-admin library
    const admin = require("firebase-admin");
    
    # firebase json service account
    const serviceAccount = JSON.parse();  

    # initialize app
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "URL"
    });

    # assign DB
    const db = admin.database();



# CREATE WITH RANDOM ID / ROW NAME

    db.ref("$TABLE").push(
        key1: "value", 
        key2: "value", 
        key3: "value", 
    );


# CREATE WITH SPECIFIC ID / ROW NAME

    db.ref("$TABLE/$ROW").set(
        key1: "value", 
        key2: "value", 
        key3: "value", 
    );


# READ ALL ONCE

    db.ref("$TABLE").once("$DB_EVENT", (data) => {
        +---------------------------------------+
        | data = {                              |
        |     val: function () {                |
        |         return {                      |
        |             id1: {                    |
        |                 key1: "value",        |
        |                 key2: "value",        |
        |                 key3: "value"         |
        |             }                         |
        |             id2: {                    |
        |                 key1: "value",        |
        |                 key2: "value",        |
        |                 key3: "value"         |
        |             }                         |
        |             id3: {                    |
        |                 key1: "value",        |
        |                 key2: "value",        |
        |                 key3: "value"         |
        |             }                         |
        |         }                             |
        |    }                                  |
        | }                                     |
        +---------------------------------------+

        console.log(data.val().$ROW.key);
    });


# READ SINGLE ONCE

    db.ref("$TABLE/$ROW").once("$DB_EVENT", (data) => {
        +---------------------------------------+
        | data = {                              |
        |     val: function () {                |
        |         return {                      |
        |           key1: "value",              |
        |           key2: "value",              |
        |           key3: "value"               |
        |         }                             |
        |    }                                  |
        | }                                     |
        +---------------------------------------+

        console.log(data.val().key);        
    });


# READ ALL REALTIME BY DB_EVENT

    db.ref("$TABLE").on("$DB_EVENT", (data) => {
        +---------------------------------------+
        | data = {                              |
        |     val: function () {                |
        |         return {                      |
        |             id1: {                    |
        |                 key1: "value",        |
        |                 key2: "value",        |
        |                 key3: "value"         |
        |             }                         |
        |             id2: {                    |
        |                 key1: "value",        |
        |                 key2: "value",        |
        |                 key3: "value"         |
        |             }                         |
        |             id3: {                    |
        |                 key1: "value",        |
        |                 key2: "value",        |
        |                 key3: "value"         |
        |             }                         |
        |         }                             |
        |    }                                  |
        | }                                     |
        +---------------------------------------+

        console.log(data.val().$ROW.key);
    });


# READ SINGLE ONCE

    db.ref("$TABLE/$ROW").on("$DB_EVENT", (data) => {
        +---------------------------------------+
        | data = {                              |
        |     val: function () {                |
        |         return {                      |
        |           key1: "value",              |
        |           key2: "value",              |
        |           key3: "value"               |
        |         }                             |
        |    }                                  |
        | }                                     |
        +---------------------------------------+

        console.log(data.val().key);        
    });


# UPDATE 

    db.ref("$TABLE/$ROW").update({
        key1: "value",
        key2: "value",
        key3: "value"
    });


# DELETE

    db.ref("$TABLE/$ROW).remove()





