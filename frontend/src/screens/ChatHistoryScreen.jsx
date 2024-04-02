import { useState, useEffect } from 'react';
import { useGetChatHistoryMutation } from '../slices/usersApiSlice';

const ChatHistoryScreen = () => {

    const [chats, setChats] = useState([]);

    const [history] = useGetChatHistoryMutation();

    const fetchChats = () => {
        fetch(`/api/users/history`)
            .then(res => res.json())
            .then(data => setChats(data))
            .catch(err => console.log(err));
    }

    // const getChats = async () => {
    //     try {
    //         setChats(await history().unwrap());
    //     } catch (err) {
    //         toast.error(err?.data?.message || err.error);
    //     }
    // };

    useEffect(() => {
        // getChats();
        fetchChats();
        console.log(chats);
    }, []);

    return (
        <div style={{
            // marginBottom: '5em'
        }}>
            <h1 style={{
                textAlign: 'center',
                margin: '.5em auto',
            }}>History</h1>
            <div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    justifyContent: 'center',
                    border: '1px solid lightgray',
                    borderRadius: '10px',
                    width: '80%',
                    margin: '1em auto',
                    gap: '0.5em',
                    // overflowY: 'scroll',
                    // height: '40rem',
                    marginBottom: '5em',
                }}>
                    {
                        chats.map(chat => (
                            <div key={chat._id} style={{
                                margin: '2em',
                            }}>
                                <div style={{
                                    marginRight: 'auto',
                                    width: '40%',
                                    border: '1px solid #aaaaaa',
                                    minHeight: '3rem',
                                    padding: '0.5rem',
                                    margin: '0.5rem',
                                    borderRadius: '7px',
                                    marginTop: '0.5rem',
                                    backgroundColor: 'lightgreen',
                                    // display: 'flex',
                                    // justifyContent: 'center',
                                    // alignItems: 'center'
                                }}>
                                    {chat.prompt}
                                </div>
                                <div style={{
                                    width: '50%',
                                    border: '1px solid #aaaaaa',
                                    minHeight: '3rem',
                                    padding: '0.5rem',
                                    margin: '0.5rem',
                                    borderRadius: '7px',
                                    marginTop: '0.5rem',
                                    marginLeft: 'auto',
                                    backgroundColor: 'lightskyblue',
                                }}>
                                    {chat.response}
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </div>
    );
}

export default ChatHistoryScreen;