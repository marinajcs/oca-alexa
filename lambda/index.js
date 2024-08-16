const Alexa = require('ask-sdk-core');
const {
    LaunchRequestHandler,
    configuracion1Handler,
    ayudaReglasHandler,
    nuevaPartidaHandler,
    addJugadorHandler,
    jugarTurnoHandler,
    preguntasVyFHandler,
    preguntasCifrasHandler,
    //preguntasCompasHandler,
    preguntasCasillaHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler
} = require('./handlers');

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        configuracion1Handler,
        HelpIntentHandler,
        ayudaReglasHandler,
        nuevaPartidaHandler,
        addJugadorHandler,
        jugarTurnoHandler,
        preguntasVyFHandler,
        preguntasCifrasHandler,
        preguntasCasillaHandler,
        //preguntasCompasHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
