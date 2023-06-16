let tmp = -1
document.cookie.split(';')
    .some((el, index) => {
        const v = el.split('=')
        if (v[0].endsWith('user_id')) {
            tmp = Number(v[1])
            return true
        }
    })
const user_id = tmp;

class CurSession {
    constructor() {
        this.session = null;
    }

    setup_session(session) {
        this.session = session;
    }
    clear_session() {
        this.session = null;
    }
}

const cur_session = new CurSession()

const setup_join_btn = (token_info) => {
    const btn = document.createElement('button')
    btn.textContent = token_info.group_title

    if (token_info.token !== null) {

        btn.addEventListener('click', async (e) => {
            var promiseResults = await Promise.all(
                [
                    createToken(token_info.token),
                    createToken(token_info.token)
                ])
            console.log(promiseResults)
            joinSession(promiseResults)

        })
    } else {
        btn.disabled = true
    }
    $('#open_groups').append(btn)
}

$(document).ready(async () => {
    var webComponent = document.querySelector('openvidu-webcomponent');
    var form = document.getElementById('main');
    checkSession(user_id).then(v => v.forEach(t => setup_join_btn(t)))

    webComponent.addEventListener('onSessionCreated', (event) => {
        var session = event.detail;

        // You can see the session documentation here
        // https://docs.openvidu.io/en/stable/api/openvidu-browser/classes/session.html

        session.on('connectionCreated', (e) => {
            console.log("connectionCreated", e);
            cur_session.setup_session(e.connection.session);
        });

        session.on('streamDestroyed', (e) => {
            console.log("streamDestroyed", e);
        });

        session.on('streamCreated', (e) => {
            console.log("streamCreated", e);
        });

        session.on('sessionDisconnected', (event) => {
            console.warn("sessionDisconnected event");
            form.style.display = 'block';
            webComponent.style.display = 'none';
            cur_session.clear_session()
        });

        session.on('exception', (exception) => {
            console.error(exception);
        });
    });

    webComponent.addEventListener('onJoinButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarLeaveButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarCameraButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarMicrophoneButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarScreenshareButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarParticipantsPanelButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarChatPanelButtonClicked', (event) => { });
    webComponent.addEventListener('onToolbarFullscreenButtonClicked', (event) => { });
    webComponent.addEventListener('onParticipantCreated', (event) => { });

});

async function joinSession(new_tokens) {

    //Getting the webcomponent element
    var webComponent = document.querySelector('openvidu-webcomponent');
    var tokens = { webcam: new_tokens[0], screen: new_tokens[1] };

    hideForm();

    // Displaying webcomponent
    webComponent.style.display = 'block';

    webComponent.participantName = 'i can change it';

    // You can see the UI parameters documentation here
    // https://docs.openvidu.io/en/stable/api/openvidu-angular/components/OpenviduWebComponentComponent.html#inputs

    // webComponent.toolbarScreenshareButton = false;
    // webComponent.minimal = true;
    // webComponent.prejoin = true;

    // webComponent.videoMuted = false;
    // webComponent.audioMuted = false;

    // webComponent.toolbarScreenshareButton = true;
    // webComponent.toolbarFullscreenButton = true;
    // webComponent.toolbarLeaveButton = true;
    // webComponent.toolbarChatPanelButton = true;
    // webComponent.toolbarParticipantsPanelButton = true;
    // webComponent.toolbarDisplayLogo = true;
    // webComponent.toolbarDisplaySessionName = true;
    // webComponent.streamDisplayParticipantName = true;
    // webComponent.streamDisplayAudioDetection = true;
    // webComponent.streamSettingsButton = true;
    // webComponent.participantPanelItemMuteButton = true;

    webComponent.tokens = tokens;
}

function hideForm() {
    var form = document.getElementById('main');
    form.style.display = 'none';

}


/**
 * --------------------------------------------
 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
 * --------------------------------------------
 * The methods below request the creation of a Session and a Token to
 * your application server. This keeps your OpenVidu deployment secure.
 * 
 * In this sample code, there is no user control at all. Anybody could
 * access your application server endpoints! In a real production
 * environment, your application server must identify the user to allow
 * access to the endpoints.
 * 
 * Visit https://docs.openvidu.io/en/stable/application-server to learn
 * more about the integration of OpenVidu in your application server.
 */

var APPLICATION_SERVER_URL = "https://w0m0site.freemyip.com/";

function getToken(user_id, check = true) {
    if (check)
        return checkSession(user_id)
            .then(
                sessionId => {
                    if (sessionId.length > 0)
                        return createToken(sessionId[0].token)
                },
                error => {
                    console.warn(error)
                    return getToken(mySessionId, check = false)
                });
}

// function createSession(sessionId) {
//     return new Promise((resolve, reject) => {
//         $.ajax({
//             type: "POST",
//             url: APPLICATION_SERVER_URL + "api/sessions",
//             data: JSON.stringify({ customSessionId: sessionId }),
//             headers: { "Content-Type": "application/json" },
//             success: response => resolve(response), // The sessionId
//             error: (error) => reject(error)
//         });
//     });
// }

function checkSession(user_id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/api/shedule/users/" + user_id,
            headers: { "Content-Type": "application/json" },
            success: response => resolve(response), // The sessionId
            error: (error) => reject(error)
        });
    });
}

function createToken(token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'api/sessions/' + token + '/connections',
            data: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
            success: (response) => resolve(response), // The token
            error: (error) => reject(error)
        });
    });
}

function kick(sessionId, connectionId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'DELETE',
            url: APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections/' + connectionId,
            data: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
            success: (response) => resolve(response),
            error: (error) => reject(error)
        });
    });
}