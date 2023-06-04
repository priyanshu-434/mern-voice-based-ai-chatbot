import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/chatSlice';
import { useSendPromptMutation } from '../slices/usersApiSlice';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const ChatScreen = () => {

    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const dispatch = useDispatch();

    const [sendPrompt, { isLoading }] = useSendPromptMutation();

    const { recentChat } = useSelector((state) => state.chat);

    useEffect(() => {

        setPrompt(recentChat.prompt);
        setResponse(recentChat.response);


    }, [recentChat.setPrompt, recentChat.setResponse]);



    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [transcript, setTranscript] = useState(null)

    useEffect(() => { handleListen() }, [isListening])
    useEffect(() => { handleSpeaking() }, [isSpeaking])


    const handleListen = () => {
        if (isListening) {
            mic.start()
            mic.onend = () => {
                console.log('continue..');
                mic.start()
            }
        } else {
            mic.stop()
            mic.onend = () => {
                console.log('Stopped mic on click');
            }
        }

        mic.onstart = () => {
            console.log('Mic on');
        }

        mic.onresult = event => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')

            console.log(transcript);
            setTranscript(transcript)

            mic.onerror = (event) => {
                console.log(event.error);
            }
        }
    }


    const handleSpeaking = () => {

        const synthesis = window.speechSynthesis;



        if (isSpeaking) {
            const utterance = new SpeechSynthesisUtterance(recentChat.response);
            synthesis.speak(utterance)

            console.log("Started speaking on click");
        } else {
            synthesis.cancel();
            console.log("Stopped speaking on click");

        }


        // synthesis.speak(utterance);
    }



    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const res = await sendPrompt({ prompt, response }).unwrap();
            dispatch(setCredentials({ ...res }));
            const synthesis = window.speechSynthesis;

            const utterance = new SpeechSynthesisUtterance(res.response);
            setIsSpeaking(prevState => !prevState)
            synthesis.speak(utterance);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }

    };

    return (
        <FormContainer>
            <h1>Chatbot</h1>

            <div style={{
                width: '100%',
                height: '10rem',
                border: '1px solid #cecece',
                borderRadius: '5px',
                padding: '.5rem',
                overflowY: 'auto',
            }}>
                {recentChat.response ? recentChat.response : <p style={{ color: '#666' }}>Chatbot response</p>}
            </div>

            <button style={{
                margin: '1em auto',
                width: '10rem',
            }} onClick={() => setIsSpeaking(prevState => !prevState)}>Listen/Cancel</button>

            <Form onSubmit={submitHandler}>

                <Form.Group className='my-2' controlId='prompt'>
                    <Form.Label>Prompt</Form.Label>
                    <Form.Control
                        type='prompt'
                        placeholder='Enter prompt'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                {isLoading ? <Loader /> : ''}

                <Button type='submit' variant='primary' className='mt-3'>
                    Send
                </Button>
            </Form>

            {isListening ? <span style={{
                textAlign: 'center',
            }}>mic on</span> : <span style={{
                textAlign: 'center'
            }}>mic off</span>}

            <button style={{
                margin: '1em auto',
                width: '10rem',
            }} onClick={() => setIsListening(prevState => !prevState)}>
                Start/Stop
            </button>

            <p style={{ textAlign: 'center' }}>{transcript}</p>
            <button style={{
                margin: 'auto',
                width: '10rem',
            }} onClick={() => setPrompt(transcript)}>set</button>

        </FormContainer>


    );
};

export default ChatScreen;







// import { useState, useEffect } from 'react';
// import { Form, Button } from 'react-bootstrap';
// import FormContainer from '../components/FormContainer';
// import Loader from '../components/Loader';

// import { toast } from 'react-toastify';

// import { useDispatch, useSelector } from 'react-redux';
// import { setCredentials } from '../slices/authSlice';
// import { useSendPromptMutation, useUpdateUserMutation } from '../slices/usersApiSlice';

// const ChatScreen = () => {

//     const [response, setResponse] = useState('');
//     const [prompt, setPrompt] = useState('');

//     const submitHandler = () => { };

//     return (
//         <FormContainer>
//             <h1>Chatbot</h1>

//             <Form onSubmit={submitHandler}>
//                 <Form.Group className='my-2' controlId='response'>
//                     <Form.Control
//                         type='response'
//                         readOnly
//                         placeholder='Chatbot response'
//                         value={response}
//                         style={{
//                             width: '100%',
//                             height: '10rem',
//                         }}
//                     ></Form.Control>
//                 </Form.Group>

//                 <Form.Group className='my-2' controlId='prompt'>
//                     <Form.Label>Prompt</Form.Label>
//                     <Form.Control
//                         type='prompt'
//                         placeholder='Enter prompt'
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                     ></Form.Control>
//                 </Form.Group>

//                 {/* {isLoading ? <Loader /> : ''} */}

//                 <Button type='submit' variant='primary' className='mt-3'>
//                     Send
//                 </Button>
//             </Form>

//         </FormContainer>
//     );
// };

// export default ChatScreen;